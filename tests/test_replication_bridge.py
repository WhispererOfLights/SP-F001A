import json
import os
import sqlite3
import tempfile
import unittest
from contextlib import closing
from pathlib import Path
from unittest.mock import patch

import server
from replication_bridge import pending_count
from scripts.migrate_sqlite_to_postgres import load_snapshot, snapshot_database


class ReplicationBridgeTests(unittest.TestCase):
    def setUp(self):
        self.directory=tempfile.TemporaryDirectory()
        self.folder=Path(self.directory.name)
        self.db_path,_=server.init_database(self.folder)

    def tearDown(self):
        self.directory.cleanup()

    def test_outbox_is_atomic_and_keeps_full_document(self):
        value={"header":{"of":"1001"},"units":{"rows":[{"id":"u1","lot":"0000020516"}]}}
        with patch.dict(os.environ,{"SP_F001A_REPLICATION_OUTBOX":"1"}):
            revision=server.storage_put(self.db_path,"of:test",json.dumps(value),0,True)
            self.assertEqual(pending_count(self.db_path),1)
            server.storage_delete(self.db_path,"of:test",revision,True)
        with closing(sqlite3.connect(self.db_path)) as conn:
            events=conn.execute("""
                SELECT document_key,operation,revision,payload FROM replication_outbox ORDER BY event_id
            """).fetchall()
        self.assertEqual(events[0][:3],("of:test","upsert",1))
        self.assertEqual(json.loads(events[0][3]),value)
        self.assertEqual(events[1],("of:test","delete",None,None))

    def test_live_snapshot_preserves_documents_and_revisions(self):
        value={"header":{"of":"2002"},"unknown":{"future":True}}
        server.storage_put(self.db_path,"of:snapshot",json.dumps(value),0,True)
        snapshot=self.folder/"online-copy.sqlite"
        snapshot_database(self.db_path,snapshot)
        documents={key:(payload,revision) for key,payload,revision,_,_ in load_snapshot(snapshot)}
        self.assertEqual(documents["of:snapshot"],(value,1))


if __name__=="__main__":
    unittest.main()
