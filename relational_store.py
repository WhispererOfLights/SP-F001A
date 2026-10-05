"""SQL business columns and relationships; JSON is only the HTTP wire format."""

import json
import math
import time

from legacy_relational import TABLES as LEGACY_TABLES, read_v2

SCHEMA_VERSION = 3
COMMON = "id createdVisa createdDT validated validError connError deleted deletedReason deletedVisa deletedDate deletedDT cancelledVisa cancelledDT snScope unitId lineNo nextLineNo".split()
FIELDS = {
    "dossiers": ["nextLineNo"],
    "work_orders": "of sn lot codeArticle articleNo description otp projet ofRework typeOF status snProduitFini createdBy createdAt snLines qte qteInitiale unitKind lastEtuvageDT".split(),
    "users": "trigram prenom nom service role pwd".split(),
    "units": "sn lot status snProduitFini qte qteInitiale qteActuelle unitKind kind remarque snError parentUnitId splitId splitDate".split(),
    "unit_snapshots": "sn lot status snProduitFini qte qteInitiale qteActuelle unitKind kind remarque snError parentUnitId splitId splitDate".split(),
    "rework_operations": "sortieVisa repere qty action1 codeERP valeur lot dc sn fiche etape isAdjust visaOper dateOper visaCtrl dateCtrl remarques tracaOk visaTraca dateTraca".split(),
    "consumable_operations": ["fiche", "op"],
    "consumable_items": "consoId echantillon lot dp remarque tracaOk visaTraca dateTraca qty".split(),
    "equipment_use": "nInv type designation dateExpiration isFour visa checkDate commentaires".split(),
    "technical_facts": "type numero visa date lien commentaires closedVisa closedDate".split(),
    "oven_runs": "fourN duree temp entreeVisa entreeDT sortieVisa sortieDT".split(),
    "open_work": "nOW description openVisa openDate closedVisa closedDate commentaires".split(),
    "connectors": ["nConect"],
    "connector_events": "dt visa action remarque".split(),
    "comments": "dt visa text replyTo editedDT editedVisa".split(),
    "edit_history": ["dt", "visa"],
    "history_changes": ["label", "from", "to"],
    "quantity_history": "before after dt visa splitId".split(),
    "lot_splits": "sourceId sourceLot initialQty remainingQty dt visa".split(),
    "split_destinations": ["lot", "qty"],
    "control_cancellations": "dt visa reason previousVisa previousDate".split(),
    "trace_cancellations": "dt visa reason previousVisa previousDate".split(),
    "unit_scope_members": [],
    "reference_entries": "cat sap designation codeArticle description service role label value".split(),
    "of_index_entries": "of sn lot codeArticle description otp projet status snProduitFini ofRework createdBy createdAt lastEtuvageDT".split(),
    "section_settings": ["mode", "nextLineNo"],
    "edit_snapshots": [],
    "extension_records": [],
    "collections": [],
}
ENTITY_TABLES = tuple(FIELDS)


class ConflictError(Exception):
    pass


def encode(value):
    return json.dumps(value, ensure_ascii=False, separators=(",", ":"), allow_nan=False)


def quote(name):
    return '"' + name.replace('"', '""') + '"'


def column(name):
    return "field_" + name


