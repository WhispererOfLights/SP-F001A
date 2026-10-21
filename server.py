#!/usr/bin/env python3
"""SP-F001A production server with SQLite and PostgreSQL backends."""

from __future__ import annotations

import argparse
import base64
import hashlib
import hmac
import json
import mimetypes
import os
import secrets
import sqlite3
import sys
import time
from datetime import datetime
from contextlib import contextmanager, closing
from http.cookies import SimpleCookie
from pathlib import Path
from threading import Lock
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from urllib.parse import unquote, urlparse
from relational_store import (
    SCHEMA_VERSION, ConflictError, init_schema, migrate,
    read_document as sqlite_read_document,
    read_documents as sqlite_read_documents,
    write_document as sqlite_write_document,
    encode,
)
import postgres_store
from replication_bridge import ReplicationWorker, ensure_outbox, enqueue_upsert, enqueue_delete, pending_count


ROOT = Path(__file__).resolve().parent
WRITE_LOCK = Lock()
SESSION_LOCK = Lock()
DB_NAME = "sp-f001a.sqlite"
SESSION_COOKIE = "sp_f001a_session"
SESSION_IDLE_SECONDS = 15 * 60
PASSWORD_ITERATIONS = 240_000
SESSIONS: dict[str, dict] = {}
HOME_DOCUMENTS_CACHE: dict[str, tuple[tuple, dict[str, dict]]] = {}
HOME_CACHE_LOCK = Lock()
REPLICATION_WORKER = None
READ_ONLY_ROLES = {"consultation", "lecteur seul", "lecture seule", "lecteur"}
MANAGER_ROLES = {"Admin", "Manager"}
PROTECTED_HEADER_FIELDS = {
    "id", "of", "codeArticle", "articleNo", "description", "otp", "projet",
    "ofRework", "typeOF", "status", "deleted", "deletedVisa", "deletedDT",
    "createdBy", "createdAt",
}
AUDIT_FIELDS = {
    "createdVisa", "deletedVisa", "deletedDate", "deletedDT",
    "restoredVisa", "restoredDate", "restoredDT",
}


def legacy_hash(value: str) -> str:
    """Match the historical JavaScript 32-bit hash for one-time migration."""
    result = 0
    encoded = str(value).encode("utf-16-le")
    for offset in range(0, len(encoded), 2):
        code_unit = int.from_bytes(encoded[offset:offset + 2], "little")
        result = (31 * result + code_unit) & 0xFFFFFFFF
    signed = result - 0x100000000 if result & 0x80000000 else result
    alphabet = "0123456789abcdefghijklmnopqrstuvwxyz"
    number = abs(signed)
    digits = "0" if number == 0 else ""
    while number:
        number, remainder = divmod(number, 36)
        digits = alphabet[remainder] + digits
    return ("-" if signed < 0 else "") + digits


def password_record(password: str) -> dict:
    salt = secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, PASSWORD_ITERATIONS)
    return {
        "scheme": "pbkdf2-sha256",
        "iterations": PASSWORD_ITERATIONS,
        "salt": base64.b64encode(salt).decode("ascii"),
        "digest": base64.b64encode(digest).decode("ascii"),
    }


def verify_password(user: dict, password: str) -> bool:
    auth = user.get("passwordAuth")
    if isinstance(auth, dict) and auth.get("scheme") == "pbkdf2-sha256":
        try:
            salt = base64.b64decode(auth["salt"])
            expected = base64.b64decode(auth["digest"])
            actual = hashlib.pbkdf2_hmac(
                "sha256", password.encode("utf-8"), salt, int(auth.get("iterations") or PASSWORD_ITERATIONS)
            )
            return hmac.compare_digest(actual, expected)
        except (KeyError, TypeError, ValueError):
            return False
    return hmac.compare_digest(str(user.get("pwd") or ""), legacy_hash(password))


def sanitized_user(user: dict | None) -> dict | None:
    if not isinstance(user, dict):
        return None
    return {key: value for key, value in user.items() if key not in {"pwd", "passwordAuth"}}


def key_to_filename(key: str) -> str:
    encoded = base64.urlsafe_b64encode(key.encode("utf-8")).decode("ascii").rstrip("=")
    return f"{encoded}.json"


def filename_to_key(path: Path) -> str | None:
    if path.suffix.lower() != ".json" or path.name.startswith("."):
        return None
    stem = path.stem
    padding = "=" * ((4 - len(stem) % 4) % 4)
    try:
        return base64.urlsafe_b64decode((stem + padding).encode("ascii")).decode("utf-8")
    except Exception:
        return None


@contextmanager
def connect_db(db_target: Path | str):
    if is_postgres_target(db_target):
        with postgres_store.connect_database(str(db_target)) as conn:
            yield conn
        return
    conn = sqlite3.connect(str(db_target), timeout=30)
    conn.execute("PRAGMA busy_timeout=5000")
    conn.execute("PRAGMA journal_mode=DELETE")
    conn.execute("PRAGMA foreign_keys=ON")
    try:
        with conn:
            yield conn
    finally:
        conn.close()


def is_postgres_target(target: Path | str) -> bool:
    return isinstance(target,str) and (target=="postgresql-env" or target.lower().startswith(("postgresql://","postgres://")))


