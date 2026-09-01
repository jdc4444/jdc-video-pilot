#!/usr/bin/env python3
"""Prepare the deployable Squarespace mirror release from the reviewed draft.

The draft data intentionally uses local ``/__combined/`` URLs for previewing.
This release builder matches those records to the already-published GitHub
resume assets so Squarespace receives stable, browser-accessible URLs without
copying credentials or media into code injection.
"""

from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any
from urllib.parse import urljoin


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DATA = ROOT / "jdc-squarespace-mirror-data-draft1.js"
GITHUB_RESUME = Path(
    "/Users/alphaone/Documents/Code/fin_v1/output/github/jdc_resume/index.html"
)
PAGES_BASE = "https://jdc4444.github.io/jdc_resume/"
DATA_PREFIX = "window.JDC_SQUARESPACE_MIRROR_DRAFT = "
RELEASE = "squarespace-pilot77-complete-onepage"
JLMSY_TRAILER_URL = (
    "https://github.com/jdc4444/jdc_resume/releases/download/media-1/"
    "39c2fef69cac49a8-just-let-me-show-you-trailer.mp4"
    "?deliveryRevision=20260901-squarespace-pilot77"
)
POLYMARKET_HOMEPAGE_PREVIEW_BASE = (
    "https://jdc4444.github.io/jdc-video-pilot/media/"
    "3b76b000-8a29-4aee-915d-858c0b1d1a42/"
)


# These pages were added in the August 25 Squarespace batch. They remain
# accessible directly and on /onepage but must not be inserted into the
# established regular homepage grid.
RECENT_SQUARESPACE_ROUTES = {
    "/mtv-vote-early",
    "/u2-the-best-thing-about-me",
    "/gabriel-garzon-montano-crawl",
    "/armando-young-loved-ones",
    "/dig-brand-identity",
}


def load_mirror() -> dict[str, Any]:
    raw = SOURCE_DATA.read_text(encoding="utf-8").strip()
    if not raw.startswith(DATA_PREFIX) or not raw.endswith(";"):
        raise RuntimeError(f"Unexpected mirror-data wrapper: {SOURCE_DATA}")
    return json.loads(raw[len(DATA_PREFIX) : -1])


def load_resume_projects() -> list[dict[str, Any]]:
    raw = GITHUB_RESUME.read_text(encoding="utf-8")
    match = re.search(r"const projects = (\[.*\]);\n    const list =", raw, re.S)
    if not match:
        raise RuntimeError(f"Could not locate project data in {GITHUB_RESUME}")
    return json.loads(match.group(1))


def hosted_url(value: Any) -> Any:
    if not isinstance(value, str) or not value:
        return value
    if value.startswith(("https://", "http://", "data:")):
        return value
    if value.startswith("/__combined/"):
        value = value.removeprefix("/__combined/")
    return urljoin(PAGES_BASE, value.lstrip("/"))


def find_gallery_match(
    item: dict[str, Any], index: int, candidates: list[dict[str, Any]]
) -> dict[str, Any] | None:
    system_id = item.get("systemDataId")
    if system_id:
        match = next(
            (candidate for candidate in candidates if candidate.get("systemDataId") == system_id),
            None,
        )
        if match:
            return match
    selection = item.get("selection")
    if selection:
        match = next(
            (
                candidate
                for candidate in candidates
                if candidate.get("selection") == selection
                and candidate.get("type") == item.get("type")
            ),
            None,
        )
        if match:
            return match
    return candidates[index] if index < len(candidates) else None


def apply_media(record: dict[str, Any], source: dict[str, Any] | None) -> None:
    if source:
        if source.get("src"):
            record["src"] = hosted_url(source["src"])
        if source.get("poster"):
            record["poster"] = hosted_url(source["poster"])
    if record.get("src"):
        record["src"] = hosted_url(record["src"])
    if record.get("poster"):
        record["poster"] = hosted_url(record["poster"])


