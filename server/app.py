"""Serve the waitlist API and, after a Vite build, the site itself."""

from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import json
import os
from pathlib import Path
from urllib.parse import urlsplit

from server.waitlist import WaitlistStore

ROOT = Path(__file__).resolve().parent.parent
MAX_BODY_BYTES = 4096


class WaitlistHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, store: WaitlistStore, directory: str, **kwargs):
        self.store = store
        super().__init__(*args, directory=directory, **kwargs)

    def setup(self):
        super().setup()
        self.connection.settimeout(15)

    def log_message(self, _format, *_args):
        # Never log submitted names, emails, or query strings.
        pass

    def respond(self, status: int, payload: dict):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        if status == 405:
            self.send_header("Allow", "POST")
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(body)

    def do_POST(self):
        if urlsplit(self.path).path != "/api/waitlist":
            self.respond(404, {"error": "Not found"})
            return
        if self.headers.get_content_type() != "application/json":
            self.respond(415, {"error": "Please send JSON."})
            return
        # The API is intended for the site's own form, with no cross-origin access.
        if self.headers.get("Sec-Fetch-Site") == "cross-site":
            self.respond(403, {"error": "Please join from the VPO website."})
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            self.respond(400, {"error": "Invalid request."})
            return
        if length <= 0 or length > MAX_BODY_BYTES or self.headers.get("Transfer-Encoding"):
            self.respond(413, {"error": "Invalid request size."})
            return
        try:
            payload = json.loads(self.rfile.read(length))
            self.store.join(payload)
        except (ValueError, UnicodeError):
            self.respond(400, {"error": "Please enter a valid full name and email address."})
            return
        except Exception:
            self.respond(503, {"error": "We couldn’t save your place. Please try again."})
            return
        self.respond(200, {"ok": True})

    def do_GET(self):
        self.serve_site(head_only=False)

    def do_HEAD(self):
        self.serve_site(head_only=True)

    def serve_site(self, head_only: bool):
        route = urlsplit(self.path).path
        if route == "/api/waitlist":
            self.respond(405, {"error": "Method not allowed"})
            return
        if route.startswith("/api/"):
            self.respond(404, {"error": "Not found"})
            return
        root = Path(self.directory).resolve()
        target = Path(self.translate_path(self.path)).resolve()
        if not target.is_relative_to(root):
            self.send_error(404)
            return
        if not target.is_file():
            # Support the React routes, without exposing directory listings or data.
            if not Path(route).suffix and (root / "index.html").is_file():
                self.path = "/index.html"
            else:
                self.send_error(404)
                return
        if head_only:
            super().do_HEAD()
        else:
            super().do_GET()


def create_server(host="127.0.0.1", port=8788, csv_path=None, directory=None):
    store = WaitlistStore(csv_path or os.environ.get("WAITLIST_CSV_PATH", ROOT / "data" / "waitlist.csv"))
    handler = partial(WaitlistHandler, store=store, directory=str(directory or ROOT / "dist"))
    return ThreadingHTTPServer((host, port), handler)


if __name__ == "__main__":
    server = create_server(os.environ.get("HOST", "127.0.0.1"), int(os.environ.get("PORT", "8788")))
    print(f"VPO server listening on http://{server.server_address[0]}:{server.server_address[1]}", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
