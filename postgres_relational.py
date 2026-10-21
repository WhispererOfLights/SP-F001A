"""Relational PostgreSQL projection for SP-F001A documents.

The application still exchanges complete JSON documents.  This module keeps a
transactional, query-friendly projection next to those lossless documents so a
document update and its business rows always commit together.
"""

from __future__ import annotations

from typing import Iterable


DEFAULT_ROLES = (
    ("operateur", "Opérateur", True, False, False, 10),
    ("controleur", "Contrôleur", True, False, False, 20),
    ("logistique", "Logistique", True, False, False, 30),
    ("chef_de_projet", "Chef de projet", False, False, False, 40),
    ("product_assurance", "Product Assurance", False, False, False, 50),
    ("manager", "Manager", True, True, True, 60),
    ("admin", "Admin", True, True, True, 70),
    ("consultation", "Consultation", False, False, False, 80),
)

DEFAULT_STATUSES = (
    ("a_faire", "À faire", "#8b949e", False, 0),
    ("en_cours", "En cours", "#1f6feb", False, 1),
    ("ip", "IP", "#d29922", False, 2),
    ("a_cloturer", "À clôturer", "#e05c00", False, 3),
    ("bloque", "Bloqué", "#d29922", False, 4),
    ("termine", "Terminé", "#238636", True, 5),
    ("cloture", "Clôturé", "#238636", True, 6),
)

DEFAULT_TECHNICAL_EVENT_TYPES = (
    ("NC", "NC — Non-Conformité", "#da3633", 0),
    ("DM", "DM — Demande de Modif.", "#1f6feb", 1),
    ("ISS", "ISS — Fait Technique", "#d29922", 2),
    ("OW", "OW — Open Work", "#e05c00", 3),
)

ROLE_CODES = {label.casefold(): code for code, label, *_ in DEFAULT_ROLES}

LIFECYCLE_TABLES = (
    "work_orders", "of_units", "rework_operations", "consumable_operations",
    "consumable_items", "oven_runs", "equipment_operations", "technical_events",
    "connector_operations", "connector_events",
)


def _text(value):
    if value is None:
        return None
    return str(value)


def _integer(value):
    try:
        return int(value) if value not in (None, "") else None
    except (TypeError, ValueError):
        return None


def _boolean(value):
    if isinstance(value, bool):
        return value
    if isinstance(value, (int, float)):
        return bool(value)
    return str(value or "").strip().lower() in {"1", "true", "oui", "yes"}


def _object(value):
    return value if isinstance(value, dict) else {}


def _rows(value):
    return value if isinstance(value, list) else []


def _role_code(conn, role):
    label = str(role or "Opérateur").strip() or "Opérateur"
    code = ROLE_CODES.get(label.casefold())
    if not code:
        code = "".join(c.lower() if c.isalnum() else "_" for c in label).strip("_") or "autre"
        conn.execute(
            """INSERT INTO roles(code,label,sort_order) VALUES(%s,%s,999)
               ON CONFLICT(code) DO UPDATE SET label=EXCLUDED.label""",
            (code, label),
        )
    return code


