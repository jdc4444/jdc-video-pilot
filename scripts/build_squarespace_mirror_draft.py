#!/usr/bin/env python3
"""Build the reversible Squarespace mirror preview from the combined master."""

from __future__ import annotations

import json
import re
import subprocess
import urllib.error
import urllib.request
from copy import deepcopy
from pathlib import Path
from urllib.parse import urlsplit

from bs4 import BeautifulSoup

from combined_project_data import load_combined_projects


ROOT = Path(__file__).resolve().parents[1]
FIN_HTML = Path("/Users/alphaone/Documents/Code/fin_v1/output/html")
GALLERIES = FIN_HTML / "media" / "project-galleries"
ORIGIN = "https://www.josdiazcontreras.com"
ARCHIVE = ROOT / "exports" / "squarespace-mirror-2026-08-31"
MANIFESTS = ARCHIVE / "manifests"
DATA_JS = ROOT / "jdc-squarespace-mirror-data-draft1.js"
MIRROR_MANIFEST = MANIFESTS / "mirror-draft1.json"
NATIVE_MANIFEST = MANIFESTS / "current-native-videos.json"
MIRROR_POSTERS = GALLERIES / "squarespace-mirror-posters"


# The combined file keeps archival placeholders for projects that did not yet
# have public routes.  The Squarespace draft needs durable, visitor-facing URLs.
PUBLIC_ROUTE_BY_COMBINED_ROUTE = {
    "/working-project-38": "/new-york-lottery-loteria",
    "/working-project-47": "/gabriel-garzon-montano-my-balloon",
    "/working-project-45": "/maybelline-gigi-glow-talk",
    "/working-project-44": "/maybelline-superstay",
    "/working-project-37": "/instagram-yours-to-make",
    "/working-project-40": "/aishti-aizone",
    "/working-project-41": "/the-happy-film",
    "/working-project-42": "/sticky-fingers",
    "/working-project-43": "/staycation",
    "/working-project-49": "/ella",
    "/working-project-48": "/just-let-me-show-you",
}


# Preserve the visitor-facing project name already approved on the homepage.
TITLE_BY_ROUTE = {
    "/siberia-hills": "Siberia Hills — Lookbook",
}


# Routes where only the first native Squarespace film remains the project-page
# lead.  The reviewed secondary media is deliberately moved below the project
# information instead of being stacked as additional above-the-fold films.
LEAD_ONLY_NATIVE_VIDEO_ROUTES = {
    "/lovb-adidas",
    "/bombas-dream-of-comfort",
    "/nike-aja-sabrina",
    "/bombas-spring",
    "/polymarket-documentary",
    "/siberia-hills",
    "/alignment-documentary",
    "/spotify-hip-hop-classics-1",
    "/ggm-accoustic",
    "/basis",
}


# These project pages keep the first native film as the key and present the
# remaining native films as complete, controllable mains below the project
# information. Onepage deliberately keeps its compact gallery treatment.
ADDITIONAL_MAIN_NATIVE_VIDEO_INDEXES_BY_ROUTE = {
    "/spotify-hip-hop-classics-1": (1, 2),
    "/ggm-accoustic": (1, 2),
    "/nike-aja-sabrina": (1, 2, 3),
}


# These native films remain full-width, but appear after the title/credits.
# Indexes are zero-based positions in the current Squarespace page.
BELOW_FOLD_NATIVE_VIDEO_INDEXES_BY_ROUTE = {
    "/bombas-dream-of-comfort": (1,),
    "/polymarket-documentary": (1,),
    # Alignment intentionally repeats the key below the project information,
    # followed by Yann and the local Andrew interview film.
    "/alignment-documentary": (0, 1),
    **ADDITIONAL_MAIN_NATIVE_VIDEO_INDEXES_BY_ROUTE,
}


# Preserve the complete reviewed combined gallery even when its first clip is
# also the native lead.  This matches the approved combined layouts and the
# existing Squarespace portrait-grid treatment.
PRESERVE_COMPLETE_COMBINED_GALLERY_ROUTES = {
    "/bombas-dream-of-comfort",
    "/basis",
}


GALLERY_COLUMNS_BY_ROUTE = {
    "/lovb-adidas": 4,
    "/siberia-hills": 4,
    "/aishti-aizone": 4,
}


