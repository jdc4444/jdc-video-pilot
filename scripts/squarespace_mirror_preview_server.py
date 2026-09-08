#!/usr/bin/env python3
"""Serve the combined-master Squarespace mirror without changing Squarespace."""

from __future__ import annotations

import argparse
import http.server
import mimetypes
import os
import re
import urllib.error
import urllib.request
from pathlib import Path
from urllib.parse import urlsplit


ROOT = Path(__file__).resolve().parents[1]
FIN_HTML = Path("/Users/alphaone/Documents/Code/fin_v1/output/html")
ORIGIN = "https://www.josdiazcontreras.com"
DATA = ROOT / "jdc-squarespace-mirror-data-draft1.js"
DRAFT = ROOT / "jdc-squarespace-mirror-draft1.js"
TEMPLATE_ROUTE = "/day-one"


class Handler(http.server.SimpleHTTPRequestHandler):
    server_version = "JDCSquarespaceMirror/1"

    def translate_path(self, path: str) -> str:
        relative = urlsplit(path).path.lstrip("/")
        if relative.startswith("__combined/"):
            return str(FIN_HTML / relative.removeprefix("__combined/"))
        return str(ROOT / relative)

    def end_headers(self) -> None:
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def serve_file(self, path: Path) -> None:
        if not path.is_file():
            self.send_error(404)
            return
        content_type, _ = mimetypes.guess_type(path.name)
        size = path.stat().st_size
        range_header = self.headers.get("Range")
        if range_header:
            match = re.fullmatch(r"bytes=(\d*)-(\d*)", range_header.strip())
            if match:
                start = int(match.group(1) or 0)
                end = int(match.group(2) or size - 1)
                end = min(end, size - 1)
                if start <= end:
                    length = end - start + 1
                    self.send_response(206)
                    self.send_header("Content-Type", content_type or "application/octet-stream")
                    self.send_header("Accept-Ranges", "bytes")
                    self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
                    self.send_header("Content-Length", str(length))
                    self.end_headers()
                    with path.open("rb") as source:
                        source.seek(start)
                        self.wfile.write(source.read(length))
                    return
        self.send_response(200)
        self.send_header("Content-Type", content_type or "application/octet-stream")
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Content-Length", str(size))
        self.end_headers()
        with path.open("rb") as source:
            while chunk := source.read(1024 * 1024):
                self.wfile.write(chunk)

    def do_GET(self) -> None:
        request_path = urlsplit(self.path).path
        if request_path.startswith("/__combined/"):
            self.serve_file(Path(self.translate_path(self.path)))
            return
        local = Path(self.translate_path(self.path))
        if local.is_file():
            self.serve_file(local)
            return

        template_route = "/" if request_path in {"/", "/onepage"} else request_path
        request = urllib.request.Request(
            ORIGIN + template_route,
            headers={"User-Agent": "Mozilla/5.0", "Cache-Control": "no-cache"},
        )
        try:
            with urllib.request.urlopen(request, timeout=30) as response:
                body = response.read().decode("utf-8", "replace")
        except urllib.error.HTTPError:
            fallback = urllib.request.Request(
                ORIGIN + TEMPLATE_ROUTE,
                headers={"User-Agent": "Mozilla/5.0", "Cache-Control": "no-cache"},
            )
            with urllib.request.urlopen(fallback, timeout=30) as response:
                body = response.read().decode("utf-8", "replace")

        # The archive is the rollback authority.  The mirror preview deliberately
        # removes the public Pilot loader before installing the local draft so a
        # remote release cannot race and rewrite the preview DOM.
        body = re.sub(
            r"<script[^>]+(?:jdc-video-pilot|jdc-footer-pilot|jdc-onepage-pilot|jdc-squarespace-mirror)[^>]*></script>",
            "",
            body,
            flags=re.IGNORECASE,
        )
        port = self.server.server_port
        stamp = max(DATA.stat().st_mtime_ns, DRAFT.stat().st_mtime_ns)
        injection = (
            f'<script src="http://127.0.0.1:{port}/{DATA.name}?v={stamp}" '
            'data-jdc-squarespace-mirror-data="draft1"></script>'
            f'<script src="http://127.0.0.1:{port}/{DRAFT.name}?v={stamp}" '
            'data-jdc-squarespace-mirror="draft1"></script>'
        )
        body = body.replace("<head>", f'<head><base href="{ORIGIN}/">', 1)
        if "</body>" in body:
            body = body.replace("</body>", injection + "</body>", 1)
        else:
            body += injection
        encoded = body.encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(encoded)))
        self.end_headers()
        self.wfile.write(encoded)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--port", type=int, default=8767)
    args = parser.parse_args()
    os.chdir(ROOT)
    http.server.ThreadingHTTPServer(("127.0.0.1", args.port), Handler).serve_forever()


if __name__ == "__main__":
    main()