def create_schema(conn, Jsonb) -> None:
    statements = (
        """CREATE TABLE IF NOT EXISTS roles (
            code TEXT PRIMARY KEY, label TEXT NOT NULL UNIQUE,
            can_write BOOLEAN NOT NULL DEFAULT FALSE,
            can_manage_users BOOLEAN NOT NULL DEFAULT FALSE,
            can_manage_references BOOLEAN NOT NULL DEFAULT FALSE,
            sort_order INTEGER NOT NULL DEFAULT 0)""",
        """CREATE TABLE IF NOT EXISTS status_types (
            id TEXT PRIMARY KEY, label TEXT NOT NULL, color TEXT NOT NULL,
            closed BOOLEAN NOT NULL DEFAULT FALSE, sort_order INTEGER NOT NULL DEFAULT 0,
            active BOOLEAN NOT NULL DEFAULT TRUE)""",
        """CREATE TABLE IF NOT EXISTS consumable_catalog (
            id TEXT PRIMARY KEY, category TEXT, sap_number TEXT, internal_code TEXT,
            label TEXT NOT NULL, polymerization_hours NUMERIC,
            active BOOLEAN NOT NULL DEFAULT TRUE, source JSONB NOT NULL DEFAULT '{}'::jsonb)""",
        """CREATE TABLE IF NOT EXISTS technical_event_types (
            code TEXT PRIMARY KEY, label TEXT NOT NULL, color TEXT,
            sort_order INTEGER NOT NULL DEFAULT 0, active BOOLEAN NOT NULL DEFAULT TRUE)""",
        """CREATE TABLE IF NOT EXISTS users (
            trigram TEXT PRIMARY KEY, document_key TEXT NOT NULL UNIQUE
                REFERENCES documents(key) ON DELETE CASCADE,
            first_name TEXT, last_name TEXT, service TEXT, email TEXT,
            role_code TEXT REFERENCES roles(code), must_change_password BOOLEAN NOT NULL DEFAULT FALSE,
            password_scheme TEXT, password_iterations INTEGER, password_salt TEXT,
            password_digest TEXT, legacy_password_hash TEXT,
            source_revision BIGINT NOT NULL, updated_at TIMESTAMPTZ NOT NULL)""",
        """CREATE TABLE IF NOT EXISTS work_orders (
            document_key TEXT PRIMARY KEY REFERENCES documents(key) ON DELETE CASCADE,
            business_id TEXT, of_number TEXT, article_number TEXT, description TEXT,
            otp TEXT, project TEXT, rework_of_number TEXT, work_order_type TEXT,
            status_id TEXT REFERENCES status_types(id), finished_product_sn TEXT,
            created_by TEXT, created_at_text TEXT, deleted BOOLEAN NOT NULL DEFAULT FALSE,
            source_revision BIGINT NOT NULL, updated_at TIMESTAMPTZ NOT NULL,
            source JSONB NOT NULL)""",
        """CREATE TABLE IF NOT EXISTS of_units (
            document_key TEXT NOT NULL REFERENCES work_orders(document_key) ON DELETE CASCADE,
            unit_id TEXT NOT NULL, line_number INTEGER, unit_kind TEXT, sn TEXT, lot TEXT,
            status_id TEXT REFERENCES status_types(id), finished_product_sn TEXT,
            initial_quantity TEXT, current_quantity TEXT, parent_unit_id TEXT, split_id TEXT,
            remark TEXT, validated BOOLEAN NOT NULL DEFAULT FALSE,
            deleted BOOLEAN NOT NULL DEFAULT FALSE, created_by TEXT, created_at_text TEXT,
            source JSONB NOT NULL, PRIMARY KEY(document_key,unit_id))""",
        """CREATE TABLE IF NOT EXISTS rework_operations (
            document_key TEXT NOT NULL REFERENCES work_orders(document_key) ON DELETE CASCADE,
            operation_id TEXT NOT NULL, unit_id TEXT, line_number INTEGER,
            topological_reference TEXT, quantity TEXT, adjustment BOOLEAN NOT NULL DEFAULT FALSE,
            action_code TEXT, article_number TEXT, value_description TEXT, lot TEXT,
            date_code TEXT, component_sn TEXT, follower_sheet TEXT, operation_number TEXT,
            operator_visa TEXT, operation_date TEXT, controller_visa TEXT, control_date TEXT,
            traceability_ok BOOLEAN NOT NULL DEFAULT FALSE, traceability_visa TEXT,
            traceability_date TEXT, remarks TEXT, validated BOOLEAN NOT NULL DEFAULT FALSE,
            deleted BOOLEAN NOT NULL DEFAULT FALSE, created_by TEXT, created_at_text TEXT,
            source JSONB NOT NULL, PRIMARY KEY(document_key,operation_id))""",
        """CREATE TABLE IF NOT EXISTS consumable_operations (
            document_key TEXT NOT NULL REFERENCES work_orders(document_key) ON DELETE CASCADE,
            operation_id TEXT NOT NULL, unit_id TEXT, follower_sheet TEXT, operation_number TEXT,
            validated BOOLEAN NOT NULL DEFAULT FALSE, deleted BOOLEAN NOT NULL DEFAULT FALSE,
            created_by TEXT, created_at_text TEXT, source JSONB NOT NULL,
            PRIMARY KEY(document_key,operation_id))""",
        """CREATE TABLE IF NOT EXISTS consumable_items (
            document_key TEXT NOT NULL, operation_id TEXT NOT NULL, item_id TEXT NOT NULL,
            consumable_id TEXT REFERENCES consumable_catalog(id), sample_number TEXT, lot TEXT,
            dp TEXT, quantity TEXT, remark TEXT, traceability_ok BOOLEAN NOT NULL DEFAULT FALSE,
            traceability_visa TEXT, traceability_date TEXT,
            validated BOOLEAN NOT NULL DEFAULT FALSE, deleted BOOLEAN NOT NULL DEFAULT FALSE,
            created_by TEXT, created_at_text TEXT, source JSONB NOT NULL,
            PRIMARY KEY(document_key,operation_id,item_id),
            FOREIGN KEY(document_key,operation_id) REFERENCES consumable_operations(document_key,operation_id)
                ON DELETE CASCADE)""",
        """CREATE TABLE IF NOT EXISTS oven_runs (
            document_key TEXT NOT NULL REFERENCES work_orders(document_key) ON DELETE CASCADE,
            run_id TEXT NOT NULL, unit_id TEXT, oven_number TEXT, duration_hours TEXT,
            temperature_celsius TEXT, entry_visa TEXT, entry_date TEXT,
            exit_visa TEXT, exit_date TEXT, validated BOOLEAN NOT NULL DEFAULT FALSE,
            deleted BOOLEAN NOT NULL DEFAULT FALSE, created_by TEXT, created_at_text TEXT,
            source JSONB NOT NULL, PRIMARY KEY(document_key,run_id))""",
        """CREATE TABLE IF NOT EXISTS equipment_operations (
            document_key TEXT NOT NULL REFERENCES work_orders(document_key) ON DELETE CASCADE,
            operation_id TEXT NOT NULL, unit_id TEXT, inventory_number TEXT, equipment_type TEXT,
            designation TEXT, expiration_date TEXT, check_date TEXT, visa TEXT,
            is_oven BOOLEAN NOT NULL DEFAULT FALSE, comments_text TEXT,
            validated BOOLEAN NOT NULL DEFAULT FALSE, deleted BOOLEAN NOT NULL DEFAULT FALSE,
            created_by TEXT, created_at_text TEXT, source JSONB NOT NULL,
            PRIMARY KEY(document_key,operation_id))""",
        """CREATE TABLE IF NOT EXISTS technical_events (
            document_key TEXT NOT NULL REFERENCES work_orders(document_key) ON DELETE CASCADE,
            event_id TEXT NOT NULL, unit_id TEXT, event_type TEXT REFERENCES technical_event_types(code),
            event_number TEXT, description TEXT, link TEXT, opened_by TEXT, opened_at TEXT,
            closed_by TEXT, closed_at TEXT, validated BOOLEAN NOT NULL DEFAULT FALSE,
            deleted BOOLEAN NOT NULL DEFAULT FALSE, created_by TEXT, created_at_text TEXT,
            source JSONB NOT NULL, PRIMARY KEY(document_key,event_id))""",
        """CREATE TABLE IF NOT EXISTS connector_operations (
            document_key TEXT NOT NULL REFERENCES work_orders(document_key) ON DELETE CASCADE,
            connector_id TEXT NOT NULL, unit_id TEXT, connector_number TEXT,
            validated BOOLEAN NOT NULL DEFAULT FALSE, deleted BOOLEAN NOT NULL DEFAULT FALSE,
            created_by TEXT, created_at_text TEXT, source JSONB NOT NULL,
            PRIMARY KEY(document_key,connector_id))""",
        """CREATE TABLE IF NOT EXISTS connector_events (
            document_key TEXT NOT NULL, connector_id TEXT NOT NULL, event_position INTEGER NOT NULL,
            event_date TEXT, visa TEXT, action TEXT, remark TEXT, source JSONB NOT NULL,
            PRIMARY KEY(document_key,connector_id,event_position),
            FOREIGN KEY(document_key,connector_id) REFERENCES connector_operations(document_key,connector_id)
                ON DELETE CASCADE)""",
        """CREATE TABLE IF NOT EXISTS operation_unit_scopes (
            document_key TEXT NOT NULL REFERENCES work_orders(document_key) ON DELETE CASCADE,
            owner_table TEXT NOT NULL, owner_id TEXT NOT NULL, unit_id TEXT NOT NULL,
            excluded BOOLEAN NOT NULL DEFAULT FALSE,
            PRIMARY KEY(document_key,owner_table,owner_id,unit_id,excluded))""",
        """CREATE TABLE IF NOT EXISTS comments (
            document_key TEXT NOT NULL REFERENCES work_orders(document_key) ON DELETE CASCADE,
            owner_table TEXT NOT NULL, owner_id TEXT NOT NULL, comment_position INTEGER NOT NULL,
            comment_id TEXT, author_visa TEXT, comment_date TEXT, text TEXT,
            reply_to TEXT, edited_by TEXT, edited_at TEXT, source JSONB NOT NULL,
            PRIMARY KEY(document_key,owner_table,owner_id,comment_position))""",
        """CREATE TABLE IF NOT EXISTS attachments (
            document_key TEXT NOT NULL REFERENCES work_orders(document_key) ON DELETE CASCADE,
            owner_table TEXT NOT NULL, owner_id TEXT NOT NULL, attachment_position INTEGER NOT NULL,
            file_name TEXT, path TEXT, media_type TEXT, added_by TEXT, added_at TEXT,
            source JSONB NOT NULL, PRIMARY KEY(document_key,owner_table,owner_id,attachment_position))""",
    )
    for statement in statements:
        conn.execute(statement)

    # Additive upgrades keep existing rows intact while exposing the audit
    # fields directly to SQL clients.
    for table in LIFECYCLE_TABLES:
        conn.execute(f"ALTER TABLE {table} ADD COLUMN IF NOT EXISTS deletion_reason TEXT")
        conn.execute(f"ALTER TABLE {table} ADD COLUMN IF NOT EXISTS deleted_by TEXT")
        conn.execute(f"ALTER TABLE {table} ADD COLUMN IF NOT EXISTS deleted_at_text TEXT")
        conn.execute(f"ALTER TABLE {table} ADD COLUMN IF NOT EXISTS restoration_reason TEXT")
        conn.execute(f"ALTER TABLE {table} ADD COLUMN IF NOT EXISTS restored_by TEXT")
        conn.execute(f"ALTER TABLE {table} ADD COLUMN IF NOT EXISTS restored_at_text TEXT")
    conn.execute("ALTER TABLE connector_events ADD COLUMN IF NOT EXISTS deleted BOOLEAN NOT NULL DEFAULT FALSE")

    conn.execute("""CREATE OR REPLACE VIEW user_directory AS
        SELECT u.trigram,u.first_name,u.last_name,u.service,u.email,
               u.role_code,r.label AS role,u.must_change_password,u.updated_at
        FROM users u LEFT JOIN roles r ON r.code=u.role_code""")

    indexes = (
        "CREATE INDEX IF NOT EXISTS work_orders_of_number_idx ON work_orders(of_number)",
        "CREATE INDEX IF NOT EXISTS work_orders_article_idx ON work_orders(article_number)",
        "CREATE INDEX IF NOT EXISTS of_units_sn_idx ON of_units(sn)",
        "CREATE INDEX IF NOT EXISTS of_units_lot_idx ON of_units(lot)",
        "CREATE INDEX IF NOT EXISTS rework_document_idx ON rework_operations(document_key)",
        "CREATE INDEX IF NOT EXISTS consumable_items_catalog_idx ON consumable_items(consumable_id)",
        "CREATE INDEX IF NOT EXISTS technical_events_number_idx ON technical_events(event_number)",
        "CREATE INDEX IF NOT EXISTS comments_owner_idx ON comments(document_key,owner_table,owner_id)",
    )
    for statement in indexes:
        conn.execute(statement)

    for role in DEFAULT_ROLES:
        conn.execute(
            """INSERT INTO roles(code,label,can_write,can_manage_users,can_manage_references,sort_order)
               VALUES(%s,%s,%s,%s,%s,%s) ON CONFLICT(code) DO UPDATE SET
               label=EXCLUDED.label,can_write=EXCLUDED.can_write,
               can_manage_users=EXCLUDED.can_manage_users,
               can_manage_references=EXCLUDED.can_manage_references,sort_order=EXCLUDED.sort_order""",
            role,
        )
    for status in DEFAULT_STATUSES:
        conn.execute(
            """INSERT INTO status_types(id,label,color,closed,sort_order) VALUES(%s,%s,%s,%s,%s)
               ON CONFLICT(id) DO NOTHING""",
            status,
        )
    for event_type in DEFAULT_TECHNICAL_EVENT_TYPES:
        conn.execute(
            """INSERT INTO technical_event_types(code,label,color,sort_order) VALUES(%s,%s,%s,%s)
               ON CONFLICT(code) DO NOTHING""",
            event_type,
        )


