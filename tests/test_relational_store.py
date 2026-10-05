import json
import sqlite3
import sys
import tempfile
import unittest
import threading
import urllib.request
import urllib.error
from contextlib import closing
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import server
from relational_store import SCHEMA_VERSION, ConflictError, read_document
from legacy_relational import TABLES


class RelationalStoreTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.directory = Path(self.temp.name)
        self.path = self.directory / server.DB_NAME
        self.fixture = {
            "header": {"of": "1000567", "codeArticle": "250000465", "custom": "preserved"},
            "units": {"rows": [{"id": "u1", "sn": "#123", "quantityHistory": [{"before": 1, "after": 2}]}]},
            "rework": {"rows": [{"id": "r1", "action1": "S", "snIds": ["u1"], "deleted": True,
                "comments": [{"id": "c1", "text": "Remarque", "replies": [{"text": "Reponse"}]}],
                "editHistory": [{"visa": "JGR", "changes": [{"from": "a", "to": "b"}]}]}]},
            "demating": {"connectors": [{"id": "j4", "events": [{"id": "e1", "action": "Mating", "comments": []}]}]},
            "consommables": {"ops": [{"id": "op1", "lines": [{"id": "l1", "lot": "0000001234"}]}]},
            "lotSplits": [], "unknownFutureField": {"nested": [1, None, "é"]},
        }
        with closing(sqlite3.connect(self.path)) as conn:
            conn.execute("CREATE TABLE storage(key TEXT PRIMARY KEY,value TEXT NOT NULL,updated_at REAL NOT NULL)")
            for key, value in [("of:test", self.fixture), ("user:JGR", {"trigram": "JGR", "role": "manager", "pwd": "hash"}),
                               ("of-list", [{"id": "test"}]), ("empty", [])]:
                conn.execute("INSERT INTO storage VALUES(?,?,?)", (key, json.dumps(value), 123))
            conn.commit()
        server.init_database(self.directory)

    def tearDown(self):
        self.temp.cleanup()

    def test_lossless_migration_and_backup(self):
        self.assertEqual(json.loads(server.storage_get(self.path, "of:test")), self.fixture)
        self.assertEqual(len(list(self.directory.glob("*-before-relational-*.sqlite"))), 1)
        with server.connect_db(self.path) as conn:
            self.assertEqual(conn.execute("SELECT count(*) FROM operations").fetchone()[0], 3)
            self.assertEqual(conn.execute("SELECT count(*) FROM connector_events").fetchone()[0], 1)
            self.assertEqual(conn.execute("SELECT count(*) FROM users").fetchone()[0], 1)
            self.assertEqual(conn.execute("PRAGMA foreign_key_check").fetchall(), [])
        server.init_database(self.directory)
        self.assertEqual(json.loads(server.storage_get(self.path, "empty")), [])
        self.assertEqual(len(list(self.directory.glob("*-before-relational-*.sqlite"))), 1)

    def test_conflicting_writes_and_deletes_are_atomic(self):
        changed = {**self.fixture, "extra": 42}
        self.assertEqual(server.storage_put(self.path, "of:test", json.dumps(changed), 1, True), 2)
        with self.assertRaises(ConflictError):
            server.storage_put(self.path, "of:test", "{}", 1, True)
        with self.assertRaises(ConflictError):
            server.storage_delete(self.path, "of:test", 1, True)
        self.assertEqual(json.loads(server.storage_get(self.path, "of:test")), changed)
        server.storage_delete(self.path, "of:test", 2, True)
        self.assertIsNone(server.storage_get(self.path, "of:test"))
        with server.connect_db(self.path) as conn:
            for table in ("operations", "units", "comments", "connectors", "connector_events", "collections", "work_orders"):
                self.assertEqual(conn.execute(f"SELECT count(*) FROM {table} WHERE document_key='of:test'").fetchone()[0], 0)
        server.init_database(self.directory)
        self.assertIsNone(server.storage_get(self.path, "of:test"))

    def test_missing_key_creation(self):
        server.storage_put(self.path, "user:NEW", '{"trigram":"NEW"}', 0, True)
        with self.assertRaises(ConflictError):
            server.storage_put(self.path, "user:NEW", "{}", 0, True)
        self.assertIn("user:NEW", server.storage_keys(self.path))

    def test_sql_columns_are_source_of_truth_and_links_are_enforced(self):
        with server.connect_db(self.path) as conn:
            conn.execute("UPDATE rework_operations SET field_action1='D' WHERE field_id='r1'")
            link = conn.execute("SELECT target_record_id FROM entity_links WHERE relation='snIds'").fetchone()
            self.assertIsNotNone(link[0])
            self.assertEqual(conn.execute("SELECT field_sn FROM units WHERE record_id=?", link).fetchone()[0], "#123")
            tables = [r[0] for r in conn.execute("SELECT name FROM sqlite_master WHERE type='table'")]
            self.assertNotIn("storage", tables)
            for table in tables:
                self.assertFalse({"metadata", "payload"} & {r[1] for r in conn.execute(f'PRAGMA table_info("{table}")')})
        self.assertEqual(json.loads(server.storage_get(self.path, "of:test"))["rework"]["rows"][0]["action1"], "D")
        with self.assertRaises(sqlite3.IntegrityError):
            with server.connect_db(self.path) as conn:
                conn.execute("UPDATE rework_operations SET field_deleted=2")
        server.storage_put(self.path, "of:other", '{"header":{"of":"OTHER"},"units":{"rows":[{"id":"other"}]}}', 0, True)
        with self.assertRaises(sqlite3.IntegrityError):
            with server.connect_db(self.path) as conn:
                foreign = conn.execute("SELECT record_id FROM units WHERE document_key='of:other'").fetchone()[0]
                conn.execute("UPDATE entity_links SET target_record_id=? WHERE relation='snIds'", (foreign,))

    def test_lossless_native_types_unknown_fields_and_zero_prefixed_lots(self):
        value = {"null": None, "boolean": False, "integer": 2, "big": 2**80, "float": 1.25,
                 "lot": "0000020516", "empty": "", "emptyObject": {}, "emptyList": [],
                 "quoted\"name": {"values": [None, True, 1, "1", 1.5, {"future": "é"}]}}
        server.storage_put(self.path, "new-list", json.dumps(value), 0, True)
        actual = json.loads(server.storage_get(self.path, "new-list"))
        self.assertEqual(actual, value)
        self.assertIs(actual["boolean"], False)
        self.assertIsInstance(actual["integer"], int)
        self.assertIsInstance(actual["float"], float)

    def test_invalid_native_write_rolls_back_all_changes(self):
        broken = {**self.fixture, "units": {"rows": [{"id": "same"}, {"id": "same"}]}}
        with self.assertRaises(ValueError):
            server.storage_put(self.path, "of:test", json.dumps(broken), 1, True)
        self.assertEqual(json.loads(server.storage_get(self.path, "of:test")), self.fixture)
        with server.connect_db(self.path) as conn:
            self.assertEqual(read_document(conn, "of:test")[1], 1)

    def test_v2_upgrade_preserves_revision_and_does_not_reimport_json(self):
        other = self.directory / "v2"
        other.mkdir()
        db = other / server.DB_NAME
        with closing(sqlite3.connect(db)) as conn:
            conn.execute("CREATE TABLE documents(key TEXT PRIMARY KEY,kind TEXT,metadata TEXT,revision INTEGER,updated_at REAL)")
            conn.execute("CREATE TABLE collections(document_key TEXT,path TEXT,entity_table TEXT)")
            for table in TABLES:
                conn.execute(f"CREATE TABLE {table}(document_key TEXT,collection_path TEXT,position INTEGER,payload TEXT)")
            conn.execute("CREATE TABLE work_orders(document_key TEXT)")
            conn.execute("CREATE TABLE users(document_key TEXT)")
            conn.execute("CREATE TABLE storage(key TEXT,value TEXT,updated_at REAL)")
            conn.execute("INSERT INTO storage VALUES('of:test','{}',1)")
            header = {**self.fixture, "units": {"rows": []}}
            conn.execute("INSERT INTO documents VALUES('of:test','of',?,7,123)", (json.dumps(header),))
            path = json.dumps(["units", "rows"])
            conn.execute("INSERT INTO collections VALUES('of:test',?,'units')", (path,))
            conn.execute("INSERT INTO units VALUES('of:test',?,0,?)", (path, json.dumps(self.fixture["units"]["rows"][0])))
            conn.execute("PRAGMA user_version=2")
            conn.commit()
        (other / server.key_to_filename("of:test")).write_text("{}", encoding="utf-8")
        server.init_database(other)
        with server.connect_db(db) as conn:
            self.assertEqual(conn.execute("PRAGMA user_version").fetchone()[0], SCHEMA_VERSION)
            self.assertEqual(read_document(conn, "of:test"), (self.fixture, 7))
        server.init_database(other)
        self.assertEqual(json.loads(server.storage_get(db, "of:test")), self.fixture)
        self.assertEqual(len(list(other.glob("*-before-relational-*.sqlite"))), 1)

    def test_schema_conversion_failure_restores_v2_tables(self):
        other = self.directory / "broken-v2"
        other.mkdir()
        db = other / server.DB_NAME
        broken = {"header": {"of": "BAD"}, "units": {"rows": [{"id": "duplicate"}, {"id": "duplicate"}]}}
        with closing(sqlite3.connect(db)) as conn:
            conn.execute("CREATE TABLE documents(key TEXT PRIMARY KEY,kind TEXT,metadata TEXT,revision INTEGER,updated_at REAL)")
            conn.execute("CREATE TABLE collections(document_key TEXT,path TEXT,entity_table TEXT)")
            for table in TABLES:
                conn.execute(f"CREATE TABLE {table}(document_key TEXT,collection_path TEXT,position INTEGER,payload TEXT)")
            conn.execute("INSERT INTO documents VALUES('of:bad','of',?,9,123)", (json.dumps(broken),))
            conn.execute("PRAGMA user_version=2")
            conn.commit()
        with self.assertRaises(ValueError):
            server.init_database(other)
        with closing(sqlite3.connect(db)) as conn:
            self.assertEqual(conn.execute("PRAGMA user_version").fetchone()[0], 2)
            self.assertEqual(json.loads(conn.execute("SELECT metadata FROM documents").fetchone()[0]), broken)
            self.assertEqual(conn.execute("SELECT revision FROM documents").fetchone()[0], 9)
            self.assertIn("payload", [r[1] for r in conn.execute("PRAGMA table_info(units)")])

    def test_home_headers_are_read_from_work_order(self):
        listing = json.loads(server.storage_get(self.path, "of-list"))
        self.assertEqual(listing[0]["of"], "1000567")
        changed = {**self.fixture, "header": {**self.fixture["header"], "description": "New description"}}
        server.storage_put(self.path, "of:test", json.dumps(changed), 1, True)
        listing = json.loads(server.storage_get(self.path, "of-list"))
        self.assertEqual(listing[0]["description"], "New description")

    def test_http_revisions(self):
        class Handler(server.StorageServer):
            db_path = self.path
            authentication_enabled = False
            def log_message(self, *args):
                pass
        httpd = server.ThreadingHTTPServer(("127.0.0.1", 0), Handler)
        thread = threading.Thread(target=httpd.serve_forever)
        thread.start()
        try:
            url = f"http://127.0.0.1:{httpd.server_port}/api/storage/of%3Atest"
            with urllib.request.urlopen(url) as response:
                self.assertEqual(response.headers["ETag"], '"1"')
                self.assertEqual(json.load(response), self.fixture)
            request = urllib.request.Request(url, data=b'{"header":{"of":"1000567"}}', method="PUT", headers={"If-Match": '"1"'})
            with urllib.request.urlopen(request) as response:
                self.assertEqual(response.headers["ETag"], '"2"')
            with self.assertRaises(urllib.error.HTTPError) as caught:
                urllib.request.urlopen(request)
            self.assertEqual(caught.exception.code, 409)
            caught.exception.close()
            with self.assertRaises(urllib.error.HTTPError) as caught:
                urllib.request.urlopen(f"http://127.0.0.1:{httpd.server_port}/server.py")
            self.assertEqual(caught.exception.code, 403)
            caught.exception.close()
            with urllib.request.urlopen(f"http://127.0.0.1:{httpd.server_port}/api/health") as response:
                self.assertEqual(json.load(response)["schemaVersion"], SCHEMA_VERSION)
            request = urllib.request.Request(url, data=b'{}', method="PUT")
            with self.assertRaises(urllib.error.HTTPError) as caught:
                urllib.request.urlopen(request)
            self.assertEqual(caught.exception.code, 409)
            caught.exception.close()
        finally:
            httpd.shutdown()
            httpd.server_close()
            thread.join()

    def test_invalid_migration_keeps_legacy(self):
        other = self.directory / "invalid"
        other.mkdir()
        db = other / server.DB_NAME
        with closing(sqlite3.connect(db)) as conn:
            conn.execute("CREATE TABLE storage(key TEXT PRIMARY KEY,value TEXT NOT NULL,updated_at REAL NOT NULL)")
            conn.execute("INSERT INTO storage VALUES('invalid', 'not-json', 123)")
            conn.commit()
        with self.assertRaises(json.JSONDecodeError):
            server.init_database(other)
        with closing(sqlite3.connect(db)) as conn:
            self.assertEqual(conn.execute("SELECT value FROM storage").fetchone()[0], "not-json")
            self.assertEqual(conn.execute("PRAGMA user_version").fetchone()[0], 0)


if __name__ == "__main__":
    unittest.main()
