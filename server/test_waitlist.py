from concurrent.futures import ThreadPoolExecutor
import http.client
import json
from pathlib import Path
import tempfile
from threading import Thread
import unittest
from unittest.mock import patch

import pandas as pd

from server.app import create_server
from server.waitlist import WaitlistStore


class WaitlistTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.root = Path(self.temporary.name)
        self.csv = self.root / "data" / "waitlist.csv"
        self.dist = self.root / "dist"
        self.dist.mkdir()
        (self.dist / "index.html").write_text("<html>VPO</html>")
        self.server = create_server(port=0, csv_path=self.csv, directory=self.dist)
        self.thread = Thread(target=self.server.serve_forever, daemon=True)
        self.thread.start()

    def tearDown(self):
        self.server.shutdown()
        self.server.server_close()
        self.thread.join()
        self.temporary.cleanup()

    def request(self, payload=None, method="POST", path="/api/waitlist", body=None, headers=None):
        connection = http.client.HTTPConnection(*self.server.server_address, timeout=5)
        if body is None and payload is not None:
            body = json.dumps(payload)
        connection.request(method, path, body=body, headers=headers or {"Content-Type": "application/json"})
        response = connection.getresponse()
        result = (response.status, response.read(), dict(response.getheaders()))
        connection.close()
        return result

    def test_save_unicode_csv_quoting_and_reload(self):
        status, body, headers = self.request({"fullName": '  Zoë "Z", O’Neill  ', "email": " ZOE@Example.com "})
        self.assertEqual(status, 200)
        self.assertEqual(json.loads(body), {"ok": True})
        self.assertEqual(headers["Cache-Control"], "no-store")
        saved = pd.read_csv(self.csv, dtype=str, keep_default_na=False)
        self.assertEqual(saved.to_dict("records"), [{"full_name": 'Zoë "Z", O’Neill', "email": "zoe@example.com"}])
        # A fresh store reads the persisted data, including names pandas usually treats as NA.
        WaitlistStore(self.csv).join({"fullName": "NA", "email": "second@example.com"})
        reloaded = pd.read_csv(self.csv, dtype=str, keep_default_na=False)
        self.assertEqual(reloaded["full_name"].tolist(), ['Zoë "Z", O’Neill', "NA"])

    def test_duplicate_email_does_not_overwrite_name(self):
        self.request({"fullName": "Original Name", "email": "hello@example.com"})
        self.assertEqual(self.request({"fullName": "Other Name", "email": "HELLO@example.com"})[0], 200)
        saved = pd.read_csv(self.csv)
        self.assertEqual(len(saved), 1)
        self.assertEqual(saved.iloc[0]["full_name"], "Original Name")

    def test_invalid_data_is_not_saved(self):
        for payload in [None, [], {}, {"fullName": "  ", "email": "a@example.com"},
                        {"fullName": 123, "email": "a@example.com"},
                        {"fullName": "A\nB", "email": "a@example.com"},
                        {"fullName": "A" * 121, "email": "a@example.com"},
                        {"fullName": "Test Name", "email": "broken"},
                        {"fullName": "Test Name", "email": "x" * 250 + "@example.com"}]:
            with self.subTest(payload=payload):
                status = self.request(body=json.dumps(payload))[0]
                self.assertEqual(status, 400)
        self.assertFalse(self.csv.exists())

    def test_bad_requests_and_private_data(self):
        self.assertEqual(self.request(body="{bad json")[0], 400)
        self.assertEqual(self.request(body="x" * 4097)[0], 413)
        self.assertEqual(self.request(body="{}", headers={"Content-Type": "text/plain"})[0], 415)
        self.assertEqual(self.request(body="{}", headers={"Content-Type": "application/json", "Sec-Fetch-Site": "cross-site"})[0], 403)
        self.assertEqual(self.request(method="GET")[0], 405)
        self.request({"fullName": "Private Person", "email": "private@example.com"})
        for path in ["/data/waitlist.csv", "/../data/waitlist.csv", "/%2e%2e/data/waitlist.csv", "/api/other"]:
            self.assertEqual(self.request(method="GET", path=path)[0], 404)
        self.assertEqual(self.request(method="GET", path="/gallery")[1], b"<html>VPO</html>")

    def test_concurrent_submissions_preserve_every_row(self):
        with ThreadPoolExecutor(max_workers=6) as executor:
            responses = list(executor.map(lambda index: self.request({
                "fullName": f"Guest {index}", "email": f"guest{index}@example.com",
            }), range(18)))
        self.assertTrue(all(response[0] == 200 for response in responses))
        self.assertEqual(len(pd.read_csv(self.csv)), 18)

    def test_write_failure_keeps_existing_csv_and_does_not_report_success(self):
        self.request({"fullName": "Saved Guest", "email": "saved@example.com"})
        original = self.csv.read_bytes()
        with patch("server.waitlist.os.replace", side_effect=OSError("Disk unavailable")):
            status, body, _ = self.request({"fullName": "New Guest", "email": "new@example.com"})
        self.assertEqual(status, 503)
        self.assertNotIn("ok", json.loads(body))
        self.assertEqual(self.csv.read_bytes(), original)
        self.assertEqual(list(self.csv.parent.glob(".waitlist-*")), [])


if __name__ == "__main__":
    unittest.main()