def _ensure_status(conn, status):
    status_id = str(status or "en_cours").strip() or "en_cours"
    conn.execute(
        "INSERT INTO status_types(id,label,color,sort_order) VALUES(%s,%s,'#8b949e',999) ON CONFLICT(id) DO NOTHING",
        (status_id, status_id),
    )
    return status_id


def _ensure_event_type(conn, event_type):
    code = str(event_type or "ISS").strip().upper() or "ISS"
    conn.execute(
        "INSERT INTO technical_event_types(code,label,sort_order) VALUES(%s,%s,999) ON CONFLICT(code) DO NOTHING",
        (code, code),
    )
    return code


def _sync_user(conn, key, payload, revision, updated_at):
    user = _object(payload)
    trigram = str(user.get("trigram") or key.removeprefix("user:")).strip().upper()
    if not trigram:
        return
    conn.execute("DELETE FROM users WHERE document_key=%s OR trigram=%s", (key, trigram))
    auth = _object(user.get("passwordAuth"))
    conn.execute(
        """INSERT INTO users(trigram,document_key,first_name,last_name,service,email,role_code,
           must_change_password,password_scheme,password_iterations,password_salt,password_digest,
           legacy_password_hash,source_revision,updated_at)
           VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)""",
        (trigram, key, _text(user.get("prenom")), _text(user.get("nom")),
         _text(user.get("service")), _text(user.get("email")), _role_code(conn, user.get("role")),
         _boolean(user.get("mustChangePassword")), _text(auth.get("scheme")),
         _integer(auth.get("iterations")), _text(auth.get("salt")), _text(auth.get("digest")),
         _text(user.get("pwd")), revision, updated_at),
    )