def build() -> dict[str, Any]:
    payload = load_mirror()
    resume_projects = load_resume_projects()
    resume_by_route = {project["route"]: project for project in resume_projects}

    # Do not publish a workstation path in the public release payload.
    payload["source"] = "combined-master"

    for project in payload["projects"]:
        source = resume_by_route.get(project["combinedRoute"])
        if not source:
            raise RuntimeError(f"Missing hosted project match for {project['combinedRoute']}")
        source_media = source.get("media") or {}
        source_gallery = list((source.get("gallery") or {}).get("items") or [])

        media = project.get("media") or {}
        if source_media.get("src"):
            media["src"] = hosted_url(source_media["src"])
        if source_media.get("poster"):
            media["poster"] = hosted_url(source_media["poster"])
        if source_media.get("playbackSrc"):
            media["playbackSrc"] = hosted_url(source_media["playbackSrc"])
        project["media"] = media

        for key in ("fullFilms", "belowFoldFilms", "onepageBelowFoldFilms"):
            for index, film in enumerate(project.get(key) or []):
                match = None
                if film.get("systemDataId"):
                    match = next(
                        (
                            item
                            for item in source_gallery
                            if item.get("systemDataId") == film.get("systemDataId")
                        ),
                        None,
                    )
                if not match and index == 0:
                    match = {
                        "src": source_media.get("playbackSrc"),
                        "poster": source_media.get("poster"),
                    }
                apply_media(film, match)

        if project["route"] == "/ggm-aguita":
            # Agüita's 1440×1080 master carries a 2:1 sample aspect ratio,
            # so its intended display aspect is 8:3 rather than the coded 4:3.
            # Match the approved combined-site presentation on the project page.
            media["aspect"] = 8 / 3
            media["playbackAspect"] = 8 / 3
            for film in project.get("fullFilms") or []:
                film["aspect"] = 8 / 3

        if project["route"] == "/polymarket-make-your-own-market":
            # Match the established Squarespace homepage preview exactly on
            # Onepage. The project-page film remains owned by fullFilms.
            media["src"] = POLYMARKET_HOMEPAGE_PREVIEW_BASE + "onepage-preview.mp4"
            media["poster"] = POLYMARKET_HOMEPAGE_PREVIEW_BASE + "poster.jpg"

        for key in ("gallery", "onepageGallery"):
            for index, item in enumerate(project.get(key) or []):
                apply_media(item, find_gallery_match(item, index, source_gallery))

        if project["route"] == "/just-let-me-show-you":
            # The 39-minute archival copy is valid research media but is not the
            # official project-page cut and stalls browsers. The original page
            # referenced this 2:38 trailer; use the matching lightweight source.
            media["playbackSrc"] = JLMSY_TRAILER_URL
            media["playbackType"] = "local_full"
            media["playbackQuality"] = "Official project-page trailer copy"
            media["playbackAspect"] = 1280 / 676
            project["fullFilms"] = [
                {
                    "src": JLMSY_TRAILER_URL,
                    "poster": media.get("poster"),
                    "aspect": 1280 / 676,
                    "duration": 158.036667,
                    "systemDataId": None,
                    "provenance": "official_page_trailer_local_portfolio_copy",
                }
            ]

        project["homepageVisible"] = not (
            bool(project.get("isNewSquarespaceRoute"))
            or project["route"] in RECENT_SQUARESPACE_ROUTES
        )

    payload["release"] = RELEASE
    payload["deployment"] = {
        "homepageRule": (
            "Keep newly added and newly built routes off the regular homepage; "
            "retain them on onepage and direct project routes."
        ),
        "hostedMediaBase": PAGES_BASE,
        "recentSquarespaceRoutesHiddenFromHomepage": sorted(RECENT_SQUARESPACE_ROUTES),
    }

    serialized = json.dumps(payload, ensure_ascii=False, separators=(",", ":"))
    if "/__combined/" in serialized:
        raise RuntimeError("Pilot 77 still contains local /__combined/ media URLs")
    SOURCE_DATA.write_text(DATA_PREFIX + serialized + ";\n", encoding="utf-8")
    return payload


if __name__ == "__main__":
    result = build()
    homepage = [p["route"] for p in result["projects"] if p["homepageVisible"]]
    onepage = [
        p["route"]
        for p in result["projects"]
        if p["route"] not in {"/maybelline-gigi-whip-it-up", "/maybelline-loaded-bolds"}
    ]
    missing = [
        p["route"] for p in result["projects"] if p.get("isNewSquarespaceRoute")
    ]
    print(
        json.dumps(
            {
                "release": result["release"],
                "projects": len(result["projects"]),
                "homepageProjects": len(homepage),
                "onepageProjects": len(onepage),
                "missingSquarespaceRoutes": missing,
                "output": str(SOURCE_DATA),
            },
            indent=2,
        )
    )
