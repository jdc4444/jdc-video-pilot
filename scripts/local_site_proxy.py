#!/usr/bin/env python3
"""Preview live Squarespace pages with the current local JDC gallery assets."""

from __future__ import annotations

import argparse
import http.server
import os
import re
import urllib.request
from pathlib import Path
from urllib.parse import urlsplit


ROOT = Path(__file__).resolve().parents[1]
ORIGIN = "https://www.josdiazcontreras.com"


class Handler(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path: str) -> str:
        relative = urlsplit(path).path.lstrip("/")
        return str(ROOT / relative)

    def do_GET(self) -> None:
        relative = urlsplit(self.path).path.lstrip("/")
        local = ROOT / relative
        if local.is_file():
            return super().do_GET()

        request = urllib.request.Request(
            ORIGIN + self.path,
            headers={"User-Agent": "Mozilla/5.0", "Cache-Control": "no-cache"},
        )
        with urllib.request.urlopen(request, timeout=30) as response:
            body = response.read().decode("utf-8", "replace")
        local_loader = (
            f'<script src="http://127.0.0.1:{self.server.server_port}/jdc-footer-pilot42.js?v=local-spacing-draft-3" '
            'data-jdc-footer="pilot42-local-draft"></script>'
        )
        body, replacements = re.subn(
            r'<script[^>]+data-jdc-footer="[^"]+"[^>]*></script>',
            local_loader,
            body,
            count=1,
        )
        if not replacements:
            body = body.replace("</body>", local_loader + "</body>", 1)
        body = body.replace("<head>", f'<head><base href="{ORIGIN}/">', 1)
        encoded = body.encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(encoded)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(encoded)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--port", type=int, default=8888)
    args = parser.parse_args()
    os.chdir(ROOT)
    http.server.ThreadingHTTPServer(("127.0.0.1", args.port), Handler).serve_forever()


if __name__ == "__main__":
    main()