def create_schema(conn):
    conn.execute("""CREATE TABLE documents (
        key TEXT PRIMARY KEY, kind TEXT NOT NULL CHECK(kind IN ('of','user','reference')),
        revision INTEGER NOT NULL CHECK(revision>0), updated_at REAL NOT NULL)""")
    conn.execute("""CREATE TABLE records (
        record_id INTEGER PRIMARY KEY, document_key TEXT NOT NULL
            REFERENCES documents(key) ON DELETE CASCADE,
        parent_record_id INTEGER, field_name TEXT, position INTEGER NOT NULL CHECK(position>=0),
        entity_table TEXT NOT NULL, shape TEXT NOT NULL
            CHECK(shape IN ('object','array','null','bool','int','bigint','real','text')),
        UNIQUE(document_key,record_id),
        FOREIGN KEY(document_key,parent_record_id)
            REFERENCES records(document_key,record_id) ON DELETE CASCADE)""")
    conn.execute("CREATE UNIQUE INDEX record_root ON records(document_key) WHERE parent_record_id IS NULL")
    conn.execute("CREATE INDEX record_children ON records(parent_record_id,position)")
    conn.execute("CREATE UNIQUE INDEX record_object_field ON records(parent_record_id,field_name) WHERE field_name IS NOT NULL")
    conn.execute("CREATE UNIQUE INDEX record_array_position ON records(parent_record_id,position) WHERE parent_record_id IS NOT NULL AND field_name IS NULL")
    conn.execute("""CREATE TABLE field_types (
        record_id INTEGER NOT NULL REFERENCES records(record_id) ON DELETE CASCADE,
        field_name TEXT NOT NULL,
        value_type TEXT NOT NULL CHECK(value_type IN ('null','bool','int','bigint','real','text')),
        PRIMARY KEY(record_id,field_name))""")
    for table, fields in FIELDS.items():
        cols = sorted({column(f) for f in COMMON + fields})
        definitions = ",".join(f"{quote(c)} BLOB" for c in cols)
        checks = ",".join(f"CHECK({quote(column(f))} IS NULL OR (typeof({quote(column(f))})='integer' AND {quote(column(f))} IN (0,1)))"
                          for f in ("validated", "deleted", "isAdjust", "isFour", "tracaOk") if column(f) in cols)
        # No SQLite coercion: '0000020516', empty strings, booleans and numbers
        # must keep their original types. field_types records presence/type only.
        conn.execute(f"""CREATE TABLE {table} (
            record_id INTEGER PRIMARY KEY, document_key TEXT NOT NULL,
            scalar_value BLOB, {definitions}, {checks},
            FOREIGN KEY(document_key,record_id)
                REFERENCES records(document_key,record_id) ON DELETE CASCADE)""")
        conn.execute(f"CREATE INDEX {table}_document ON {table}(document_key)")
        conn.execute(f"CREATE INDEX {table}_item ON {table}(document_key,field_id)")
        for event in ("INSERT", "UPDATE"):
            conn.execute(f"""CREATE TRIGGER {table}_identity_{event.lower()} BEFORE {event} ON {table}
                WHEN (SELECT entity_table FROM records WHERE record_id=NEW.record_id) != '{table}'
                BEGIN SELECT RAISE(ABORT,'Wrong SQL entity identity'); END""")
    conn.execute("""CREATE TABLE entity_links (
        owner_record_id INTEGER NOT NULL REFERENCES records(record_id) ON DELETE CASCADE,
        relation TEXT NOT NULL, position INTEGER NOT NULL,
        target_item_id TEXT NOT NULL,
        target_record_id INTEGER REFERENCES records(record_id) ON DELETE SET NULL,
        PRIMARY KEY(owner_record_id,relation,position))""")
    for event in ("INSERT", "UPDATE"):
        conn.execute(f"""CREATE TRIGGER link_same_document_{event.lower()} BEFORE {event} ON entity_links
        WHEN NEW.target_record_id IS NOT NULL AND
            (SELECT document_key FROM records WHERE record_id=NEW.owner_record_id) !=
            (SELECT document_key FROM records WHERE record_id=NEW.target_record_id)
        BEGIN SELECT RAISE(ABORT,'Cross-document entity relationship'); END""")
    tables = ("rework_operations", "consumable_operations", "consumable_items", "equipment_use",
              "technical_facts", "oven_runs", "open_work")
    conn.execute("CREATE VIEW operations AS " + " UNION ALL ".join(
        f"SELECT record_id,document_key,field_id AS row_id,'{t}' AS section FROM {t}" for t in tables))


def init_schema(conn):
    conn.execute("PRAGMA foreign_keys=ON")


def scalar(value):
    if value is None:
        return "null", None
    if isinstance(value, bool):
        return "bool", int(value)
    if isinstance(value, int):
        return ("int", value) if -(2**63) <= value < 2**63 else ("bigint", str(value))
    if isinstance(value, float) and math.isfinite(value):
        return "real", value
    if isinstance(value, str):
        return "text", value
    raise ValueError("Unsupported/non-finite field value")


def restore(kind, value):
    if kind == "null":
        return None
    if kind == "bool":
        return bool(value)
    if kind in ("int", "bigint"):
        return int(value)
    if kind == "real":
        return float(value)
    return value


