#!/usr/bin/env python3
"""Create one compact, progressive MP4 for every approved gallery clip.

The selection manifest supplies the authoritative source and cut-bounded timing.
This makes a 960-pixel muted H.264 derivative with the MP4 index at the front of
the file and regenerates the visible poster from frame zero of that delivered
MP4.
"""

from __future__ import annotations

import json
import subprocess
import sys
import tempfile
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
MEDIA_ROOT = ROOT / "media" / "user-selected-clip-galleries"
DEFAULT_VIDEO_FILTER = "scale=min(960\\,iw):-2:flags=lanczos"
VIDEO_FILTERS = {
    # The 4K Awakening master carries a centered 40:17 image inside a 16:9
    # frame. Express the crop from the input dimensions so the 3840x2160
    # master resolves to 3840x1632+0+264 before the gallery downscale.
    "wynn-awakening": "crop=iw:iw*17/40:0:(ih-iw*17/40)/2,scale=min(960\\,iw):-2:flags=lanczos",
}
CLIP_VIDEO_FILTERS = {
    # Aguita clip 06 contains thin baked-in black wedges at the bottom of two
    # shots.  On the 4096x1536 master, this 2.1% edge crop clears them while
    # preserving the delivered 8:3 gallery frame after scaling.
    ("ggm-aguita", 6): "crop=4012:1504:42:0,scale=min(960\\,iw):-2:flags=lanczos",
}


def run(command: list[str]) -> subprocess.CompletedProcess[str]:
    return subprocess.run(command, check=True, capture_output=True, text=True)


def probe(path: Path) -> dict:
    result = run([
        "ffprobe", "-v", "error", "-show_streams", "-show_format",
        "-of", "json", str(path),
    ])
    return json.loads(result.stdout)


def video_stream(data: dict) -> dict:
    videos = [stream for stream in data["streams"] if stream.get("codec_type") == "video"]
    if len(videos) != 1:
        raise RuntimeError(f"Expected one video stream, found {len(videos)}")
    return videos[0]


def export_mp4(source: Path, destination: Path, video_filter: str, start: float, duration: float) -> None:
    run([
        "ffmpeg", "-y", "-v", "error", "-ss", f"{start:.3f}", "-i", str(source),
        "-t", f"{duration:.3f}",
        "-map", "0:v:0", "-an",
        "-vf", video_filter,
        "-c:v", "libx264", "-preset", "slow", "-profile:v", "high", "-level", "4.1",
        "-crf", "22", "-maxrate", "2600k", "-bufsize", "5200k",
        "-pix_fmt", "yuv420p", "-g", "48", "-keyint_min", "48", "-sc_threshold", "0",
        "-movflags", "+faststart", str(destination),
    ])


def export_poster(video: Path, destination: Path) -> None:
    with tempfile.TemporaryDirectory(prefix="jdc-gallery-poster-") as temporary:
        png = Path(temporary) / "first-frame.png"
        run([
            "ffmpeg", "-y", "-v", "error", "-i", str(video),
            "-frames:v", "1", str(png),
        ])
        run(["cwebp", "-quiet", "-q", "86", str(png), "-o", str(destination)])


def has_faststart(path: Path) -> bool:
    prefix = path.read_bytes()[: min(path.stat().st_size, 4 * 1024 * 1024)]
    moov = prefix.find(b"moov")
    mdat = prefix.find(b"mdat")
    return moov >= 0 and mdat >= 0 and moov < mdat


def main() -> None:
    manifests = sorted(MEDIA_ROOT.glob("*/selection.json"))
    requested_slugs = set(sys.argv[1:])
    if requested_slugs:
        available_slugs = {path.parent.name for path in manifests}
        missing_slugs = requested_slugs - available_slugs
        if missing_slugs:
            raise RuntimeError(f"Unknown gallery slug(s): {', '.join(sorted(missing_slugs))}")
        manifests = [path for path in manifests if path.parent.name in requested_slugs]
    total_clips = sum(len(json.loads(path.read_text())["clips"]) for path in manifests)
    completed = 0
    total_bytes = 0
    total_seconds = 0.0

    for manifest_path in manifests:
        manifest = json.loads(manifest_path.read_text())
        project_video_filter = VIDEO_FILTERS.get(manifest["slug"], DEFAULT_VIDEO_FILTER)
        source = Path(manifest["source"])
        if not source.is_file():
            raise RuntimeError(f"Missing source master for {manifest['slug']}: {source}")
        for index, clip in enumerate(manifest["clips"], 1):
            video_filter = CLIP_VIDEO_FILTERS.get(
                (manifest["slug"], index), project_video_filter
            )
            clip_dir = manifest_path.parent / f"clip-{index:02d}"
            destination = clip_dir / "gallery.mp4"
            clip_dir.mkdir(parents=True, exist_ok=True)
            export_mp4(source, destination, video_filter, float(clip["start"]), float(clip["duration"]))
            export_poster(destination, manifest_path.parent / clip["poster"])

            data = probe(destination)
            stream = video_stream(data)
            if stream.get("codec_name") != "h264" or stream.get("pix_fmt") != "yuv420p":
                raise RuntimeError(f"Unexpected encoding in {destination}: {stream}")
            if [item for item in data["streams"] if item.get("codec_type") == "audio"]:
                raise RuntimeError(f"Unexpected audio in {destination}")
            duration = float(data["format"]["duration"])
            if abs(duration - float(clip["duration"])) > 0.35:
                raise RuntimeError(
                    f"Duration mismatch in {destination}: {duration:.3f} vs {float(clip['duration']):.3f}"
                )
            if int(stream["width"]) > 960 or not has_faststart(destination):
                raise RuntimeError(f"Invalid progressive delivery in {destination}")

            completed += 1
            total_bytes += destination.stat().st_size
            total_seconds += duration
            print(f"[{completed:03d}/{total_clips:03d}] {destination.relative_to(ROOT)}", flush=True)

    print(json.dumps({
        "projects": len(manifests),
        "clips": completed,
        "seconds": round(total_seconds, 3),
        "bytes": total_bytes,
        "averageMbps": round((total_bytes * 8) / max(total_seconds, 0.001) / 1_000_000, 3),
        "status": "validated",
    }, indent=2))


if __name__ == "__main__":
    main()
