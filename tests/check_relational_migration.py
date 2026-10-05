"""Verify migration on a temporary SQLite snapshot, never on the source database."""
import json
import sqlite3
import sys
import tempfile
from contextlib import closing
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import server
from relational_store import SCHEMA_VERSION, read_document
from legacy_relational import read_v2


def check(source_path):
    source_path = Path(source_path).resolve()
    with tempfile.TemporaryDirectory() as folder:
        target_path = Path(folder) / server.DB_NAME
        uri = source_path.as_uri()
        if source_path.as_posix().startswith("//"):
            uri = "file://" + source_path.as_posix()
        with closing(sqlite3.connect(uri + "?mode=ro", uri=True)) as source:
            with closing(sqlite3.connect(target_path)) as target:
                source.backup(target)
        with closing(sqlite3.connect(target_path)) as conn:
            version = conn.execute("PRAGMA user_version").fetchone()[0]
            if version == 2:
                original = {key: read_v2(conn, key)[0] for key, in conn.execute("SELECT key FROM documents").fetchall()}
            elif version == SCHEMA_VERSION:
                original = {key: read_document(conn, key)[0] for key, in conn.execute("SELECT key FROM documents").fetchall()}
            else:
                original = {key: json.loads(value) for key, value in conn.execute("SELECT key,value FROM storage")}
        server.init_database(Path(folder))
        with server.connect_db(target_path) as conn:
            for key, expected in original.items():
                if read_document(conn, key)[0] != expected:
                    raise ValueError(f"Round-trip failed: {key}")
            assert conn.execute("PRAGMA integrity_check").fetchone()[0] == "ok"
            assert conn.execute("PRAGMA foreign_key_check").fetchall() == []
            assert conn.execute("SELECT count(*) FROM sqlite_master WHERE type='table' AND name='storage'").fetchone()[0] == 0
            for table, in conn.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall():
                assert not {"payload", "metadata"} & {row[1] for row in conn.execute(f'PRAGMA table_info("{table}")')}
            counts = {table: conn.execute(f"SELECT count(*) FROM {table}").fetchone()[0]
                      for table in ("work_orders", "users", "units", "operations", "connectors", "connector_events", "comments")}
        print(f"Verified {len(original)} documents, lossless migration. Source unchanged.")
        print(counts)


if __name__ == "__main__":
    check(sys.argv[1])
