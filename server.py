#!/usr/bin/env python3
"""SP-F001A production server.

Serves the static app and stores shared data in one SQLite database.
Configure the data directory with SP_F001A_DATA_DIR or --data-dir.
"""

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
from contextlib import contextmanager, closing
from http.cookies import SimpleCookie
from pathlib import Path
from threading import Lock
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from urllib.parse import unquote, urlparse
from relational_store import SCHEMA_VERSION, ConflictError, init_schema, migrate, read_document, write_document, encode


ROOT = Path(__file__).resolve().parent
WRITE_LOCK = Lock()
SESSION_LOCK = Lock()
DB_NAME = "sp-f001a.sqlite"
SESSION_COOKIE = "sp_f001a_session"
SESSION_IDLE_SECONDS = 15 * 60
PASSWORD_ITERATIONS = 240_000
SESSIONS: dict[str, dict] = {}


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
def connect_db(db_path: Path):
    conn = sqlite3.connect(str(db_path), timeout=30)
    conn.execute("PRAGMA busy_timeout=5000")
    conn.execute("PRAGMA journal_mode=DELETE")
    conn.execute("PRAGMA foreign_keys=ON")
    try:
        with conn:
            yield conn
    finally:
        conn.close()


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
            conn.execute("BEGIN IMMEDIATE")
        init_schema(conn)
        migrate(conn)
        conn.commit()
    return db_path, imported


def ensure_admin_account(conn: sqlite3.Connection) -> None:
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


def ensure_admin_database(db_path: Path) -> None:
    with WRITE_LOCK:
        with connect_db(db_path) as conn:
            conn.execute("BEGIN IMMEDIATE")
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


def storage_get(db_path: Path, key: str) -> str | None:
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


def raw_user(db_path: Path, trigram: str):
    with connect_db(db_path) as conn:
        return read_document(conn, f"user:{trigram.upper()}")


def save_user(db_path: Path, user: dict, expected=None) -> int:
    trigram = str(user.get("trigram") or "").strip().upper()
    if not trigram:
        raise ValueError("Trigramme requis")
    user["trigram"] = trigram
    with WRITE_LOCK:
        with connect_db(db_path) as conn:
            conn.execute("BEGIN IMMEDIATE")
            revision = write_document(conn, f"user:{trigram}", user, expected=expected, enforce=expected is not None)
            index_record = read_document(conn, "users-list")
            users = list(index_record[0]) if index_record and isinstance(index_record[0], list) else []
            if trigram not in users:
                users.append(trigram)
                write_document(conn, "users-list", sorted(set(users)))
            conn.commit()
            return revision


def storage_keys(db_path: Path) -> list[str]:
    with connect_db(db_path) as conn:
        rows = conn.execute("SELECT key FROM documents ORDER BY key").fetchall()
    return [row[0] for row in rows]


def home_documents(db_path: Path) -> dict[str, dict]:
    """Load every work-order document through one DB connection."""
    with connect_db(db_path) as conn:
        listing = read_document(conn, "of-list")
        entries = listing[0] if listing and isinstance(listing[0], list) else []
        documents = {}
        for entry in entries:
            if not isinstance(entry, dict) or not entry.get("id"):
                continue
            record = read_document(conn, f'of:{entry["id"]}')
            if record and isinstance(record[0], dict):
                documents[str(entry["id"])] = record[0]
    return documents


def storage_put(db_path: Path, key: str, value: str, expected=None, enforce=False) -> int:
    with WRITE_LOCK:
        with connect_db(db_path) as conn:
            conn.execute("BEGIN IMMEDIATE")
            revision = write_document(conn, key, json.loads(value), expected=expected, enforce=enforce)
            conn.commit()
            return revision


def storage_delete(db_path: Path, key: str, expected=None, enforce=False) -> None:
    with WRITE_LOCK:
        with connect_db(db_path) as conn:
            conn.execute("BEGIN IMMEDIATE")
            row = read_document(conn, key)
            if enforce and row and row[1] != expected:
                raise ConflictError("Le document a change. Rechargez avant de supprimer.")
            conn.execute("DELETE FROM documents WHERE key = ?", (key,))
            conn.commit()


class StorageServer(SimpleHTTPRequestHandler):
    data_dir: Path = ROOT / "data"
    db_path: Path = ROOT / "data" / DB_NAME
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
        if self.path == "/api/health":
            return self.send_json({
                "ok": True,
                "backend": "sqlite",
                "schemaVersion": SCHEMA_VERSION,
                "dataDir": str(self.data_dir),
                "dbPath": str(self.db_path),
            })
        path = urlparse(self.path).path.rstrip("/")
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
        if path == "/api/auth/change-password":
            return self.auth_change_password()
        if path == "/api/auth/profile":
            return self.auth_profile()
        if path == "/api/admin/users/import":
            return self.admin_import_users()
        if path.startswith("/api/admin/users/") and path.endswith("/reset-password"):
            trigram = unquote(path[len("/api/admin/users/"):-len("/reset-password")]).strip("/")
            return self.admin_reset_password(trigram)
        self.send_error(404, "not found")

    def do_PUT(self) -> None:
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
        body = self.rfile.read(length)
        try:
            json.loads(body.decode("utf-8"))
        except Exception:
            self.send_error(400, "invalid json")
            return
        try:
            expected = self.expected_revision()
            revision = storage_put(self.db_path, key, body.decode("utf-8"), expected, True)
        except (ConflictError, ValueError) as exc:
            return self.send_json({"ok": False, "error": str(exc)}, 409)
        self.send_json({"ok": True, "revision": revision})

    def do_DELETE(self) -> None:
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
        if key in {"consommables-list", "fait-types", "status-types"}:
            return role in {"Admin", "Manager"}
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
                conn.execute("BEGIN IMMEDIATE")
                record = read_document(conn, "users-list")
                if record and isinstance(record[0], list):
                    write_document(conn, "users-list", [item for item in record[0] if item != trigram])
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
    parser = argparse.ArgumentParser(description="SP-F001A shared production server")
    parser.add_argument("--host", default=os.environ.get("SP_F001A_HOST", "0.0.0.0"))
    parser.add_argument("--port", type=int, default=int(os.environ.get("SP_F001A_PORT", "5181")))
    parser.add_argument("--data-dir", default=os.environ.get("SP_F001A_DATA_DIR", str(ROOT / "data")))
    parser.add_argument("--disable-auth", action="store_true", help=argparse.SUPPRESS)
    args = parser.parse_args()

    StorageServer.data_dir = Path(args.data_dir).expanduser().resolve()
    try:
        StorageServer.data_dir.mkdir(parents=True, exist_ok=True)
        probe = StorageServer.data_dir / ".write-test"
        probe.write_text("ok", encoding="utf-8")
        probe.unlink(missing_ok=True)
        StorageServer.db_path, imported = init_database(StorageServer.data_dir)
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
    except (sqlite3.Error, ValueError) as exc:
        print("")
        print("ERREUR: impossible d'initialiser la base SQLite.")
        print(f"Dossier: {StorageServer.data_dir}")
        print(f"Erreur : {exc}")
        sys.exit(1)

    server = ThreadingHTTPServer((args.host, args.port), StorageServer)
    print(f"SP-F001A server: http://{args.host}:{args.port}/")
    print(f"Data directory : {StorageServer.data_dir}")
    print(f"SQLite DB      : {StorageServer.db_path}")
    if imported:
        print(f"Legacy JSON imported into SQLite: {imported}")
    print("Stop with Ctrl+C")
    server.serve_forever()


if __name__ == "__main__":
    main()