def is_postgres_connection(conn) -> bool:
    return postgres_store.is_postgres_connection(conn)


def begin_write(conn) -> None:
    if is_postgres_connection(conn):
        conn.execute("BEGIN")
    else:
        conn.execute("BEGIN IMMEDIATE")


def read_document(conn,key):
    return postgres_store.read_document(conn,key) if is_postgres_connection(conn) else sqlite_read_document(conn,key)


def read_documents(conn,keys):
    return postgres_store.read_documents(conn,keys) if is_postgres_connection(conn) else sqlite_read_documents(conn,keys)


def write_document(conn,key,value,updated_at=None,expected=None,enforce=False):
    if is_postgres_connection(conn):
        return postgres_store.write_document(conn,key,value,updated_at,expected,enforce)
    return sqlite_write_document(conn,key,value,updated_at,expected,enforce)


def delete_document(conn,key):
    if is_postgres_connection(conn):
        postgres_store.delete_document(conn,key)
    else:
        conn.execute("DELETE FROM documents WHERE key = ?",(key,))


def document_keys(conn):
    if is_postgres_connection(conn):
        return postgres_store.document_keys(conn)
    return [row[0] for row in conn.execute("SELECT key FROM documents ORDER BY key").fetchall()]


def document_revisions(conn,keys):
    if is_postgres_connection(conn):
        return postgres_store.document_revisions(conn,keys)
    keys=list(keys)
    if not keys:
        return {}
    placeholders=",".join("?" for _ in keys)
    return dict(conn.execute(f"SELECT key,revision FROM documents WHERE key IN ({placeholders})",keys).fetchall())


def replication_outbox_enabled(conn=None) -> bool:
    enabled=os.environ.get("SP_F001A_REPLICATION_OUTBOX","").strip().lower() in {"1","true","yes","on"}
    enabled=enabled or bool(os.environ.get("SP_F001A_MIRROR_DATABASE_URL","").strip())
    return enabled and (conn is None or not is_postgres_connection(conn))


def cutover_read_only() -> bool:
    enabled=os.environ.get("SP_F001A_READ_ONLY","").strip().lower() in {"1","true","yes","on"}
    flag=os.environ.get("SP_F001A_READ_ONLY_FILE","").strip()
    return enabled or bool(flag and Path(flag).is_file())


def queue_upsert(conn,key,value,revision) -> None:
    if replication_outbox_enabled(conn):
        enqueue_upsert(conn,key,value,revision)


def queue_delete(conn,key) -> None:
    if replication_outbox_enabled(conn):
        enqueue_delete(conn,key)


def init_database(data_dir: Path) -> tuple[Path, int]:
    db_path = data_dir / DB_NAME
    if db_path.exists():
        with connect_db(db_path) as source:
            if source.execute("PRAGMA user_version").fetchone()[0] < SCHEMA_VERSION:
                backup = data_dir / f"sp-f001a-before-relational-{time.time_ns()}.sqlite"
                with closing(sqlite3.connect(str(backup))) as target:
                    source.backup(target)
                print(f"Migration backup: {backup}")
    with connect_db(db_path) as conn:
        version = conn.execute("PRAGMA user_version").fetchone()[0]
        imported = 0
        if version < 2:
            conn.execute("""CREATE TABLE IF NOT EXISTS storage (
                key TEXT PRIMARY KEY, value TEXT NOT NULL, updated_at REAL NOT NULL)""")
            imported = import_legacy_json(conn, data_dir)
        if not conn.in_transaction:
            begin_write(conn)
        init_schema(conn)
        migrate(conn)
        conn.commit()
    return db_path, imported


def ensure_admin_account(conn) -> None:
    if read_document(conn, "user:ADMIN"):
        return
    admin = {
        "trigram": "ADMIN",
        "role": "Admin",
        "service": "Administration",
        "prenom": "Compte",
        "nom": "Admin",
        "mustChangePassword": True,
        "passwordAuth": password_record("admin"),
    }
    write_document(conn, "user:ADMIN", admin)
    existing = read_document(conn, "users-list")
    users = list(existing[0]) if existing and isinstance(existing[0], list) else []
    if "ADMIN" not in users:
        users.append("ADMIN")
        write_document(conn, "users-list", sorted(set(users)))


def ensure_admin_database(db_path: Path | str) -> None:
    with WRITE_LOCK:
        with connect_db(db_path) as conn:
            begin_write(conn)
            ensure_admin_account(conn)
            conn.commit()


def import_legacy_json(conn: sqlite3.Connection, data_dir: Path) -> int:
    imported = 0
    for path in data_dir.glob("*.json"):
        key = filename_to_key(path)
        if not key:
            continue
        try:
            value = path.read_text(encoding="utf-8")
            json.loads(value)
        except Exception:
            continue
        before = conn.total_changes
        conn.execute(
            "INSERT OR IGNORE INTO storage(key, value, updated_at) VALUES (?, ?, ?)",
            (key, value, path.stat().st_mtime),
        )
        if conn.total_changes > before:
            imported += 1
    return imported