def table_for(path, kind, value):
    if isinstance(value, list):
        return "collections"
    if not path:
        return "dossiers" if kind == "of" else "users" if kind == "user" else "reference_entries"
    name = path[-1]
    if kind == "of" and path == ["header"]:
        return "work_orders"
    if isinstance(name, int):
        collection = path[-2] if len(path) > 1 else None
        fixed = {"comments": "comments", "events": "connector_events", "editHistory": "edit_history",
                 "changes": "history_changes", "quantityHistory": "quantity_history", "lotSplits": "lot_splits",
                 "destinations": "split_destinations", "connectors": "connectors",
                 "ctrlCancellationHistory": "control_cancellations", "tracaCancellationHistory": "trace_cancellations",
                 "snIds": "unit_scope_members", "snExcludeIds": "unit_scope_members", "_snRows": "unit_snapshots"}
        if collection in fixed:
            return fixed[collection]
        if path[:2] == ["units", "rows"]:
            return "units"
        sections = {"rework": "rework_operations", "consommables": "consumable_operations",
                    "testequip": "equipment_use", "faits": "technical_facts", "etuvage": "oven_runs",
                    "openwork": "open_work"}
        if len(path) == 3 and collection in ("rows", "ops") and path[0] in sections:
            return sections[path[0]]
        if path[:2] == ["consommables", "ops"] and collection in ("items", "lines"):
            return "consumable_items"
        if kind == "reference":
            return "reference_entries"
    if name == "editBase":
        return "edit_snapshots"
    if len(path) == 1 and kind == "of":
        return "section_settings"
    return "extension_records"


def write_document(conn, key, value, updated_at=None, expected=None, enforce=False):
    current = conn.execute("SELECT revision FROM documents WHERE key=?", (key,)).fetchone()
    revision = current[0] if current else 0
    if enforce and expected != revision:
        raise ConflictError("Le document a ete modifie par une autre personne. Rechargez avant de sauvegarder.")
    kind = "of" if key.startswith("of:") else "user" if key.startswith("user:") else "reference"
    conn.execute("""INSERT INTO documents VALUES(?,?,?,?) ON CONFLICT(key) DO UPDATE SET
        revision=excluded.revision,updated_at=excluded.updated_at""",
        (key, kind, revision + 1, time.time() if updated_at is None else updated_at))
    conn.execute("DELETE FROM records WHERE document_key=?", (key,))
    schema_columns = {}
    pending_links = []
    unit_ids = {}
    split_ids = {}

    def insert(node, path, parent=None, field_name=None, position=0, owner=None):
        if len(path) > 80:
            raise ValueError("Document nesting too deep")
        table = table_for(path, kind, node)
        if key == "of-list" and len(path) == 1 and isinstance(path[0], int):
            table = "of_index_entries"
        shape = "object" if isinstance(node, dict) else "array" if isinstance(node, list) else scalar(node)[0]
        rid = conn.execute("INSERT INTO records(document_key,parent_record_id,field_name,position,entity_table,shape) VALUES(?,?,?,?,?,?)",
                           (key, parent, field_name, position, table, shape)).lastrowid
        cols = {"record_id": rid, "document_key": key}
        if shape not in ("object", "array"):
            cols["scalar_value"] = scalar(node)[1]
        if isinstance(node, dict):
            available = schema_columns.setdefault(table, {r[1] for r in conn.execute(f"PRAGMA table_info({table})")})
            for field, item in node.items():
                if isinstance(item, (dict, list)):
                    continue
                col = column(field)
                value_type, native = scalar(item)
                if col not in available:
                    conn.execute(f"ALTER TABLE {table} ADD COLUMN {quote(col)} BLOB")
                    available.add(col)
                cols[col] = native
                conn.execute("INSERT INTO field_types VALUES(?,?,?)", (rid, field, value_type))
        conn.execute(f"INSERT INTO {table} ({','.join(quote(c) for c in cols)}) VALUES({','.join('?' for _ in cols)})", tuple(cols.values()))
        if isinstance(node, dict):
            item_id = str(node.get("id", ""))
            if table == "units" and item_id:
                if item_id in unit_ids:
                    raise ValueError("Duplicate unit ID in one OF")
                unit_ids[item_id] = rid
            if table == "lot_splits" and item_id:
                split_ids[item_id] = rid
            for relation in ("unitId", "parentUnitId", "sourceId", "splitId"):
                if node.get(relation):
                    pending_links.append((rid, relation, 0, str(node[relation])))
            for relation in ("snIds", "snExcludeIds"):
                for i, target in enumerate(node.get(relation) or []):
                    pending_links.append((rid, relation, i, str(target)))
            for i, (field, item) in enumerate(node.items()):
                if isinstance(item, (dict, list)):
                    insert(item, path + [field], rid, field, i, rid)
        elif isinstance(node, list):
            for i, item in enumerate(node):
                child = insert(item, path + [i], rid, None, i, owner)
                if owner is not None and isinstance(item, dict):
                    conn.execute("INSERT INTO entity_links VALUES(?,?,?,?,?)", (child, "owner", 0, str(owner), owner))
        return rid

    insert(value, [])
    for owner, relation, position, target in pending_links:
        target_record = split_ids.get(target) if relation == "splitId" else unit_ids.get(target)
        conn.execute("INSERT INTO entity_links VALUES(?,?,?,?,?)", (owner, relation, position, target, target_record))
    return revision + 1