def _sync_reference(conn, key, payload, Jsonb):
    if key == "consommables-list":
        conn.execute("UPDATE consumable_catalog SET active=FALSE")
        for item in _rows(payload):
            item = _object(item)
            item_id = str(item.get("id") or "").strip()
            if not item_id:
                continue
            hours = item.get("polymerizationHours")
            try:
                hours = float(hours) if hours not in (None, "") else None
            except (TypeError, ValueError):
                hours = None
            conn.execute(
                """INSERT INTO consumable_catalog(id,category,sap_number,internal_code,label,
                   polymerization_hours,active,source) VALUES(%s,%s,%s,%s,%s,%s,TRUE,%s)
                   ON CONFLICT(id) DO UPDATE SET category=EXCLUDED.category,sap_number=EXCLUDED.sap_number,
                   internal_code=EXCLUDED.internal_code,label=EXCLUDED.label,
                   polymerization_hours=EXCLUDED.polymerization_hours,active=TRUE,source=EXCLUDED.source""",
                (item_id, _text(item.get("cat")), _text(item.get("sap")), _text(item.get("code")),
                 _text(item.get("label")) or item_id, hours, Jsonb(item)),
            )
    elif key == "status-types":
        conn.execute("UPDATE status_types SET active=FALSE")
        for position, item in enumerate(_rows(payload)):
            item = _object(item)
            item_id = str(item.get("id") or "").strip()
            if item_id:
                conn.execute(
                    """INSERT INTO status_types(id,label,color,closed,sort_order,active)
                       VALUES(%s,%s,%s,%s,%s,TRUE) ON CONFLICT(id) DO UPDATE SET
                       label=EXCLUDED.label,color=EXCLUDED.color,closed=EXCLUDED.closed,
                       sort_order=EXCLUDED.sort_order,active=TRUE""",
                    (item_id, _text(item.get("label")) or item_id,
                     _text(item.get("color")) or "#8b949e", _boolean(item.get("closed")), position),
                )
    elif key == "fait-types":
        conn.execute("UPDATE technical_event_types SET active=FALSE")
        for position, item in enumerate(_rows(payload)):
            item = _object(item)
            code = str(item.get("id") or "").strip().upper()
            if code:
                conn.execute(
                    """INSERT INTO technical_event_types(code,label,color,sort_order,active)
                       VALUES(%s,%s,%s,%s,TRUE) ON CONFLICT(code) DO UPDATE SET
                       label=EXCLUDED.label,color=EXCLUDED.color,sort_order=EXCLUDED.sort_order,active=TRUE""",
                    (code, _text(item.get("label")) or code, _text(item.get("color")), position),
                )