ONEPAGE_GALLERY_COLUMNS_BY_ROUTE = {
    "/nike-aja-sabrina": 2,
}


# These projects use the reviewed combined-site preview above their content on
# /onepage, while their longer native films remain part of the below-fold
# gallery in the same order as the combined master.
ONEPAGE_MIXED_GALLERY_ROUTES = {
    "/alignment-documentary",
    "/spotify-hip-hop-classics-1",
}


# The first reviewed Nike film is also its regular project-page lead. Keep it
# out of the regular small gallery, but restore the complete four-film set on
# /onepage as the approved two-by-two gallery.
ONEPAGE_COMPLETE_COMBINED_GALLERY_ROUTES = {
    "/nike-aja-sabrina",
    "/ggm-accoustic",
    "/bombas-spring",
    "/siberia-hills",
}


# Bombas Spring and Siberia use purpose-built site edits as their temporary
# key films. Their existing campaign/lookbook videos are complete mains on the
# project pages, while Onepage preserves the reviewed compact grid.
PREVIEW_AS_KEY_ROUTES = {
    "/bombas-spring",
    "/siberia-hills",
}


GALLERY_AS_MAIN_ROUTES = {
    "/bombas-spring",
    "/siberia-hills",
}


ALIGNMENT_ANDREW_SOURCE_TOKEN = "andrew-intelligence-across-nature"


# The live Squarespace page for Make Your Own Market begins with short visual
# clips.  Its combined record carries the approved hosted full film that the
# homepage/onepage preview must open instead.
COMBINED_PLAYBACK_LEAD_ROUTES = {
    "/polymarket-make-your-own-market",
}


# These projects remain available in the reversible combined data archive but
# are intentionally absent from the Squarespace collection draft.
EXCLUDED_MIRROR_ROUTES = {
    "/tobias-rees-limn",
    "/working-project-37",
}


def public_route(route: str) -> str:
    return PUBLIC_ROUTE_BY_COMBINED_ROUTE.get(route, route)


def local_media_path(value: object) -> str | None:
    if not value:
        return None
    raw = str(value)
    parsed = urlsplit(raw)
    if parsed.scheme or raw.startswith("//"):
        return raw
    return "/__combined/" + parsed.path.lstrip("/")


def request_page(route: str) -> tuple[int, str]:
    request = urllib.request.Request(
        ORIGIN + route,
        headers={"User-Agent": "Mozilla/5.0", "Cache-Control": "no-cache"},
    )
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            return int(response.status), response.read().decode("utf-8", "replace")
    except urllib.error.HTTPError as error:
        return int(error.code), error.read().decode("utf-8", "replace")
    except Exception:
        return 0, ""


def native_video_configs(route: str) -> dict[str, object]:
    status, html = request_page(route)
    soup = BeautifulSoup(html, "html.parser") if html else None
    configs: list[dict[str, object]] = []
    if soup:
        for element in soup.select("[data-config-video]"):
            try:
                config = json.loads(str(element.get("data-config-video", "")))
            except (TypeError, ValueError, json.JSONDecodeError):
                continue
            system_id = str(config.get("systemDataId", "")).strip()
            if not system_id:
                continue
            configs.append(
                {
                    "systemDataId": system_id,
                    "duration": config.get("durationSeconds"),
                    "aspect": config.get("aspectRatio"),
                    "variants": config.get("systemDataVariants"),
                    "alexandriaUrl": config.get("alexandriaUrl"),
                }
            )
    title = soup.title.get_text(" ", strip=True) if soup and soup.title else ""
    exists = status == 200 and bool(configs or "sqs-page" in html or "collection-type-page" in html)
    return {"route": route, "status": status, "exists": exists, "title": title, "videos": configs}


def first_existing(paths: list[Path]) -> Path | None:
    return next((path for path in paths if path.is_file()), None)


