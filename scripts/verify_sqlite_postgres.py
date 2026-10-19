#!/usr/bin/env python3
"""Compare a consistent SQLite snapshot with PostgreSQL before cutover."""

from __future__ import annotations

import argparse
import os
import sys
import tempfile
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT))

import postgres_store
from scripts.migrate_sqlite_to_postgres import digest,load_snapshot,snapshot_database


def verify(sqlite_path: Path,database_url: str) -> int:
    with tempfile.TemporaryDirectory(prefix="sp-f001a-verification-") as folder:
        snapshot=Path(folder)/"snapshot.sqlite"
        snapshot_database(sqlite_path,snapshot)
        source=load_snapshot(snapshot)
    source_keys=[item[0] for item in source]
    with postgres_store.connect_database(database_url) as conn:
        target_keys=postgres_store.document_keys(conn)
        target=postgres_store.read_documents(conn,source_keys)
    failures=[]
    if set(source_keys)!=set(target_keys):
        failures.append(f"clés différentes: SQLite={len(source_keys)}, PostgreSQL={len(target_keys)}")
    for key,_,revision,_,source_hash in source:
        record=target.get(key)
        if not record:
            failures.append(f"{key}: absent")
        elif record[1]!=revision:
            failures.append(f"{key}: révision SQLite={revision}, PostgreSQL={record[1]}")
        elif digest(record[0])!=source_hash:
            failures.append(f"{key}: contenu différent")
    if failures:
        print("Vérification échouée:")
        for failure in failures[:50]:
            print(f"- {failure}")
        return 1
    print(f"Vérification réussie: {len(source)} documents strictement identiques.")
    return 0


def main() -> None:
    parser=argparse.ArgumentParser(description="Vérifie SQLite et PostgreSQL avant bascule")
    parser.add_argument("--sqlite",required=True,type=Path)
    parser.add_argument("--database-url",default=os.environ.get("DATABASE_URL",""))
    args=parser.parse_args()
    if not args.database_url:
        parser.error("--database-url ou DATABASE_URL est requis")
    raise SystemExit(verify(args.sqlite.expanduser().resolve(),args.database_url))


if __name__=="__main__":
    main()