def storage_get(db_path: Path | str, key: str) -> str | None:
    with connect_db(db_path) as conn:
        row = api_record(conn, key)
    return encode(row[0]) if row else None


def api_record(conn, key):
    record = read_document(conn, key)
    if key.startswith("user:") and record:
        return sanitized_user(record[0]), record[1]
    if key == "of-list" and record and isinstance(record[0], list):
        entries = []
        for entry in record[0]:
            if not isinstance(entry, dict):
                entries.append(entry)
                continue
            dossier = read_document(conn, f'of:{entry.get("id")}')
            header = dossier[0].get("header", {}) if dossier and isinstance(dossier[0], dict) else {}
            entries.append({**entry, **header, "id": entry.get("id")})
        return entries, record[1]
    return record


def raw_user(db_path: Path | str, trigram: str):
    with connect_db(db_path) as conn:
        return read_document(conn, f"user:{trigram.upper()}")


def save_user(db_path: Path | str, user: dict, expected=None) -> int:
    trigram = str(user.get("trigram") or "").strip().upper()
    if not trigram:
        raise ValueError("Trigramme requis")
    user["trigram"] = trigram
    with WRITE_LOCK:
        with connect_db(db_path) as conn:
            begin_write(conn)
            revision = write_document(conn, f"user:{trigram}", user, expected=expected, enforce=expected is not None)
            queue_upsert(conn,f"user:{trigram}",user,revision)
            index_record = read_document(conn, "users-list")
            users = list(index_record[0]) if index_record and isinstance(index_record[0], list) else []
            if trigram not in users:
                users.append(trigram)
                users=sorted(set(users))
                index_revision=write_document(conn,"users-list",users)
                queue_upsert(conn,"users-list",users,index_revision)
            conn.commit()
            return revision


def storage_keys(db_path: Path | str) -> list[str]:
    with connect_db(db_path) as conn:
        return document_keys(conn)


def home_documents(db_path: Path | str) -> dict[str, dict]:
    """Load every work-order document in a small, fixed number of SQL queries."""
    with connect_db(db_path) as conn:
        listing = read_document(conn, "of-list")
        entries = listing[0] if listing and isinstance(listing[0], list) else []
        ids = [str(entry["id"]) for entry in entries if isinstance(entry, dict) and entry.get("id")]
        keys = [f"of:{of_id}" for of_id in ids]
        revisions = document_revisions(conn,keys)
        signature = tuple((key, revisions.get(key)) for key in keys)
        cache_key = str(db_path)
        with HOME_CACHE_LOCK:
            cached = HOME_DOCUMENTS_CACHE.get(cache_key)
            if cached and cached[0] == signature:
                return cached[1]
            records = read_documents(conn, keys)
            documents = {of_id: records[f"of:{of_id}"][0] for of_id in ids if f"of:{of_id}" in records}
            HOME_DOCUMENTS_CACHE[cache_key] = (signature, documents)
            return documents


def storage_put(db_path: Path | str, key: str, value: str, expected=None, enforce=False) -> int:
    with WRITE_LOCK:
        with connect_db(db_path) as conn:
            begin_write(conn)
            document=json.loads(value)
            revision = write_document(conn, key, document, expected=expected, enforce=enforce)
            queue_upsert(conn,key,document,revision)
            conn.commit()
            return revision


def storage_delete(db_path: Path | str, key: str, expected=None, enforce=False) -> None:
    with WRITE_LOCK:
        with connect_db(db_path) as conn:
            begin_write(conn)
            row = read_document(conn, key)
            if enforce and row and row[1] != expected:
                raise ConflictError("Le document a change. Rechargez avant de supprimer.")
            delete_document(conn,key)
            queue_delete(conn,key)
            conn.commit()


def can_close_work_item(user: dict) -> bool:
    role = str(user.get("role") or "Opérateur").strip().lower()
    return bool(user.get("trigram")) and role not in READ_ONLY_ROLES


def _business_rows(document: dict):
    sections = (
        ("units", "rows"), ("rework", "rows"), ("consommables", "ops"),
        ("etuvage", "rows"), ("testequip", "rows"), ("faits", "rows"),
        ("openwork", "rows"), ("demating", "connectors"),
    )
    for section, collection in sections:
        rows = document.get(section, {}).get(collection, [])
        if not isinstance(rows, list):
            continue
        yield f"{section}.{collection}", rows
        if section == "consommables":
            for row in rows:
                if isinstance(row, dict) and isinstance(row.get("items"), list):
                    yield f"{section}.{collection}.{row.get('id', '?')}.items", row["items"]
        elif section == "demating":
            for row in rows:
                if isinstance(row, dict) and isinstance(row.get("events"), list):
                    yield f"{section}.{collection}.{row.get('id', '?')}.events", row["events"]


