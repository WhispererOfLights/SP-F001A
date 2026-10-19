import http.cookiejar
import json
import tempfile
import threading
import unittest
import urllib.error
import urllib.request
from unittest.mock import patch
from pathlib import Path
from http.server import ThreadingHTTPServer

import server


class AuthServerTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        db_path, _ = server.init_database(Path(self.tmp.name))
        server.ensure_admin_database(db_path)
        self.db_path = db_path
        legacy_user = {
            "trigram": "JGR",
            "role": "Manager",
            "prenom": "Julien",
            "pwd": server.legacy_hash("ancien"),
        }
        server.save_user(db_path, legacy_user)
        server.save_user(db_path, {
            "trigram": "PA1", "role": "Product Assurance", "prenom": "Paula",
            "passwordAuth": server.password_record("pa-test"),
        })
        server.save_user(db_path, {
            "trigram": "LCT", "role": "Consultation", "prenom": "Lecteur",
            "passwordAuth": server.password_record("lecture-test"),
        })
        server.storage_put(db_path, "of-list", json.dumps([{"id": "test", "of": "1000"}]))
        server.storage_put(db_path, "of:test", json.dumps({
            "header": {"of": "1000"},
            "faits": {"rows": [{"id": "fait-1", "numero": "NC-1", "closedDate": "", "closedVisa": ""}]},
            "openwork": {"rows": [{"id": "ow-1", "nOW": "001", "closedDate": "", "closedVisa": ""}]},
        }))

        class Handler(server.StorageServer):
            pass

        Handler.db_path = db_path
        Handler.data_dir = Path(self.tmp.name)
        self.httpd = ThreadingHTTPServer(("127.0.0.1", 0), Handler)
        self.thread = threading.Thread(target=self.httpd.serve_forever, daemon=True)
        self.thread.start()
        self.base = f"http://127.0.0.1:{self.httpd.server_port}"
        self.cookies = http.cookiejar.CookieJar()
        self.client = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(self.cookies))

    def tearDown(self):
        self.httpd.shutdown()
        self.httpd.server_close()
        self.thread.join(timeout=2)
        self.tmp.cleanup()
        with server.SESSION_LOCK:
            server.SESSIONS.clear()

    def request(self, path, method="GET", payload=None, headers=None):
        data = json.dumps(payload).encode() if payload is not None else None
        request = urllib.request.Request(
            self.base + path,
            data=data,
            method=method,
            headers={"Content-Type": "application/json", **(headers or {})},
        )
        try:
            response = self.client.open(request)
        except urllib.error.HTTPError as error:
            return error.code, json.loads(error.read()), error.headers
        return response.status, json.loads(response.read()), response.headers

    def test_login_migrates_legacy_password_and_protects_storage(self):
        status, _, _ = self.request("/api/storage/of%3Atest")
        self.assertEqual(status, 401)

        status, payload, _ = self.request(
            "/api/auth/login", "POST", {"trigram": "jgr", "password": "ancien"}
        )
        self.assertEqual(status, 200)
        self.assertEqual(payload["user"]["trigram"], "JGR")
        self.assertNotIn("pwd", payload["user"])
        self.assertNotIn("passwordAuth", payload["user"])

        raw = server.raw_user(self.db_path, "JGR")[0]
        self.assertNotIn("pwd", raw)
        self.assertEqual(raw["passwordAuth"]["scheme"], "pbkdf2-sha256")

        status, user_payload, _ = self.request("/api/storage/user%3AJGR")
        self.assertEqual(status, 200)
        self.assertNotIn("passwordAuth", user_payload)

        status, home_payload, _ = self.request("/api/home-summary")
        self.assertEqual(status, 200)
        self.assertEqual(home_payload["documents"]["test"]["header"]["of"], "1000")

        status, _, headers = self.request("/api/storage/of%3Atest")
        self.assertEqual(status, 200)
        status, _, _ = self.request(
            "/api/storage/of%3Atest",
            "PUT",
            {"header": {"of": "1001"}},
            {"If-Match": headers["ETag"]},
        )
        self.assertEqual(status, 200)

        status, _, _ = self.request("/api/auth/logout", "POST", {})
        self.assertEqual(status, 200)
        status, _, _ = self.request("/api/storage/of%3Atest")
        self.assertEqual(status, 401)

    def test_bootstrap_admin_uses_forced_secure_password(self):
        record = server.raw_user(self.db_path, "ADMIN")[0]
        self.assertTrue(record["mustChangePassword"])
        self.assertTrue(server.verify_password(record, "admin"))
        self.assertNotIn("pwd", record)

    def test_non_read_only_role_can_close_without_general_write_access(self):
        status, _, _ = self.request(
            "/api/auth/login", "POST", {"trigram": "PA1", "password": "pa-test"}
        )
        self.assertEqual(status, 200)
        status, _, headers = self.request("/api/storage/of%3Atest")
        self.assertEqual(status, 200)

        status, _, _ = self.request(
            "/api/storage/of%3Atest", "PUT", {"header": {"of": "9999"}},
            {"If-Match": headers["ETag"]},
        )
        self.assertEqual(status, 403)

        status, payload, _ = self.request(
            "/api/work-items/close", "POST",
            {"key": "of:test", "tab": "faits", "rowId": "fait-1", "closed": True},
            {"If-Match": headers["ETag"]},
        )
        self.assertEqual(status, 200)
        row = payload["document"]["faits"]["rows"][0]
        self.assertEqual(row["closedVisa"], "PA1")
        self.assertTrue(row["closedDate"])

    def test_read_only_role_cannot_close_work_item(self):
        status, _, _ = self.request(
            "/api/auth/login", "POST", {"trigram": "LCT", "password": "lecture-test"}
        )
        self.assertEqual(status, 200)
        status, _, headers = self.request("/api/storage/of%3Atest")
        self.assertEqual(status, 200)
        status, _, _ = self.request(
            "/api/work-items/close", "POST",
            {"key": "of:test", "tab": "openwork", "rowId": "ow-1", "closed": True},
            {"If-Match": headers["ETag"]},
        )
        self.assertEqual(status, 403)

    def test_cutover_read_only_keeps_reads_and_rejects_writes(self):
        status, _, _ = self.request(
            "/api/auth/login", "POST", {"trigram": "jgr", "password": "ancien"}
        )
        self.assertEqual(status, 200)
        status, _, headers = self.request("/api/storage/of%3Atest")
        self.assertEqual(status, 200)
        with patch.dict("os.environ", {"SP_F001A_READ_ONLY": "1"}):
            status, payload, _ = self.request(
                "/api/storage/of%3Atest", "PUT", {"header": {"of": "9999"}},
                {"If-Match": headers["ETag"]},
            )
            self.assertEqual(status, 503)
            self.assertIn("Bascule PostgreSQL", payload["error"])
            status, _, _ = self.request("/api/storage/of%3Atest")
            self.assertEqual(status, 200)


if __name__ == "__main__":
    unittest.main()