def _common(row):
    return (
        _text(row.get("unitId")), _boolean(row.get("validated")), _boolean(row.get("deleted")),
        _text(row.get("createdVisa")), _text(row.get("createdDT")),
    )


def _set_lifecycle(conn, table, document_key, id_column, row_id, row, extra_where="", extra_values=()):
    conn.execute(
        f"""UPDATE {table} SET deletion_reason=%s,deleted_by=%s,deleted_at_text=%s,
            restoration_reason=%s,restored_by=%s,restored_at_text=%s
            WHERE document_key=%s AND {id_column}=%s{extra_where}""",
        (_text(row.get("deletedReason")), _text(row.get("deletedVisa")),
         _text(row.get("deletedDate") or row.get("deletedDT")),
         _text(row.get("restoredReason")), _text(row.get("restoredVisa")),
         _text(row.get("restoredDate") or row.get("restoredDT")),
         document_key, row_id, *extra_values),
    )


def _add_scopes(conn, document_key, owner_table, owner_id, row):
    for excluded, field in ((False, "snIds"), (True, "snExcludeIds")):
        for unit_id in _rows(row.get(field)):
            if unit_id not in (None, ""):
                conn.execute(
                    """INSERT INTO operation_unit_scopes(document_key,owner_table,owner_id,unit_id,excluded)
                       VALUES(%s,%s,%s,%s,%s) ON CONFLICT DO NOTHING""",
                    (document_key, owner_table, owner_id, str(unit_id), excluded),
                )


