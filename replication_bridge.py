"""Reliable SQLite outbox replication to PostgreSQL during cutover."""

from __future__ import annotations

import json
import sqlite3
import threading
import time
from contextlib import closing
from pathlib import Path

import postgres_store


def ensure_outbox(conn: sqlite3.Connection) -> None:
    conn.execute("""
        CREATE TABLE IF NOT EXISTS replication_outbox (
            event_id INTEGER PRIMARY KEY AUTOINCREMENT,
            document_key TEXT NOT NULL,
            operation TEXT NOT NULL CHECK(operation IN ('upsert','delete')),
            revision INTEGER,
            payload TEXT,
            created_at REAL NOT NULL,
            attempts INTEGER NOT NULL DEFAULT 0,
            last_error TEXT
        )
    """)
    conn.execute("CREATE INDEX IF NOT EXISTS replication_outbox_created ON replication_outbox(event_id)")


def enqueue_upsert(conn: sqlite3.Connection,key: str,value,revision: int) -> None:
    ensure_outbox(conn)
    conn.execute("""
        INSERT INTO replication_outbox(document_key,operation,revision,payload,created_at)
        VALUES(?,?,?,?,?)
    """,(key,"upsert",int(revision),json.dumps(value,ensure_ascii=False,separators=(",",":"),allow_nan=False),time.time()))


def enqueue_delete(conn: sqlite3.Connection,key: str) -> None:
    ensure_outbox(conn)
    conn.execute("""
        INSERT INTO replication_outbox(document_key,operation,revision,payload,created_at)
        VALUES(?,?,NULL,NULL,?)
    """,(key,"delete",time.time()))


def pending_count(sqlite_path: Path) -> int:
    with closing(sqlite3.connect(str(sqlite_path),timeout=30)) as conn:
        ensure_outbox(conn)
        count=int(conn.execute("SELECT count(*) FROM replication_outbox").fetchone()[0])
        conn.commit()
        return count


class ReplicationWorker:
    def __init__(self,sqlite_path: Path,database_url: str,poll_seconds: float=1.0):
        self.sqlite_path=Path(sqlite_path)
        self.database_url=database_url
        self.poll_seconds=poll_seconds
        self.stop_event=threading.Event()
        self.thread=threading.Thread(target=self.run,name="sp-f001a-postgres-mirror",daemon=True)

    def start(self) -> None:
        postgres_store.init_database(self.database_url)
        self.thread.start()

    def stop(self,timeout: float=5.0) -> None:
        self.stop_event.set()
        self.thread.join(timeout)

    def run(self) -> None:
        while not self.stop_event.is_set():
            processed=self.process_one()
            if not processed:
                self.stop_event.wait(self.poll_seconds)

    def process_one(self) -> bool:
        with closing(sqlite3.connect(str(self.sqlite_path),timeout=30)) as source:
            source.execute("PRAGMA busy_timeout=5000")
            ensure_outbox(source)
            source.commit()
            event=source.execute("""
                SELECT event_id,document_key,operation,revision,payload
                FROM replication_outbox ORDER BY event_id LIMIT 1
            """).fetchone()
        if not event:
            return False
        event_id,key,operation,revision,payload=event
        try:
            with postgres_store.connect_database(self.database_url) as target:
                target.execute("BEGIN")
                if operation=="delete":
                    postgres_store.delete_document(target,key)
                else:
                    postgres_store.replicate_document(target,key,json.loads(payload),int(revision))
                target.commit()
            with closing(sqlite3.connect(str(self.sqlite_path),timeout=30)) as source:
                source.execute("DELETE FROM replication_outbox WHERE event_id=?",(event_id,))
                source.commit()
        except Exception as exc:
            with closing(sqlite3.connect(str(self.sqlite_path),timeout=30)) as source:
                source.execute("""
                    UPDATE replication_outbox SET attempts=attempts+1,last_error=? WHERE event_id=?
                """,(str(exc)[:1000],event_id))
                source.commit()
            self.stop_event.wait(min(30,self.poll_seconds*5))
        return True
