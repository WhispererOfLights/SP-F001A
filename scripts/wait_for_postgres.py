#!/usr/bin/env python3
"""Wait until TEST_DATABASE_URL or DATABASE_URL accepts connections."""

import os
import sys
import time

import psycopg


url=os.environ.get("TEST_DATABASE_URL") or os.environ.get("DATABASE_URL")
if not url:
    raise SystemExit("TEST_DATABASE_URL ou DATABASE_URL absent")

deadline=time.monotonic()+60
last_error=None
while time.monotonic()<deadline:
    try:
        with psycopg.connect(url,connect_timeout=3) as conn:
            conn.execute("SELECT 1").fetchone()
        print("PostgreSQL prêt")
        raise SystemExit(0)
    except Exception as exc:
        last_error=exc
        time.sleep(1)
raise SystemExit(f"PostgreSQL indisponible après 60 s: {last_error}")
