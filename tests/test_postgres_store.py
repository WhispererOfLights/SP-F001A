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
from replication_bridge import ReplicationWorker,ensure_capture_triggers,pending_count
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

    def test_relational_projection_tracks_references_users_and_tabs(self):
        statuses=[{"id":"en_cours","label":"En cours","color":"#1f6feb","closed":False}]
        consumables=[{"id":"glue-1","cat":"Colle","sap":"1600000001","code":"COL-1",
                      "label":"Colle test","polymerizationHours":"72"}]
        facts=[{"id":"NC","label":"Non-conformité","color":"#da3633"},
               {"id":"OW","label":"Open Work","color":"#e05c00"}]
        user={"trigram":"TST","prenom":"Test","nom":"Projection","service":"Méthodes",
              "role":"Manager","passwordAuth":{"scheme":"pbkdf2-sha256","iterations":240000,
              "salt":"salt","digest":"digest"}}
        document={
            "header":{"id":"relational-of","of":"OF-REL","codeArticle":"2500000001",
                      "description":"Article relationnel","status":"en_cours"},
            "units":{"rows":[{"id":"unit-1","sn":"SN-REL","status":"en_cours"}]},
            "rework":{"rows":[{"id":"rw-1","unitId":"unit-1","repere":"R10","action1":"S",
                                "createdVisa":"TST","validated":True,
                                "deleted":True,"deletedReason":"Erreur de saisie",
                                "deletedVisa":"TST","deletedDate":"21/10/2026 08:00",
                                "comments":[{"id":"c1","visa":"TST","text":"Contrôle visuel"}]}]},
            "consommables":{"ops":[{"id":"co-1","unitId":"unit-1","items":[
                {"id":"ci-1","consoId":"glue-1","lot":"LOT-1","echantillon":"ECH-1"}]}]},
            "etuvage":{"rows":[{"id":"ov-1","unitId":"unit-1","fourN":"F1","duree":"72","temp":"60",
                                  "deleted":True,"deletedReason":"Cycle annulé","deletedVisa":"TST",
                                  "deletedDate":"21/10/2026 08:05","restoredReason":"Cycle confirmé",
                                  "restoredVisa":"MGR","restoredDate":"21/10/2026 08:10"}]},
            "testequip":{"rows":[{"id":"eq-1","unitId":"unit-1","nInv":"INV-1"}]},
            "faits":{"rows":[{"id":"fact-1","unitId":"unit-1","type":"OW","numero":"OW001"}]},
            "demating":{"connectors":[{"id":"cn-1","unitId":"unit-1","nConect":"J1",
                                        "events":[{"action":"M","visa":"TST","deleted":True,
                                                   "deletedReason":"Mauvais connecteur","deletedVisa":"TST",
                                                   "deletedDate":"21/10/2026 08:15"}]}]},
        }
        server.storage_put(DATABASE_URL,"status-types",json.dumps(statuses),0,True)
        server.storage_put(DATABASE_URL,"consommables-list",json.dumps(consumables),0,True)
        server.storage_put(DATABASE_URL,"fait-types",json.dumps(facts),0,True)
        server.storage_put(DATABASE_URL,"user:TST",json.dumps(user),0,True)
        server.storage_put(DATABASE_URL,"of:relational-of",json.dumps(document),0,True)
        with postgres_store.connect_database(DATABASE_URL) as conn:
            self.assertEqual(conn.execute("SELECT role_code FROM users WHERE trigram='TST'").fetchone()[0],"manager")
            self.assertEqual(conn.execute("SELECT label FROM consumable_catalog WHERE id='glue-1'").fetchone()[0],"Colle test")
            self.assertEqual(conn.execute("SELECT count(*) FROM of_units").fetchone()[0],1)
            for table in ("rework_operations","consumable_operations","consumable_items","oven_runs",
                          "equipment_operations","technical_events","connector_operations",
                          "connector_events","comments"):
                self.assertEqual(conn.execute(f"SELECT count(*) FROM {table}").fetchone()[0],1,table)
            self.assertEqual(
                conn.execute("SELECT deletion_reason,deleted_by,deleted_at_text FROM rework_operations").fetchone(),
                ("Erreur de saisie","TST","21/10/2026 08:00"),
            )
            self.assertEqual(
                conn.execute("SELECT deletion_reason,restoration_reason,restored_by FROM oven_runs").fetchone(),
                ("Cycle annulé","Cycle confirmé","MGR"),
            )
            self.assertEqual(
                conn.execute("SELECT deleted,deletion_reason FROM connector_events").fetchone(),
                (True,"Mauvais connecteur"),
            )

        document["rework"]["rows"]=[]
        server.storage_put(DATABASE_URL,"of:relational-of",json.dumps(document),1,True)
        with postgres_store.connect_database(DATABASE_URL) as conn:
            self.assertEqual(conn.execute("SELECT count(*) FROM rework_operations").fetchone()[0],0)
            self.assertEqual(conn.execute("SELECT count(*) FROM comments").fetchone()[0],0)

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

    def test_capture_trigger_replays_current_document(self):
        with tempfile.TemporaryDirectory() as folder:
            sqlite_path,_=server.init_database(Path(folder))
            with server.connect_db(sqlite_path) as conn:
                ensure_capture_triggers(conn)
                conn.commit()
            first={"header":{"of":"CAP100"},"units":{"rows":[]}}
            second={"header":{"of":"CAP100"},"units":{"rows":[{"id":"u1","sn":"SN2"}]}}
            server.storage_put(sqlite_path,"of:captured",json.dumps(first),0,True)
            server.storage_put(sqlite_path,"of:captured",json.dumps(second),1,True)
            worker=ReplicationWorker(sqlite_path,DATABASE_URL)
            while pending_count(sqlite_path):
                self.assertTrue(worker.process_one())
            with postgres_store.connect_database(DATABASE_URL) as conn:
                self.assertEqual(postgres_store.read_document(conn,"of:captured"),(second,2))

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
