#!/usr/bin/env python3
"""Enable temporary SQLite change capture before a PostgreSQL cutover."""

from __future__ import annotations

import argparse
import sqlite3
import sys
from contextlib import closing
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT))

from replication_bridge import ensure_capture_triggers, pending_count


def main() -> int:
    parser=argparse.ArgumentParser()
    parser.add_argument("--sqlite",required=True,type=Path)
    args=parser.parse_args()
    path=args.sqlite.expanduser().resolve()
    if not path.is_file():
        parser.error(f"Base SQLite introuvable: {path}")
    with closing(sqlite3.connect(str(path),timeout=30)) as conn:
        conn.execute("PRAGMA busy_timeout=5000")
        ensure_capture_triggers(conn)
        conn.commit()
    print(f"Capture SQLite active; événements en attente: {pending_count(path)}")
    return 0


if __name__=="__main__":
    raise SystemExit(main())
