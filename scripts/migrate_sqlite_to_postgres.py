#!/usr/bin/env python3
"""Copy a consistent live SQLite snapshot to PostgreSQL and verify every document."""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import sqlite3
import sys
import tempfile
from contextlib import closing
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT))

import postgres_store
from relational_store import read_document


def canonical(value) -> bytes:
    return json.dumps(value,ensure_ascii=False,sort_keys=True,separators=(",",":"),allow_nan=False).encode("utf-8")


def digest(value) -> str:
    return hashlib.sha256(canonical(value)).hexdigest()


def snapshot_database(source: Path,target: Path) -> None:
    with closing(sqlite3.connect(str(source),timeout=30)) as src,closing(sqlite3.connect(str(target))) as dst:
        src.execute("PRAGMA busy_timeout=30000")
        src.backup(dst,pages=256,sleep=.05)


def load_snapshot(path: Path):
    result=[]
    with closing(sqlite3.connect(str(path))) as conn:
        rows=conn.execute("SELECT key,revision,updated_at FROM documents ORDER BY key").fetchall()
        for key,revision,updated_at in rows:
            record=read_document(conn,key)
            if not record:
                raise RuntimeError(f"Document illisible: {key}")
            result.append((key,record[0],int(revision),updated_at,digest(record[0])))
    return result


def migrate(sqlite_path: Path,database_url: str,replace: bool=False) -> int:
    if not sqlite_path.is_file():
        raise FileNotFoundError(f"Base SQLite introuvable: {sqlite_path}")
    with tempfile.TemporaryDirectory(prefix="sp-f001a-migration-") as folder:
        snapshot=Path(folder)/"snapshot.sqlite"
        print("Création d'un instantané SQLite cohérent...")
        snapshot_database(sqlite_path,snapshot)
        documents=load_snapshot(snapshot)
        print(f"Instantané prêt: {len(documents)} documents")

        postgres_store.init_database(database_url)
        with postgres_store.connect_database(database_url) as conn:
            existing=postgres_store.document_keys(conn)
            if existing and not replace:
                raise RuntimeError(
                    "La base PostgreSQL contient déjà des documents. Utilisez --replace uniquement sur la base de migration prévue."
                )
            conn.execute("BEGIN")
            if replace:
                conn.execute("DELETE FROM documents")
            for key,value,revision,updated_at,_ in documents:
                postgres_store.import_document(conn,key,value,revision,updated_at)
            conn.commit()

        failures=[]
        with postgres_store.connect_database(database_url) as conn:
            copied=postgres_store.read_documents(conn,[item[0] for item in documents])
            for key,_,revision,_,source_hash in documents:
                target=copied.get(key)
                if not target:
                    failures.append(f"{key}: absent")
                elif target[1]!=revision:
                    failures.append(f"{key}: révision {target[1]} au lieu de {revision}")
                elif digest(target[0])!=source_hash:
                    failures.append(f"{key}: contenu différent")
        if failures:
            raise RuntimeError("Vérification échouée:\n"+"\n".join(failures[:20]))
        print(f"Migration vérifiée: {len(documents)} documents identiques, révisions conservées.")
        return len(documents)


def main() -> None:
    parser=argparse.ArgumentParser(description="Migration vérifiée de SP-F001A SQLite vers PostgreSQL")
    parser.add_argument("--sqlite",required=True,type=Path,help="Chemin de sp-f001a.sqlite")
    parser.add_argument("--database-url",default=os.environ.get("DATABASE_URL",""),help="URL PostgreSQL (ou DATABASE_URL)")
    parser.add_argument("--replace",action="store_true",help="Vide la base PostgreSQL cible avant l'import")
    args=parser.parse_args()
    if not args.database_url:
        parser.error("--database-url ou DATABASE_URL est requis")
    migrate(args.sqlite.expanduser().resolve(),args.database_url,args.replace)


if __name__=="__main__":
    main()