def validate_of_document_update(user: dict, current: dict | None, updated: dict) -> None:
    """Enforce irreversible and authorship rules independently of the browser UI."""
    if user.get("role") in MANAGER_ROLES:
        return
    if not isinstance(current, dict):
        raise PermissionError("Seuls Admin et Manager peuvent créer un dossier OF")
    if not isinstance(updated, dict):
        raise ValueError("Document OF invalide")

    old_header = current.get("header") if isinstance(current.get("header"), dict) else {}
    new_header = updated.get("header") if isinstance(updated.get("header"), dict) else {}
    if any(old_header.get(field) != new_header.get(field) for field in PROTECTED_HEADER_FIELDS):
        raise PermissionError("Seuls Admin et Manager peuvent modifier l'identité ou le statut d'un OF")

    trigram = str(user.get("trigram") or "").strip().upper()
    new_collections = dict(_business_rows(updated))
    for path, old_rows in _business_rows(current):
        new_rows = new_collections.get(path, [])
        old_by_id = {row.get("id"): row for row in old_rows if isinstance(row, dict) and row.get("id")}
        new_by_id = {row.get("id"): row for row in new_rows if isinstance(row, dict) and row.get("id")}
        for row_id, old_row in old_by_id.items():
            new_row = new_by_id.get(row_id)
            if new_row is None:
                if old_row.get("validated") or old_row.get("deleted"):
                    raise PermissionError("La suppression définitive est réservée aux Admin et Manager")
                continue

            old_deleted = bool(old_row.get("deleted"))
            new_deleted = bool(new_row.get("deleted"))
            for field in AUDIT_FIELDS:
                if field in {"deletedVisa", "deletedDate", "deletedDT"} and not old_deleted and new_deleted:
                    continue
                if field in {"restoredVisa", "restoredDate", "restoredDT"} and old_deleted and not new_deleted:
                    continue
                if old_row.get(field) != new_row.get(field):
                    raise PermissionError("Les visas et dates d'audit existants ne sont pas modifiables")
            if not old_deleted and new_deleted and str(new_row.get("deletedVisa") or "").upper() != trigram:
                raise PermissionError("Le visa d'annulation doit être celui de l'utilisateur connecté")
            if old_deleted and not new_deleted and str(new_row.get("restoredVisa") or "").upper() != trigram:
                raise PermissionError("Le visa de restauration doit être celui de l'utilisateur connecté")


def set_work_item_closed(
    db_path: Path | str, key: str, tab: str, row_id: str, closed: bool, trigram: str, expected: int
) -> tuple[dict, int]:
    if not key.startswith("of:") or "/" in key or "\\" in key or len(key) > 200:
        raise ValueError("Dossier invalide")
    if tab not in {"faits", "openwork"}:
        raise ValueError("Onglet invalide")
    with WRITE_LOCK:
        with connect_db(db_path) as conn:
            begin_write(conn)
            record = read_document(conn, key)
            if not record or not isinstance(record[0], dict):
                raise ValueError("Dossier introuvable")
            document = record[0]
            rows = document.get(tab, {}).get("rows", [])
            row = next((item for item in rows if isinstance(item, dict) and item.get("id") == row_id), None)
            if not row or row.get("deleted"):
                raise ValueError("Ligne introuvable ou annulée")

            previous_date = str(row.get("closedDate") or "")
            previous_visa = str(row.get("closedVisa") or "")
            next_date = datetime.now().strftime("%d/%m/%Y") if closed else ""
            next_visa = trigram if closed else ""
            row["closedDate"] = next_date
            row["closedVisa"] = next_visa
            row["validated"] = True
            row["validError"] = ""
            row.pop("editBase", None)
            row.pop("_scopeEditConfirmed", None)

            changes = []
            if previous_date != next_date:
                changes.append({"label": "Date clôture", "from": previous_date, "to": next_date})
            if previous_visa != next_visa:
                changes.append({"label": "Visa clôture", "from": previous_visa, "to": next_visa})
            if changes:
                row.setdefault("editHistory", []).append({
                    "id": secrets.token_hex(3).upper(),
                    "dt": datetime.now().strftime("%d/%m/%Y %H:%M"),
                    "visa": trigram,
                    "changes": changes,
                })

            revision = write_document(conn, key, document, expected=expected, enforce=True)
            queue_upsert(conn,key,document,revision)
            conn.commit()
            return document, revision