def read_document(conn, key):
    if not conn.in_transaction:
        conn.execute("BEGIN")
    doc = conn.execute("SELECT revision FROM documents WHERE key=?", (key,)).fetchone()
    if not doc:
        return None
    rows = conn.execute("SELECT record_id,parent_record_id,field_name,position,entity_table,shape FROM records WHERE document_key=? ORDER BY record_id", (key,)).fetchall()
    types = {}
    for rid, field, kind in conn.execute("SELECT f.* FROM field_types f JOIN records r ON r.record_id=f.record_id WHERE r.document_key=?", (key,)):
        types.setdefault(rid, []).append((field, kind))
    values = {}
    for table in {row[4] for row in rows}:
        if table not in FIELDS:
            raise ValueError("Unknown SQL entity table")
        cursor = conn.execute(f"SELECT * FROM {table} WHERE document_key=?", (key,))
        names = [d[0] for d in cursor.description]
        for row in cursor:
            item = dict(zip(names, row))
            values[item["record_id"]] = item
    objects = {}
    children = {}
    root_id = None
    for rid, parent, field, position, table, shape in rows:
        data = values[rid]
        if shape == "object":
            item = {f: restore(t, data[column(f)]) for f, t in types.get(rid, [])}
        elif shape == "array":
            item = []
        else:
            item = restore(shape, data["scalar_value"])
        objects[rid] = item
        if parent is None:
            root_id = rid
        else:
            children.setdefault(parent, []).append((position, field, rid))
    if not rows:
        raise ValueError("Missing document root")
    for parent, entries in children.items():
        for _, field, rid in sorted(entries):
            if isinstance(objects[parent], list):
                objects[parent].append(objects[rid])
            else:
                objects[parent][field] = objects[rid]
    return objects[root_id], doc[0]


def migrate(conn):
    version = conn.execute("PRAGMA user_version").fetchone()[0]
    if version > SCHEMA_VERSION:
        raise ValueError("Database schema is newer than this server")
    if version == SCHEMA_VERSION:
        return
    if not conn.in_transaction:
        conn.execute("BEGIN IMMEDIATE")
    if version == 2:
        snapshots = [(key, read_v2(conn, key)[0], revision, updated)
                     for key, revision, updated in conn.execute("SELECT key,revision,updated_at FROM documents").fetchall()]
        for table in ("work_orders", "users") + LEGACY_TABLES + ("collections", "documents"):
            conn.execute(f"DROP TABLE IF EXISTS {table}")
    else:
        snapshots = [(key, json.loads(text), 1, updated)
                     for key, text, updated in conn.execute("SELECT key,value,updated_at FROM storage").fetchall()]
    conn.execute("DROP TABLE IF EXISTS storage")
    create_schema(conn)
    for key, value, revision, updated in snapshots:
        write_document(conn, key, value, updated)
        conn.execute("UPDATE documents SET revision=? WHERE key=?", (revision, key))
        if read_document(conn, key)[0] != value:
            raise ValueError(f"SQL migration verification failed: {key}")
    if conn.execute("PRAGMA foreign_key_check").fetchall():
        raise ValueError("Invalid relationships after migration")
    conn.execute(f"PRAGMA user_version={SCHEMA_VERSION}")