def _add_comments(conn, Jsonb, document_key, owner_table, owner_id, row):
    for position, comment in enumerate(_rows(row.get("comments"))):
        comment = _object(comment)
        conn.execute(
            """INSERT INTO comments(document_key,owner_table,owner_id,comment_position,comment_id,
               author_visa,comment_date,text,reply_to,edited_by,edited_at,source)
               VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)""",
            (document_key, owner_table, owner_id, position, _text(comment.get("id")),
             _text(comment.get("visa")), _text(comment.get("dt")), _text(comment.get("text")),
             _text(comment.get("replyTo")), _text(comment.get("editedVisa")),
             _text(comment.get("editedDT")), Jsonb(comment)),
        )


def _sync_work_order(conn, key, payload, revision, updated_at, Jsonb):
    document = _object(payload)
    header = _object(document.get("header"))
    conn.execute("DELETE FROM work_orders WHERE document_key=%s", (key,))
    status_id = _ensure_status(conn, header.get("status"))
    conn.execute(
        """INSERT INTO work_orders(document_key,business_id,of_number,article_number,description,otp,
           project,rework_of_number,work_order_type,status_id,finished_product_sn,created_by,
           created_at_text,deleted,source_revision,updated_at,source)
           VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)""",
        (key, _text(header.get("id")), _text(header.get("of")),
         _text(header.get("codeArticle") or header.get("articleNo")), _text(header.get("description")),
         _text(header.get("otp")), _text(header.get("projet")), _text(header.get("ofRework")),
         _text(header.get("typeOF")), status_id, _text(header.get("snProduitFini")),
         _text(header.get("createdBy")), _text(header.get("createdAt")), _boolean(header.get("deleted")),
         revision, updated_at, Jsonb(header)),
    )
    _set_lifecycle(conn, "work_orders", key, "document_key", key, header)

    for position, unit in enumerate(_rows(_object(document.get("units")).get("rows"))):
        unit = _object(unit)
        unit_id = str(unit.get("id") or f"position-{position}")
        conn.execute(
            """INSERT INTO of_units(document_key,unit_id,line_number,unit_kind,sn,lot,status_id,
               finished_product_sn,initial_quantity,current_quantity,parent_unit_id,split_id,remark,
               validated,deleted,created_by,created_at_text,source)
               VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)""",
            (key, unit_id, _integer(unit.get("lineNo")) or position + 1,
             _text(unit.get("unitKind") or unit.get("kind")), _text(unit.get("sn")), _text(unit.get("lot")),
             _ensure_status(conn, unit.get("status")), _text(unit.get("snProduitFini")),
             _text(unit.get("qteInitiale") or unit.get("qte")), _text(unit.get("qteActuelle")),
             _text(unit.get("parentUnitId")), _text(unit.get("splitId")), _text(unit.get("remarque")),
             _boolean(unit.get("validated")), _boolean(unit.get("deleted")),
             _text(unit.get("createdVisa")), _text(unit.get("createdDT")), Jsonb(unit)),
        )
        _set_lifecycle(conn, "of_units", key, "unit_id", unit_id, unit)

    section_specs = (
        ("rework", "rows", "rework_operations"),
        ("consommables", "ops", "consumable_operations"),
        ("etuvage", "rows", "oven_runs"),
        ("testequip", "rows", "equipment_operations"),
        ("faits", "rows", "technical_events"),
        ("demating", "connectors", "connector_operations"),
    )
    for section, collection, table in section_specs:
        for position, row in enumerate(_rows(_object(document.get(section)).get(collection))):
            row = _object(row)
            row_id = str(row.get("id") or f"position-{position}")
            common = _common(row)
            if table == "rework_operations":
                conn.execute(
                    """INSERT INTO rework_operations(document_key,operation_id,unit_id,line_number,
                       topological_reference,quantity,adjustment,action_code,article_number,value_description,
                       lot,date_code,component_sn,follower_sheet,operation_number,operator_visa,operation_date,
                       controller_visa,control_date,traceability_ok,traceability_visa,traceability_date,remarks,
                       validated,deleted,created_by,created_at_text,source)
                       VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)""",
                    (key, row_id, common[0], _integer(row.get("lineNo")), _text(row.get("repere")),
                     _text(row.get("qty")), _boolean(row.get("isAdjust")), _text(row.get("action1")),
                     _text(row.get("codeERP")), _text(row.get("valeur")), _text(row.get("lot")),
                     _text(row.get("dc")), _text(row.get("sn")), _text(row.get("fiche")),
                     _text(row.get("etape")), _text(row.get("visaOper")), _text(row.get("dateOper")),
                     _text(row.get("visaCtrl")), _text(row.get("dateCtrl")), _boolean(row.get("tracaOk")),
                     _text(row.get("visaTraca")), _text(row.get("dateTraca")), _text(row.get("remarques")),
                     common[1], common[2], common[3], common[4], Jsonb(row)),
                )
            elif table == "consumable_operations":
                conn.execute(
                    """INSERT INTO consumable_operations(document_key,operation_id,unit_id,follower_sheet,
                       operation_number,validated,deleted,created_by,created_at_text,source)
                       VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)""",
                    (key, row_id, common[0], _text(row.get("fiche")), _text(row.get("op")),
                     common[1], common[2], common[3], common[4], Jsonb(row)),
                )
                items = _rows(row.get("items")) or _rows(row.get("lines"))
                for item_position, item in enumerate(items):
                    item = _object(item)
                    item_id = str(item.get("id") or f"position-{item_position}")
                    conso_id = str(item.get("consoId") or "").strip() or None
                    if conso_id:
                        conn.execute(
                            """INSERT INTO consumable_catalog(id,label,active,source) VALUES(%s,%s,FALSE,%s)
                               ON CONFLICT(id) DO NOTHING""", (conso_id, conso_id, Jsonb({"id": conso_id})))
                    conn.execute(
                        """INSERT INTO consumable_items(document_key,operation_id,item_id,consumable_id,
                           sample_number,lot,dp,quantity,remark,traceability_ok,traceability_visa,
                           traceability_date,validated,deleted,created_by,created_at_text,source)
                           VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)""",
                        (key, row_id, item_id, conso_id, _text(item.get("echantillon")),
                         _text(item.get("lot")), _text(item.get("dp")), _text(item.get("qty")),
                         _text(item.get("remarque")), _boolean(item.get("tracaOk")),
                         _text(item.get("visaTraca")), _text(item.get("dateTraca")),
                         _boolean(item.get("validated")), _boolean(item.get("deleted")),
                         _text(item.get("createdVisa")), _text(item.get("createdDT")), Jsonb(item)),
                    )
                    _set_lifecycle(
                        conn, "consumable_items", key, "item_id", item_id, item,
                        " AND operation_id=%s", (row_id,),
                    )
                    _add_comments(conn, Jsonb, key, "consumable_items", item_id, item)
            elif table == "oven_runs":
                conn.execute(
                    """INSERT INTO oven_runs(document_key,run_id,unit_id,oven_number,duration_hours,
                       temperature_celsius,entry_visa,entry_date,exit_visa,exit_date,validated,deleted,
                       created_by,created_at_text,source) VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)""",
                    (key, row_id, common[0], _text(row.get("fourN")), _text(row.get("duree")),
                     _text(row.get("temp")), _text(row.get("entreeVisa")), _text(row.get("entreeDT")),
                     _text(row.get("sortieVisa")), _text(row.get("sortieDT")), common[1], common[2],
                     common[3], common[4], Jsonb(row)),
                )
            elif table == "equipment_operations":
                conn.execute(
                    """INSERT INTO equipment_operations(document_key,operation_id,unit_id,inventory_number,
                       equipment_type,designation,expiration_date,check_date,visa,is_oven,comments_text,
                       validated,deleted,created_by,created_at_text,source)
                       VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)""",
                    (key, row_id, common[0], _text(row.get("nInv")), _text(row.get("type")),
                     _text(row.get("designation")), _text(row.get("dateExpiration")),
                     _text(row.get("checkDate")), _text(row.get("visa")), _boolean(row.get("isFour")),
                     _text(row.get("commentaires")), common[1], common[2], common[3], common[4], Jsonb(row)),
                )
            elif table == "technical_events":
                event_type = _ensure_event_type(conn, row.get("type"))
                event_number = row.get("numero") or row.get("nOW")
                conn.execute(
                    """INSERT INTO technical_events(document_key,event_id,unit_id,event_type,event_number,
                       description,link,opened_by,opened_at,closed_by,closed_at,validated,deleted,
                       created_by,created_at_text,source) VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)""",
                    (key, row_id, common[0], event_type, _text(event_number),
                     _text(row.get("description") or row.get("commentaires")), _text(row.get("lien")),
                     _text(row.get("visa") or row.get("openVisa")), _text(row.get("date") or row.get("openDate")),
                     _text(row.get("closedVisa")), _text(row.get("closedDate")), common[1], common[2],
                     common[3], common[4], Jsonb(row)),
                )
            else:
                conn.execute(
                    """INSERT INTO connector_operations(document_key,connector_id,unit_id,connector_number,
                       validated,deleted,created_by,created_at_text,source)
                       VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s)""",
                    (key, row_id, common[0], _text(row.get("nConect")), common[1], common[2],
                     common[3], common[4], Jsonb(row)),
                )
                for event_position, event in enumerate(_rows(row.get("events"))):
                    event = _object(event)
                    conn.execute(
                        """INSERT INTO connector_events(document_key,connector_id,event_position,event_date,
                           visa,action,remark,source) VALUES(%s,%s,%s,%s,%s,%s,%s,%s)""",
                        (key, row_id, event_position, _text(event.get("dt")), _text(event.get("visa")),
                         _text(event.get("action")), _text(event.get("remarque")), Jsonb(event)),
                    )
                    conn.execute(
                        """UPDATE connector_events SET deleted=%s,deletion_reason=%s,deleted_by=%s,
                           deleted_at_text=%s,restoration_reason=%s,restored_by=%s,restored_at_text=%s
                           WHERE document_key=%s AND connector_id=%s AND event_position=%s""",
                        (_boolean(event.get("deleted")), _text(event.get("deletedReason")),
                         _text(event.get("deletedVisa")), _text(event.get("deletedDate") or event.get("deletedDT")),
                         _text(event.get("restoredReason")), _text(event.get("restoredVisa")),
                         _text(event.get("restoredDate") or event.get("restoredDT")),
                         key, row_id, event_position),
                    )
            id_columns = {
                "rework_operations": "operation_id",
                "consumable_operations": "operation_id",
                "oven_runs": "run_id",
                "equipment_operations": "operation_id",
                "technical_events": "event_id",
                "connector_operations": "connector_id",
            }
            _set_lifecycle(conn, table, key, id_columns[table], row_id, row)
            _add_scopes(conn, key, table, row_id, row)
            _add_comments(conn, Jsonb, key, table, row_id, row)