def cached_native_media(system_id: str, *, lead: bool) -> tuple[str, str | None, str]:
    video_candidates: list[Path] = []
    poster_candidates: list[Path] = []
    if system_id == "477191e0-7531-4b97-862c-56c1b0f8710a":
        video_candidates.append(GALLERIES / "website-videos" / f"{system_id}-jdc-revised.mp4")
        poster_candidates.append(GALLERIES / "website-videos" / f"{system_id}-jdc-revised-poster.webp")
    if lead:
        video_candidates.append(GALLERIES / "website-leads" / f"{system_id}.mp4")
        poster_candidates.append(GALLERIES / "website-leads" / f"{system_id}-poster.webp")
    video_candidates.extend(
        [
            GALLERIES / "website-videos" / f"{system_id}-high.mp4",
            GALLERIES / "website-videos" / f"{system_id}.mp4",
        ]
    )
    poster_candidates.extend(
        [
            GALLERIES / "website-videos" / f"{system_id}-high-poster.webp",
            GALLERIES / "website-videos" / f"{system_id}-poster.webp",
        ]
    )
    video = first_existing(video_candidates)
    poster = first_existing(poster_candidates)
    if video:
        relative = video.relative_to(FIN_HTML).as_posix()
        poster_url = (
            "/__combined/" + poster.relative_to(FIN_HTML).as_posix()
            if poster
            else None
        )
        return "/__combined/" + relative, poster_url, "local_cached_high"
    remote = (
        "https://video.squarespace-cdn.com/content/v1/"
        "559d52abe4b0cebfa4f0b439/"
        f"{system_id}/playlist.m3u8"
    )
    return remote, None, "existing_squarespace_hls"


def generated_poster(src: str, system_id: str) -> str | None:
    if not src.startswith("/__combined/"):
        return None
    source = FIN_HTML / src.removeprefix("/__combined/")
    if not source.is_file():
        return None
    MIRROR_POSTERS.mkdir(parents=True, exist_ok=True)
    output = MIRROR_POSTERS / f"{system_id}.jpg"
    if not output.is_file() or output.stat().st_mtime_ns < source.stat().st_mtime_ns:
        subprocess.run(
            [
                "ffmpeg",
                "-y",
                "-hide_banner",
                "-loglevel",
                "error",
                "-ss",
                "1",
                "-i",
                str(source),
                "-frames:v",
                "1",
                "-vf",
                "scale='min(1920,iw)':-2",
                "-q:v",
                "2",
                str(output),
            ],
            check=True,
        )
    return "/__combined/" + output.relative_to(FIN_HTML).as_posix()


def clean_gallery_item(item: dict[str, object]) -> dict[str, object]:
    result = {
        key: deepcopy(value)
        for key, value in item.items()
        if key
        in {
            "type",
            "source",
            "systemDataId",
            "src",
            "poster",
            "aspect",
            "duration",
            "label",
            "selection",
            "hasAudio",
        }
    }
    result["src"] = local_media_path(result.get("src"))
    if result.get("poster"):
        result["poster"] = local_media_path(result.get("poster"))
    return result


