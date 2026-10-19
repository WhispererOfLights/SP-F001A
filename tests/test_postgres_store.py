import json
import os
import tempfile
import threading
import unittest
import urllib.request
import uuid
from http.server import ThreadingHTTPServer
from pathlib import Path
from unittest.mock import patch

import postgres_store
import server
from replication_bridge import ReplicationWorker,pending_count
from relational_store import ConflictError
from scripts.migrate_sqlite_to_postgres import migrate


DATABASE_URL=os.environ.get("TEST_DATABASE_URL","")


@unittest.skipUnless(DATABASE_URL,"TEST_DATABASE_URL absent")
class PostgresStoreTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        postgres_store.init_database(DATABASE_URL)

    def setUp(self):
        with postgres_store.connect_database(DATABASE_URL) as conn:
            conn.execute("DELETE FROM documents")
            conn.commit()

    def test_lossless_documents_revisions_and_reporting_views(self):
        of_id=str(uuid.uuid4())
        key=f"of:{of_id}"
        value={
            "header":{"id":of_id,"of":"1000123","codeArticle":"250001163","description":"Article test"},
            "units":{"rows":[{"id":"u1","sn":"SN0012","lot":"0000020516","status":"en_cours"}]},
            "rework":{"rows":[{"id":"r1","createdVisa":"JGR","validated":True,"repere":"R10"}]},
            "future":{"null":None,"bool":False,"integer":12,"text":"é"},
        }
        self.assertEqual(server.storage_put(DATABASE_URL,key,json.dumps(value),0,True),1)
        self.assertEqual(json.loads(server.storage_get(DATABASE_URL,key)),value)
        self.assertEqual(server.storage_put(DATABASE_URL,key,json.dumps(value),1,True),2)
        with self.assertRaises(ConflictError):
            server.storage_put(DATABASE_URL,key,json.dumps(value),1,True)
        with postgres_store.connect_database(DATABASE_URL) as conn:
            unit=conn.execute("SELECT of_number,sn,lot FROM spf_units WHERE document_key=%s",(key,)).fetchone()
            operation=conn.execute("SELECT row_id,created_by,validated FROM spf_rework_operations WHERE document_key=%s",(key,)).fetchone()
        self.assertEqual(unit,("1000123","SN0012","0000020516"))
        self.assertEqual(operation,("r1","JGR",True))

    def test_server_helpers_use_postgresql_backend(self):
        entry={"id":"pg-of","of":"PG100","status":"en_cours"}
        document={"header":entry,"units":{"rows":[]}}
        server.storage_put(DATABASE_URL,"of-list",json.dumps([entry]),0,True)
        server.storage_put(DATABASE_URL,"of:pg-of",json.dumps(document),0,True)
        self.assertEqual(server.storage_keys(DATABASE_URL),["of-list","of:pg-of"])
        self.assertEqual(server.home_documents(DATABASE_URL),{"pg-of":document})
        server.storage_delete(DATABASE_URL,"of:pg-of",1,True)
        self.assertNotIn("of:pg-of",server.storage_keys(DATABASE_URL))

    def test_live_snapshot_then_outbox_reaches_identical_state(self):
        with tempfile.TemporaryDirectory() as folder:
            sqlite_path,_=server.init_database(Path(folder))
            first={"header":{"of":"MIG100"},"units":{"rows":[{"id":"u1","sn":"SN1"}]}}
            second={"header":{"of":"MIG100"},"units":{"rows":[{"id":"u1","sn":"SN2"}]}}
            with patch.dict(os.environ,{"SP_F001A_REPLICATION_OUTBOX":"1"}):
                server.storage_put(sqlite_path,"of:migration",json.dumps(first),0,True)
                migrate(sqlite_path,DATABASE_URL,replace=True)
                server.storage_put(sqlite_path,"of:migration",json.dumps(second),1,True)
                worker=ReplicationWorker(sqlite_path,DATABASE_URL)
                while pending_count(sqlite_path):
                    self.assertTrue(worker.process_one())
            with postgres_store.connect_database(DATABASE_URL) as conn:
                self.assertEqual(postgres_store.read_document(conn,"of:migration"),(second,2))

    def test_http_server_health_and_login(self):
        server.ensure_admin_database(DATABASE_URL)

        class Handler(server.StorageServer):
            pass

        Handler.db_path=DATABASE_URL
        Handler.database_backend="postgresql"
        Handler.database_schema_version=postgres_store.POSTGRES_SCHEMA_VERSION
        httpd=ThreadingHTTPServer(("127.0.0.1",0),Handler)
        thread=threading.Thread(target=httpd.serve_forever,daemon=True)
        thread.start()
        try:
            base=f"http://127.0.0.1:{httpd.server_port}"
            with urllib.request.urlopen(base+"/api/health") as response:
                health=json.load(response)
            self.assertEqual(health["backend"],"postgresql")
            request=urllib.request.Request(
                base+"/api/auth/login",method="POST",
                data=json.dumps({"trigram":"ADMIN","password":"admin"}).encode(),
                headers={"Content-Type":"application/json"},
            )
            with urllib.request.urlopen(request) as response:
                login=json.load(response)
            self.assertTrue(login["ok"])
            self.assertTrue(login["user"]["mustChangePassword"])
        finally:
            httpd.shutdown()
            httpd.server_close()
            thread.join(timeout=2)


if __name__=="__main__":
    unittest.main()