def sync_document(conn, key, payload, revision, updated_at, Jsonb) -> None:
    if key.startswith("user:"):
        _sync_user(conn, key, payload, revision, updated_at)
    elif key.startswith("of:"):
        _sync_work_order(conn, key, payload, revision, updated_at, Jsonb)
    else:
        _sync_reference(conn, key, payload, Jsonb)


def delete_projection(conn, key) -> None:
    if key.startswith("of:"):
        conn.execute("DELETE FROM work_orders WHERE document_key=%s", (key,))
    elif key.startswith("user:"):
        conn.execute("DELETE FROM users WHERE document_key=%s", (key,))
    elif key == "consommables-list":
        conn.execute("UPDATE consumable_catalog SET active=FALSE")
    elif key == "status-types":
        conn.execute("UPDATE status_types SET active=FALSE")
    elif key == "fait-types":
        conn.execute("UPDATE technical_event_types SET active=FALSE")


def rebuild(conn, Jsonb) -> None:
    # References and users are loaded first so operation foreign keys resolve.
    rows = conn.execute(
        """SELECT key,payload,revision,updated_at FROM documents
           ORDER BY CASE kind WHEN 'reference' THEN 0 WHEN 'user' THEN 1 ELSE 2 END,key"""
    ).fetchall()
    for table in ("work_orders", "users"):
        conn.execute(f"DELETE FROM {table}")
    conn.execute("UPDATE consumable_catalog SET active=FALSE")
    for key, payload, revision, updated_at in rows:
        sync_document(conn, key, payload, int(revision), updated_at, Jsonb)


def table_counts(conn) -> dict[str, int]:
    tables: Iterable[str] = (
        "users", "work_orders", "of_units", "rework_operations", "consumable_operations",
        "consumable_items", "oven_runs", "equipment_operations", "technical_events",
        "connector_operations", "comments", "consumable_catalog", "status_types",
    )
    return {table: int(conn.execute(f"SELECT count(*) FROM {table}").fetchone()[0]) for table in tables}
