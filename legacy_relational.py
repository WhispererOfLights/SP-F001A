"""Read-only adapter used exclusively to migrate the former hybrid schema."""
import json

TABLES = (
    "units", "operations", "connectors", "connector_events", "comments",
    "edit_history", "lot_splits", "quantity_history", "reference_entries",
)


def read_v2(conn, key):
    stored = conn.execute("SELECT metadata,revision FROM documents WHERE key=?", (key,)).fetchone()
    if not stored:
        return None
    result = json.loads(stored[0])
    collections = conn.execute("SELECT path,entity_table FROM collections WHERE document_key=?", (key,)).fetchall()
    for path_text, table in sorted(collections, key=lambda c: len(json.loads(c[0]))):
        if table not in TABLES:
            raise ValueError("Unknown legacy entity table")
        path = json.loads(path_text)
        rows = [json.loads(r[0]) for r in conn.execute(
            f"SELECT payload FROM {table} WHERE document_key=? AND collection_path=? ORDER BY position",
            (key, path_text))]
        if not path:
            result = rows
        else:
            parent = result
            for part in path[:-1]:
                parent = parent[part]
            parent[path[-1]] = rows
    return result, stored[1]