class StorageServer(SimpleHTTPRequestHandler):
    data_dir: Path = ROOT / "data"
    db_path: Path | str = ROOT / "data" / DB_NAME
    database_backend = "sqlite"
    database_schema_version = SCHEMA_VERSION
    authentication_enabled = True

    def translate_path(self, path: str) -> str:
        parsed = urlparse(path)
        clean = unquote(parsed.path).lstrip("/")
        if not clean:
            clean = "index.html"
        target = (ROOT / clean).resolve()
        if ROOT not in target.parents and target != ROOT:
            return str(ROOT / "index.html")
        return str(target)

    def end_headers(self) -> None:
        self.send_header("Cache-Control", "no-store")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, If-Match, If-None-Match")
        self.send_header("Access-Control-Expose-Headers", "ETag")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("X-Frame-Options", "DENY")
        self.send_header("Referrer-Policy", "same-origin")
        super().end_headers()

    def do_OPTIONS(self) -> None:
        self.send_response(204)
        self.end_headers()

    def do_GET(self) -> None:
        request_path=urlparse(self.path).path.rstrip("/")
        public_url=os.environ.get("SP_F001A_PUBLIC_URL","").strip()
        if request_path=="/app-config.js" and public_url:
            data=f"window.SP_F001A_PUBLIC_URL = {json.dumps(public_url)};\n".encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type","application/javascript; charset=utf-8")
            self.send_header("Content-Length",str(len(data)))
            self.end_headers()
            self.wfile.write(data)
            return
        if request_path == "/api/health":
            try:
                with connect_db(self.db_path) as conn:
                    conn.execute("SELECT 1").fetchone()
            except Exception as exc:
                return self.send_json({"ok":False,"backend":self.database_backend,"error":str(exc)},503)
            payload={
                "ok": True,
                "backend": self.database_backend,
                "schemaVersion": self.database_schema_version,
                "readOnly": cutover_read_only(),
            }
            if self.database_backend=="sqlite":
                payload.update({"dataDir":str(self.data_dir),"dbPath":str(self.db_path)})
                if replication_outbox_enabled():
                    payload.update({"replicationMode":"sqlite-to-postgresql","replicationPending":pending_count(Path(self.db_path))})
            return self.send_json(payload)
        path = request_path
        if path == "/api/auth/session":
            session = self.require_session()
            if not session:
                return
            return self.send_json({"ok": True, "user": session["user"]})
        if path == "/api/admin/users":
            session = self.require_session({"Admin", "Manager"})
            if not session:
                return
            return self.send_json({"ok": True, "users": self.all_users()})
        if path == "/api/home-summary":
            if not self.require_session():
                return
            return self.send_json({"ok": True, "documents": home_documents(self.db_path)})
        if path == "/api/storage":
            if not self.require_session():
                return
            return self.send_json({"keys": storage_keys(self.db_path)})
        key = self.storage_key()
        if key is not None:
            if not self.require_session():
                return
            with connect_db(self.db_path) as conn:
                record = api_record(conn, key)
            if record is None:
                self.send_error(404, "not found")
                return
            data = encode(record[0]).encode("utf-8")
            self.send_response(200)
            self.send_header("ETag", f'"{record[1]}"')
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(data)))
            self.end_headers()
            self.wfile.write(data)
            return
        target = Path(self.translate_path(self.path))
        if (target.suffix.lower() in (".sqlite", ".db", ".py", ".bat")
                or self.data_dir == target or self.data_dir in target.parents
                or "deployment-backups" in target.parts):
            return self.send_error(403, "private server file")
        return super().do_GET()

    def do_POST(self) -> None:
        path = urlparse(self.path).path.rstrip("/")
        if path == "/api/auth/login":
            return self.auth_login()
        if path == "/api/auth/logout":
            return self.auth_logout()
        if cutover_read_only():
            return self.send_json({"ok":False,"error":"Bascule PostgreSQL en cours : modifications temporairement suspendues"},503)
        if path == "/api/auth/change-password":
            return self.auth_change_password()
        if path == "/api/auth/profile":
            return self.auth_profile()
        if path == "/api/work-items/close":
            return self.close_work_item()
        if path == "/api/admin/users/import":
            return self.admin_import_users()
        if path.startswith("/api/admin/users/") and path.endswith("/reset-password"):
            trigram = unquote(path[len("/api/admin/users/"):-len("/reset-password")]).strip("/")
            return self.admin_reset_password(trigram)
        self.send_error(404, "not found")

    def close_work_item(self) -> None:
        session = self.require_session()
        if not session:
            return
        if not can_close_work_item(session["user"]):
            return self.send_json({"ok": False, "error": "Compte en lecture seule"}, 403)
        try:
            payload = self.read_json_body()
            document, revision = set_work_item_closed(
                self.db_path,
                str(payload.get("key") or ""),
                str(payload.get("tab") or ""),
                str(payload.get("rowId") or ""),
                bool(payload.get("closed")),
                str(session["user"].get("trigram") or "").upper(),
                self.expected_revision(),
            )
        except (ConflictError, ValueError, AttributeError) as exc:
            status = 409 if isinstance(exc, ConflictError) else 400
            return self.send_json({"ok": False, "error": str(exc)}, status)
        self.send_json({"ok": True, "revision": revision, "document": document})

    def do_PUT(self) -> None:
        if cutover_read_only():
            return self.send_json({"ok":False,"error":"Bascule PostgreSQL en cours : modifications temporairement suspendues"},503)
        path = urlparse(self.path).path
        if path.startswith("/api/admin/users/"):
            trigram = unquote(path[len("/api/admin/users/"):]).strip("/")
            return self.admin_save_user(trigram)
        key = self.storage_key()
        if key is None:
            self.send_error(404, "not found")
            return
        session = self.require_session()
        if not session:
            return
        if not self.can_write_key(session["user"], key):
            return self.send_json({"ok": False, "error": "Droits insuffisants"}, 403)
        length = int(self.headers.get("Content-Length") or 0)
        if length <= 0 or length > 2_000_000:
            return self.send_json({"ok": False, "error": "Corps de requête invalide"}, 400)
        body = self.rfile.read(length)
        try:
            document = json.loads(body.decode("utf-8"))
        except Exception:
            self.send_error(400, "invalid json")
            return
        try:
            expected = self.expected_revision()
            if key.startswith("of:"):
                with connect_db(self.db_path) as conn:
                    current = read_document(conn, key)
                validate_of_document_update(session["user"], current[0] if current else None, document)
            revision = storage_put(self.db_path, key, body.decode("utf-8"), expected, True)
        except PermissionError as exc:
            return self.send_json({"ok": False, "error": str(exc)}, 403)
        except (ConflictError, ValueError) as exc:
            return self.send_json({"ok": False, "error": str(exc)}, 409)
        self.send_json({"ok": True, "revision": revision})

    def do_DELETE(self) -> None:
        if cutover_read_only():
            return self.send_json({"ok":False,"error":"Bascule PostgreSQL en cours : modifications temporairement suspendues"},503)
        path = urlparse(self.path).path
        if path.startswith("/api/admin/users/"):
            trigram = unquote(path[len("/api/admin/users/"):]).strip("/")
            return self.admin_delete_user(trigram)
        key = self.storage_key()
        if key is None:
            self.send_error(404, "not found")
            return
        session = self.require_session()
        if not session:
            return
        if not self.can_write_key(session["user"], key):
            return self.send_json({"ok": False, "error": "Droits insuffisants"}, 403)
        if session["user"].get("role") not in MANAGER_ROLES:
            return self.send_json({"ok": False, "error": "Suppression définitive réservée aux Admin et Manager"}, 403)
        try:
            storage_delete(self.db_path, key, self.expected_revision(), True)
        except (ConflictError, ValueError) as exc:
            return self.send_json({"ok": False, "error": str(exc)}, 409)
        self.send_json({"ok": True})

    def expected_revision(self):
        if self.headers.get("If-None-Match") == "*":
            return 0
        value = self.headers.get("If-Match")
        if value is None:
            raise ConflictError("Rechargez l'application (Ctrl+F5) avant de sauvegarder.")
        return int(value.strip('"'))

    def guess_type(self, path: str) -> str:
        if path.endswith(".js"):
            return "application/javascript"
        return mimetypes.guess_type(path)[0] or "application/octet-stream"

    def storage_key(self) -> str | None:
        parsed = urlparse(self.path)
        prefix = "/api/storage/"
        if not parsed.path.startswith(prefix):
            return None
        key = unquote(parsed.path[len(prefix):])
        if not key or "/" in key or "\\" in key or len(key) > 200:
            return None
        return key

    def read_json_body(self) -> dict | list:
        length = int(self.headers.get("Content-Length") or 0)
        if length <= 0 or length > 2_000_000:
            raise ValueError("Corps de requête invalide")
        return json.loads(self.rfile.read(length).decode("utf-8"))

    def session_token(self) -> str | None:
        cookie = SimpleCookie(self.headers.get("Cookie") or "")
        morsel = cookie.get(SESSION_COOKIE)
        return morsel.value if morsel else None

    def current_session(self) -> dict | None:
        token = self.session_token()
        if not token:
            return None
        now = time.time()
        with SESSION_LOCK:
            session = SESSIONS.get(token)
            if not session or now - session["lastActivity"] >= SESSION_IDLE_SECONDS:
                SESSIONS.pop(token, None)
                return None
            account = raw_user(self.db_path, session["trigram"])
            if not account:
                SESSIONS.pop(token, None)
                return None
            session["lastActivity"] = now
            session["user"] = sanitized_user(account[0])
            return session

    def require_session(self, roles: set[str] | None = None) -> dict | None:
        if not self.authentication_enabled:
            return {"trigram": "TEST", "user": {"trigram": "TEST", "role": "Admin"}}
        session = self.current_session()
        if not session:
            self.send_json({"ok": False, "error": "Session expirée"}, 401)
            return None
        if roles and session["user"].get("role") not in roles:
            self.send_json({"ok": False, "error": "Droits insuffisants"}, 403)
            return None
        return session

    @staticmethod
    def can_write_key(user: dict, key: str) -> bool:
        role = user.get("role") or "Opérateur"
        if role not in {"Opérateur", "Contrôleur", "Logistique", "Manager", "Admin"}:
            return False
        if key.startswith("user:") or key == "users-list":
            return False
        if key in {"of-list", "consommables-list", "fait-types", "status-types"}:
            return role in MANAGER_ROLES
        return True

    def auth_login(self) -> None:
        try:
            payload = self.read_json_body()
            trigram = str(payload.get("trigram") or "").strip().upper()
            password = str(payload.get("password") or "")
        except (ValueError, json.JSONDecodeError, AttributeError):
            return self.send_json({"ok": False, "error": "Requête invalide"}, 400)
        record = raw_user(self.db_path, trigram)
        if not record or not verify_password(record[0], password):
            return self.send_json({"ok": False, "error": "Trigramme ou mot de passe incorrect"}, 401)
        user = dict(record[0])
        if not isinstance(user.get("passwordAuth"), dict):
            user["passwordAuth"] = password_record(password)
            user.pop("pwd", None)
            save_user(self.db_path, user, expected=record[1])
        token = secrets.token_urlsafe(32)
        profile = sanitized_user(user)
        with SESSION_LOCK:
            SESSIONS[token] = {"trigram": trigram, "lastActivity": time.time(), "user": profile}
        self.send_json({"ok": True, "user": profile}, cookie=token)

    def auth_logout(self) -> None:
        token = self.session_token()
        if token:
            with SESSION_LOCK:
                SESSIONS.pop(token, None)
        self.send_json({"ok": True}, clear_cookie=True)

    def auth_change_password(self) -> None:
        session = self.require_session()
        if not session:
            return
        try:
            payload = self.read_json_body()
            current = str(payload.get("currentPassword") or "")
            new = str(payload.get("newPassword") or "")
        except (ValueError, json.JSONDecodeError, AttributeError):
            return self.send_json({"ok": False, "error": "Requête invalide"}, 400)
        record = raw_user(self.db_path, session["trigram"])
        user = dict(record[0]) if record else None
        if not user:
            return self.send_json({"ok": False, "error": "Compte introuvable"}, 404)
        forced = bool(user.get("mustChangePassword"))
        if not forced and not verify_password(user, current):
            return self.send_json({"ok": False, "error": "Mot de passe actuel incorrect"}, 400)
        if len(new) < 4:
            return self.send_json({"ok": False, "error": "Mot de passe trop court (min 4 caractères)"}, 400)
        if verify_password(user, new):
            return self.send_json({"ok": False, "error": "Choisissez un mot de passe différent"}, 400)
        user["passwordAuth"] = password_record(new)
        user.pop("pwd", None)
        user["mustChangePassword"] = False
        save_user(self.db_path, user, expected=record[1])
        session["user"] = sanitized_user(user)
        self.send_json({"ok": True, "user": session["user"]})

    def auth_profile(self) -> None:
        session = self.require_session()
        if not session:
            return
        try:
            payload = self.read_json_body()
        except (ValueError, json.JSONDecodeError):
            return self.send_json({"ok": False, "error": "Requête invalide"}, 400)
        record = raw_user(self.db_path, session["trigram"])
        user = dict(record[0]) if record else None
        if not user:
            return self.send_json({"ok": False, "error": "Compte introuvable"}, 404)
        for field in ("prenom", "nom", "service", "email"):
            if field in payload:
                user[field] = str(payload[field] or "").strip()
        save_user(self.db_path, user, expected=record[1])
        session["user"] = sanitized_user(user)
        self.send_json({"ok": True, "user": session["user"]})

    def all_users(self) -> list[dict]:
        users = []
        for key in storage_keys(self.db_path):
            if not key.startswith("user:"):
                continue
            record = raw_user(self.db_path, key[5:])
            if record:
                users.append(sanitized_user(record[0]))
        return sorted(users, key=lambda item: item.get("trigram", ""))

    def admin_save_user(self, trigram: str) -> None:
        if not self.require_session({"Admin", "Manager"}):
            return
        trigram = trigram.strip().upper()
        try:
            payload = self.read_json_body()
        except (ValueError, json.JSONDecodeError):
            return self.send_json({"ok": False, "error": "Requête invalide"}, 400)
        existing = raw_user(self.db_path, trigram)
        user = dict(existing[0]) if existing else {}
        for field in ("prenom", "nom", "service", "email", "role"):
            if field in payload:
                user[field] = str(payload[field] or "").strip()
        user["trigram"] = trigram
        password = str(payload.get("password") or "")
        if not existing or password:
            password = password or f"{trigram.lower()}0"
            user["passwordAuth"] = password_record(password)
            user.pop("pwd", None)
            user["mustChangePassword"] = True
        save_user(self.db_path, user, expected=existing[1] if existing else None)
        self.send_json({"ok": True, "user": sanitized_user(user), "temporaryPassword": password or None})

    def admin_import_users(self) -> None:
        if not self.require_session({"Admin", "Manager"}):
            return
        try:
            payload = self.read_json_body()
            users = payload.get("users") if isinstance(payload, dict) else None
            if not isinstance(users, list):
                raise ValueError
        except (ValueError, json.JSONDecodeError):
            return self.send_json({"ok": False, "error": "Import invalide"}, 400)
        counts = {"created": 0, "updated": 0, "unchanged": 0}
        for imported in users:
            trigram = str(imported.get("trigram") or "").strip().upper()
            if not trigram:
                continue
            existing = raw_user(self.db_path, trigram)
            user = dict(existing[0]) if existing else {"trigram": trigram}
            changed = False
            for field in ("prenom", "nom", "service", "email", "role"):
                value = str(imported.get(field) or "").strip()
                if user.get(field, "") != value:
                    user[field] = value
                    changed = True
            if not existing:
                user["passwordAuth"] = password_record(f"{trigram.lower()}0")
                user["mustChangePassword"] = True
                save_user(self.db_path, user)
                counts["created"] += 1
            elif changed:
                save_user(self.db_path, user, expected=existing[1])
                counts["updated"] += 1
            else:
                counts["unchanged"] += 1
        self.send_json({"ok": True, **counts})

    def admin_reset_password(self, trigram: str) -> None:
        if not self.require_session({"Admin", "Manager"}):
            return
        trigram = trigram.strip().upper()
        record = raw_user(self.db_path, trigram)
        if not record:
            return self.send_json({"ok": False, "error": "Compte introuvable"}, 404)
        user = dict(record[0])
        temporary = f"{trigram.lower()}0"
        user["passwordAuth"] = password_record(temporary)
        user.pop("pwd", None)
        user["mustChangePassword"] = True
        save_user(self.db_path, user, expected=record[1])
        self.send_json({"ok": True, "temporaryPassword": temporary})

    def admin_delete_user(self, trigram: str) -> None:
        if not self.require_session({"Admin", "Manager"}):
            return
        trigram = trigram.strip().upper()
        if trigram == "ADMIN":
            return self.send_json({"ok": False, "error": "Le compte ADMIN ne peut pas être supprimé"}, 400)
        storage_delete(self.db_path, f"user:{trigram}")
        with WRITE_LOCK:
            with connect_db(self.db_path) as conn:
                begin_write(conn)
                record = read_document(conn, "users-list")
                if record and isinstance(record[0], list):
                    users=[item for item in record[0] if item != trigram]
                    revision=write_document(conn,"users-list",users)
                    queue_upsert(conn,"users-list",users,revision)
                conn.commit()
        self.send_json({"ok": True})

    def send_json(self, payload: dict, status=200, cookie: str | None = None, clear_cookie=False) -> None:
        data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        if payload.get("revision") is not None:
            self.send_header("ETag", f'"{payload["revision"]}"')
        self.send_header("Content-Type", "application/json; charset=utf-8")
        if cookie:
            self.send_header("Set-Cookie", f"{SESSION_COOKIE}={cookie}; Path=/; HttpOnly; SameSite=Strict")
        elif clear_cookie:
            self.send_header("Set-Cookie", f"{SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)


def main() -> None:
    global REPLICATION_WORKER
    parser = argparse.ArgumentParser(description="SP-F001A shared production server")
    parser.add_argument("--host", default=os.environ.get("SP_F001A_HOST", "0.0.0.0"))
    parser.add_argument("--port", type=int, default=int(os.environ.get("SP_F001A_PORT", "5181")))
    parser.add_argument("--data-dir", default=os.environ.get("SP_F001A_DATA_DIR", str(ROOT / "data")))
    parser.add_argument("--database-url", default=os.environ.get("DATABASE_URL", ""), help=argparse.SUPPRESS)
    parser.add_argument("--disable-auth", action="store_true", help=argparse.SUPPRESS)
    args = parser.parse_args()

    StorageServer.data_dir = Path(args.data_dir).expanduser().resolve()
    database_target=args.database_url
    if not database_target and os.environ.get("SP_F001A_DATABASE_BACKEND","").strip().lower()=="postgresql":
        database_target="postgresql-env"
    imported = 0
    try:
        if database_target:
            postgres_store.init_database(database_target)
            StorageServer.db_path = database_target
            StorageServer.database_backend = "postgresql"
            StorageServer.database_schema_version = postgres_store.POSTGRES_SCHEMA_VERSION
        else:
            StorageServer.data_dir.mkdir(parents=True, exist_ok=True)
            probe = StorageServer.data_dir / ".write-test"
            probe.write_text("ok", encoding="utf-8")
            probe.unlink(missing_ok=True)
            StorageServer.db_path, imported = init_database(StorageServer.data_dir)
            StorageServer.database_backend = "sqlite"
            StorageServer.database_schema_version = SCHEMA_VERSION
        ensure_admin_database(StorageServer.db_path)
        StorageServer.authentication_enabled = not args.disable_auth
    except PermissionError:
        print("")
        print("ERREUR: acces refuse au dossier de donnees.")
        print(f"Dossier: {StorageServer.data_dir}")
        print("")
        print("A faire:")
        print("- creer ce dossier manuellement si besoin;")
        print("- donner les droits Modifier/Ecriture a l'utilisateur qui lance le serveur;")
        print("- ou changer SP_F001A_DATA_DIR dans start-prod.bat vers un dossier autorise.")
        sys.exit(1)
    except Exception as exc:
        print("")
        print("ERREUR: impossible d'initialiser la base de données.")
        print(f"Backend: {'PostgreSQL' if database_target else 'SQLite'}")
        print(f"Erreur : {exc}")
        sys.exit(1)

    mirror_url=os.environ.get("SP_F001A_MIRROR_DATABASE_URL","").strip()
    if StorageServer.database_backend=="sqlite" and mirror_url:
        try:
            REPLICATION_WORKER=ReplicationWorker(Path(StorageServer.db_path),mirror_url)
            REPLICATION_WORKER.start()
            print("PostgreSQL mirror: active")
        except Exception as exc:
            REPLICATION_WORKER=None
            print(f"PostgreSQL mirror: en attente ({exc})")

    server = ThreadingHTTPServer((args.host, args.port), StorageServer)
    print(f"SP-F001A server: http://{args.host}:{args.port}/")
    print(f"Database       : {StorageServer.database_backend}")
    if StorageServer.database_backend == "sqlite":
        print(f"Data directory : {StorageServer.data_dir}")
        print(f"SQLite DB      : {StorageServer.db_path}")
    if imported:
        print(f"Legacy JSON imported into SQLite: {imported}")
    print("Stop with Ctrl+C")
    try:
        server.serve_forever()
    finally:
        if REPLICATION_WORKER:
            REPLICATION_WORKER.stop()


if __name__ == "__main__":
    main()