def build() -> dict[str, object]:
    MANIFESTS.mkdir(parents=True, exist_ok=True)
    combined = [
        project
        for project in load_combined_projects()
        if str(project["route"]) not in EXCLUDED_MIRROR_ROUTES
    ]
    native_by_route: dict[str, dict[str, object]] = {}
    for route in dict.fromkeys(public_route(str(project["route"])) for project in combined):
        native_by_route[route] = native_video_configs(route)

    projects: list[dict[str, object]] = []
    for index, source in enumerate(combined):
        combined_route = str(source["route"])
        route = public_route(combined_route)
        gallery_items = [
            clean_gallery_item(dict(item))
            for item in dict(source.get("gallery") or {}).get("items", [])
        ]
        selected_ids = {
            str(item.get("systemDataId"))
            for item in gallery_items
            if item.get("systemDataId")
        }
        gallery_poster_by_id = {
            str(item["systemDataId"]): str(item["poster"])
            for item in gallery_items
            if item.get("systemDataId") and item.get("poster")
        }
        media = deepcopy(dict(source.get("media") or {}))
        media["src"] = local_media_path(media.get("src"))
        media["poster"] = local_media_path(media.get("poster"))
        if media.get("playbackSrc"):
            media["playbackSrc"] = local_media_path(media.get("playbackSrc"))
        native_record = native_by_route[route]
        native_videos = list(native_record.get("videos") or [])
        promoted_ids: list[str] = []
        for native_index, config in enumerate(native_videos):
            system_id = str(config["systemDataId"])
            if route in LEAD_ONLY_NATIVE_VIDEO_ROUTES:
                promote = native_index == 0
            else:
                promote = native_index == 0 or system_id in selected_ids
            if promote:
                promoted_ids.append(system_id)

        full_films: list[dict[str, object]] = []
        for native_index, config in enumerate(native_videos):
            system_id = str(config["systemDataId"])
            if route in LEAD_ONLY_NATIVE_VIDEO_ROUTES:
                include_film = native_index == 0
            else:
                include_film = system_id in promoted_ids
            if not include_film:
                continue
            src, poster, provenance = cached_native_media(system_id, lead=native_index == 0)
            if not poster:
                poster = gallery_poster_by_id.get(system_id)
            if not poster and native_index == 0:
                poster = media.get("poster")
            if not poster:
                poster = generated_poster(src, system_id)
            full_films.append(
                {
                    "src": src,
                    "poster": poster,
                    "aspect": config.get("aspect") or 16 / 9,
                    "duration": config.get("duration"),
                    "systemDataId": system_id,
                    "provenance": provenance,
                }
            )

        if not full_films and media.get("playbackSrc"):
            full_films.append(
                {
                    "src": media["playbackSrc"],
                    "poster": media.get("poster"),
                    "aspect": media.get("playbackAspect") or media.get("aspect") or 16 / 9,
                    "duration": None,
                    "systemDataId": None,
                    "provenance": media.get("playbackQuality") or "combined_hosted_master",
                }
            )

        if route in COMBINED_PLAYBACK_LEAD_ROUTES and media.get("playbackSrc"):
            full_films = [
                {
                    "src": media["playbackSrc"],
                    "poster": media.get("poster"),
                    "aspect": media.get("playbackAspect") or media.get("aspect") or 16 / 9,
                    "duration": None,
                    "systemDataId": None,
                    "provenance": media.get("playbackQuality") or "combined_hosted_master",
                }
            ]

        if route in PREVIEW_AS_KEY_ROUTES and media.get("src"):
            full_films = [
                {
                    "src": media["src"],
                    "poster": media.get("poster"),
                    "aspect": media.get("aspect") or 16 / 9,
                    "duration": None,
                    "systemDataId": None,
                    "provenance": "project_preview_key",
                    "role": "key",
                    "preferSource": True,
                }
            ]

        below_fold_films: list[dict[str, object]] = []
        for native_index in BELOW_FOLD_NATIVE_VIDEO_INDEXES_BY_ROUTE.get(route, ()):
            if native_index >= len(native_videos):
                continue
            config = native_videos[native_index]
            system_id = str(config["systemDataId"])
            src, poster, provenance = cached_native_media(system_id, lead=False)
            if not poster:
                poster = gallery_poster_by_id.get(system_id)
            if not poster:
                poster = generated_poster(src, system_id)
            below_fold_films.append(
                {
                    "src": src,
                    "poster": poster,
                    "aspect": config.get("aspect") or 16 / 9,
                    "duration": config.get("duration"),
                    "systemDataId": system_id,
                    "provenance": provenance,
                    "role": "main",
                    "preferSource": system_id
                    == "477191e0-7531-4b97-862c-56c1b0f8710a",
                }
            )

        if route == "/alignment-documentary":
            andrew = next(
                (
                    item
                    for item in gallery_items
                    if ALIGNMENT_ANDREW_SOURCE_TOKEN in str(item.get("src") or "")
                ),
                None,
            )
            if andrew:
                andrew_main = deepcopy(andrew)
                andrew_main.pop("type", None)
                andrew_main["role"] = "main"
                andrew_main["preferSource"] = True
                below_fold_films.append(andrew_main)

        excluded_gallery_ids = {
            str(film["systemDataId"])
            for film in full_films + below_fold_films
            if film.get("systemDataId")
        }
        if route in PRESERVE_COMPLETE_COMBINED_GALLERY_ROUTES:
            small_gallery = gallery_items
        else:
            small_gallery = [
                item
                for item in gallery_items
                if not item.get("systemDataId")
                or str(item.get("systemDataId")) not in excluded_gallery_ids
            ]

        if route == "/alignment-documentary":
            small_gallery = [
                item
                for item in small_gallery
                if ALIGNMENT_ANDREW_SOURCE_TOKEN not in str(item.get("src") or "")
            ]

        if route in GALLERY_AS_MAIN_ROUTES:
            below_fold_films = [
                {
                    **deepcopy(item),
                    "role": "main",
                    "preferSource": True,
                }
                for item in gallery_items
                if item.get("type") == "video"
            ]
            for film in below_fold_films:
                film.pop("type", None)
            small_gallery = []

        onepage_gallery = small_gallery
        if route in ONEPAGE_MIXED_GALLERY_ROUTES or route in ONEPAGE_COMPLETE_COMBINED_GALLERY_ROUTES:
            # The combined master already carries the approved interleaving of
            # full films and short clips for these one-page galleries.
            onepage_gallery = gallery_items

        projects.append(
            {
                "index": index + 1,
                "route": route,
                "combinedRoute": combined_route,
                "title": TITLE_BY_ROUTE.get(route, source.get("title")),
                "projectType": source.get("projectType"),
                "date": source.get("date"),
                "dateLabel": source.get("dateLabel"),
                "description": source.get("description"),
                "credits": deepcopy(source.get("credits") or []),
                "fields": deepcopy(source.get("fields") or []),
                "quotes": deepcopy(source.get("quotes") or []),
                "media": media,
                "fullFilms": full_films,
                "belowFoldFilms": below_fold_films,
                "onepageBelowFoldFilms": (
                    []
                    if route
                    in (
                        ONEPAGE_MIXED_GALLERY_ROUTES
                        | ONEPAGE_COMPLETE_COMBINED_GALLERY_ROUTES
                    )
                    else below_fold_films
                ),
                "gallery": small_gallery,
                "onepageGallery": onepage_gallery,
                "galleryColumns": GALLERY_COLUMNS_BY_ROUTE.get(route),
                "onepageGalleryColumns": ONEPAGE_GALLERY_COLUMNS_BY_ROUTE.get(
                    route, GALLERY_COLUMNS_BY_ROUTE.get(route)
                ),
                "combinedGalleryCount": len(gallery_items),
                "promotedNativeIds": promoted_ids,
                "currentSquarespace": native_record,
                "isNewSquarespaceRoute": not bool(native_record.get("exists")),
            }
        )

    payload: dict[str, object] = {
        "release": "squarespace-mirror-draft3-approved-onepage-layout",
        "source": str(FIN_HTML / "JDC_Combined_Press_Recognition_Credits.html"),
        "projectCount": len(projects),
        "projects": projects,
        "routeMap": PUBLIC_ROUTE_BY_COMBINED_ROUTE,
        "layoutExceptions": {
            "bombasDream": "Keep the campaign film as the lead, move the BTS film below the credits, and retain all six reviewed clips as the gallery.",
            "philosophers": "Use the reviewed preview in the one-page collection and place both native films plus the four reviewed clips in the combined-site gallery order.",
            "multipleMains": "Spotify, Acoustic Sessions, and Nike A'ja keep compact Onepage galleries but render every native film as a main on their project pages.",
            "alignment": "Repeat the key above and below the project information, render Yann and Andrew as the other two mains, and keep only motion pieces in the project gallery.",
            "campaignMains": "Bombas Spring and Siberia use purpose-built site keys and render every selected campaign/lookbook video as a main on project pages.",
            "approvedOnepageAspects": "Use each combined preview's approved aspect on /onepage while preserving the regular homepage at 16:9.",
        },
    }
    NATIVE_MANIFEST.write_text(
        json.dumps({"origin": ORIGIN, "routes": native_by_route}, indent=2),
        encoding="utf-8",
    )
    MIRROR_MANIFEST.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    DATA_JS.write_text(
        "window.JDC_SQUARESPACE_MIRROR_DRAFT = "
        + json.dumps(payload, ensure_ascii=False, separators=(",", ":"))
        + ";\n",
        encoding="utf-8",
    )
    return payload


if __name__ == "__main__":
    result = build()
    new_routes = [
        project["route"]
        for project in result["projects"]
        if project["isNewSquarespaceRoute"]
    ]
    print(
        json.dumps(
            {
                "release": result["release"],
                "projects": result["projectCount"],
                "newRoutes": len(new_routes),
                "newRouteList": new_routes,
                "data": str(DATA_JS),
                "manifest": str(MIRROR_MANIFEST),
            },
            indent=2,
        )
    )
