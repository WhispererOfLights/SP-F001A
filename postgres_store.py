"""PostgreSQL document storage for SP-F001A.

The application edits complete OF documents. PostgreSQL keeps that lossless JSONB
payload as the source of truth while exposing reporting views for data users.
"""

from __future__ import annotations

from contextlib import contextmanager
from datetime import datetime, timezone
from typing import Iterable

from relational_store import ConflictError
import postgres_relational


POSTGRES_SCHEMA_VERSION = 2


def _psycopg():
    try:
        import psycopg
        from psycopg.types.json import Jsonb
    except ImportError as exc:
        raise RuntimeError(
            "Le pilote PostgreSQL manque. Installez requirements.txt avant d'utiliser DATABASE_URL."
        ) from exc
    return psycopg, Jsonb


@contextmanager
def connect_database(database_url: str):
    psycopg, _ = _psycopg()
    conninfo="" if database_url=="postgresql-env" else database_url
    with psycopg.connect(conninfo, connect_timeout=10) as conn:
        yield conn


def is_postgres_connection(conn) -> bool:
    return conn.__class__.__module__.split(".", 1)[0] == "psycopg"


def create_schema(conn) -> None:
    conn.execute("""
        CREATE TABLE IF NOT EXISTS spf_schema (
            singleton BOOLEAN PRIMARY KEY DEFAULT TRUE CHECK (singleton),
            version INTEGER NOT NULL,
            updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS documents (
            key TEXT PRIMARY KEY,
            kind TEXT NOT NULL CHECK (kind IN ('of','user','reference')),
            revision BIGINT NOT NULL CHECK (revision > 0),
            payload JSONB NOT NULL,
            updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.execute("CREATE INDEX IF NOT EXISTS documents_kind_idx ON documents(kind)")
    conn.execute("CREATE INDEX IF NOT EXISTS documents_payload_gin ON documents USING GIN(payload)")
    current = conn.execute("SELECT version FROM spf_schema WHERE singleton=TRUE").fetchone()
    current_version = int(current[0]) if current else 0
    if current_version > POSTGRES_SCHEMA_VERSION:
        raise ValueError("La base PostgreSQL est plus récente que ce serveur")
    _, Jsonb = _psycopg()
    postgres_relational.create_schema(conn, Jsonb)
    if current_version < POSTGRES_SCHEMA_VERSION:
        postgres_relational.rebuild(conn, Jsonb)
    conn.execute("""
        INSERT INTO spf_schema(singleton,version) VALUES(TRUE,%s)
        ON CONFLICT(singleton) DO UPDATE SET version=EXCLUDED.version,updated_at=CURRENT_TIMESTAMP
    """, (POSTGRES_SCHEMA_VERSION,))
    _create_reporting_views(conn)


def _create_reporting_views(conn) -> None:
    conn.execute("""
        CREATE OR REPLACE VIEW spf_work_orders AS
        SELECT d.key AS document_key,
               d.revision,
               d.updated_at,
               d.payload #>> '{header,id}' AS id,
               d.payload #>> '{header,of}' AS of_number,
               d.payload #>> '{header,codeArticle}' AS article,
               d.payload #>> '{header,description}' AS description,
               d.payload #>> '{header,otp}' AS otp,
               d.payload #>> '{header,status}' AS status
        FROM documents d WHERE d.kind='of'
    """)
    conn.execute("""
        CREATE OR REPLACE VIEW spf_units AS
        SELECT d.key AS document_key,
               d.payload #>> '{header,of}' AS of_number,
               unit->>'id' AS unit_id,
               unit->>'sn' AS sn,
               unit->>'lot' AS lot,
               unit->>'unitKind' AS unit_kind,
               unit->>'status' AS status,
               unit->>'qteActuelle' AS current_quantity,
               unit->>'snProduitFini' AS finished_product_sn,
               unit AS source
        FROM documents d
        CROSS JOIN LATERAL jsonb_array_elements(COALESCE(d.payload #> '{units,rows}','[]'::jsonb)) unit
        WHERE d.kind='of'
    """)
    sections = {
        "rework": ("rows", "spf_rework_operations"),
        "consommables": ("ops", "spf_consumable_operations"),
        "testequip": ("rows", "spf_equipment_use"),
        "faits": ("rows", "spf_technical_follow_up"),
        "etuvage": ("rows", "spf_oven_runs"),
        "demating": ("connectors", "spf_connectors"),
    }
    for section, (collection, view) in sections.items():
        conn.execute(f"""
            CREATE OR REPLACE VIEW {view} AS
            SELECT d.key AS document_key,
                   d.payload #>> '{{header,of}}' AS of_number,
                   item->>'id' AS row_id,
                   item->>'createdVisa' AS created_by,
                   item->>'createdDT' AS created_at,
                   CASE WHEN lower(COALESCE(item->>'validated','false'))='true' THEN TRUE ELSE FALSE END AS validated,
                   CASE WHEN lower(COALESCE(item->>'deleted','false'))='true' THEN TRUE ELSE FALSE END AS deleted,
                   item AS source
            FROM documents d
            CROSS JOIN LATERAL jsonb_array_elements(
                COALESCE(d.payload #> '{{{section},{collection}}}','[]'::jsonb)
            ) item
            WHERE d.kind='of'
        """)


def init_database(database_url: str) -> None:
    with connect_database(database_url) as conn:
        create_schema(conn)
        conn.commit()


def read_document(conn, key: str):
    row = conn.execute("SELECT payload,revision FROM documents WHERE key=%s", (key,)).fetchone()
    return (row[0], int(row[1])) if row else None


def read_documents(conn, keys: Iterable[str]):
    unique=list(dict.fromkeys(str(key) for key in keys if key))
    if not unique:
        return {}
    rows=conn.execute("SELECT key,payload,revision FROM documents WHERE key=ANY(%s)", (unique,)).fetchall()
    return {key:(payload,int(revision)) for key,payload,revision in rows}


def write_document(conn, key: str, value, updated_at=None, expected=None, enforce=False) -> int:
    _, Jsonb = _psycopg()
    current=conn.execute("SELECT revision FROM documents WHERE key=%s FOR UPDATE", (key,)).fetchone()
    revision=int(current[0]) if current else 0
    if enforce and expected != revision:
        raise ConflictError("Le document a ete modifie par une autre personne. Rechargez avant de sauvegarder.")
    next_revision=revision+1
    kind="of" if key.startswith("of:") else "user" if key.startswith("user:") else "reference"
    timestamp=updated_at
    if isinstance(timestamp,(int,float)):
        timestamp=datetime.fromtimestamp(timestamp,tz=timezone.utc)
    conn.execute("""
        INSERT INTO documents(key,kind,revision,payload,updated_at)
        VALUES(%s,%s,%s,%s,COALESCE(%s,CURRENT_TIMESTAMP))
        ON CONFLICT(key) DO UPDATE SET
            kind=EXCLUDED.kind,revision=EXCLUDED.revision,payload=EXCLUDED.payload,updated_at=EXCLUDED.updated_at
    """, (key,kind,next_revision,Jsonb(value),timestamp))
    stored = conn.execute("SELECT updated_at FROM documents WHERE key=%s", (key,)).fetchone()
    postgres_relational.sync_document(conn, key, value, next_revision, stored[0], Jsonb)
    return next_revision


def import_document(conn, key: str, value, revision: int, updated_at=None) -> None:
    _, Jsonb = _psycopg()
    kind="of" if key.startswith("of:") else "user" if key.startswith("user:") else "reference"
    timestamp=updated_at
    if isinstance(timestamp,(int,float)):
        timestamp=datetime.fromtimestamp(timestamp,tz=timezone.utc)
    conn.execute("""
        INSERT INTO documents(key,kind,revision,payload,updated_at)
        VALUES(%s,%s,%s,%s,COALESCE(%s,CURRENT_TIMESTAMP))
        ON CONFLICT(key) DO UPDATE SET
            kind=EXCLUDED.kind,revision=EXCLUDED.revision,payload=EXCLUDED.payload,updated_at=EXCLUDED.updated_at
    """, (key,kind,int(revision),Jsonb(value),timestamp))
    stored = conn.execute("SELECT payload,revision,updated_at FROM documents WHERE key=%s", (key,)).fetchone()
    postgres_relational.sync_document(conn, key, stored[0], int(stored[1]), stored[2], Jsonb)


def replicate_document(conn, key: str, value, revision: int) -> None:
    _, Jsonb = _psycopg()
    kind="of" if key.startswith("of:") else "user" if key.startswith("user:") else "reference"
    conn.execute("""
        INSERT INTO documents(key,kind,revision,payload,updated_at)
        VALUES(%s,%s,%s,%s,CURRENT_TIMESTAMP)
        ON CONFLICT(key) DO UPDATE SET
            kind=EXCLUDED.kind,revision=EXCLUDED.revision,payload=EXCLUDED.payload,updated_at=CURRENT_TIMESTAMP
        WHERE documents.revision <= EXCLUDED.revision
    """, (key,kind,int(revision),Jsonb(value)))
    stored = conn.execute("SELECT payload,revision,updated_at FROM documents WHERE key=%s", (key,)).fetchone()
    postgres_relational.sync_document(conn, key, stored[0], int(stored[1]), stored[2], Jsonb)


def delete_document(conn, key: str) -> None:
    postgres_relational.delete_projection(conn, key)
    conn.execute("DELETE FROM documents WHERE key=%s", (key,))


def document_keys(conn) -> list[str]:
    return [row[0] for row in conn.execute("SELECT key FROM documents ORDER BY key").fetchall()]


def document_revisions(conn, keys: Iterable[str]) -> dict[str,int]:
    unique=list(dict.fromkeys(str(key) for key in keys if key))
    if not unique:
        return {}
    return {key:int(revision) for key,revision in conn.execute(
        "SELECT key,revision FROM documents WHERE key=ANY(%s)",(unique,)
    ).fetchall()}
