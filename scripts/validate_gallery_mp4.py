#!/usr/bin/env python3
"""Validate every progressive gallery MP4, poster, manifest, and clip count."""

from __future__ import annotations

import json
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
MEDIA_ROOT = ROOT / "media" / "user-selected-clip-galleries"


def probe(path: Path) -> dict:
    result = subprocess.run(
        ["ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", str(path)],
        check=True,
        capture_output=True,
        text=True,
    )
    return json.loads(result.stdout)


def video_stream(data: dict, path: Path) -> dict:
    streams = [stream for stream in data["streams"] if stream.get("codec_type") == "video"]
    if len(streams) != 1:
        raise RuntimeError(f"Expected one video stream in {path}, found {len(streams)}")
    return streams[0]


def has_faststart(path: Path) -> bool:
    prefix = path.read_bytes()[: min(path.stat().st_size, 4 * 1024 * 1024)]
    moov = prefix.find(b"moov")
    mdat = prefix.find(b"mdat")
    return moov >= 0 and mdat >= 0 and moov < mdat


def main() -> None:
    index = json.loads((MEDIA_ROOT / "index.json").read_text())
    manifests = sorted(MEDIA_ROOT.glob("*/selection.json"))
    total_clips = 0
    total_bytes = 0
    total_seconds = 0.0
    project_counts: dict[str, int] = {}

    for manifest_path in manifests:
        manifest = json.loads(manifest_path.read_text())
        slug = manifest["slug"]
        clips = manifest["clips"]
        project_counts[slug] = len(clips)
        indexed_count = int((index.get(slug) or {}).get("clipCount") or 0)
        if indexed_count != len(clips):
            raise RuntimeError(f"Index count mismatch for {slug}: {indexed_count} vs {len(clips)}")
        if len(clips) % 2:
            raise RuntimeError(f"Odd clip total for {slug}: {len(clips)}")

        for clip_index, clip in enumerate(clips, 1):
            clip_dir = manifest_path.parent / f"clip-{clip_index:02d}"
            video = clip_dir / "gallery.mp4"
            poster = manifest_path.parent / clip["poster"]
            if not video.is_file() or not poster.is_file():
                raise RuntimeError(f"Missing delivery asset for {slug} clip {clip_index:02d}")

            video_data = probe(video)
            stream = video_stream(video_data, video)
            audio = [item for item in video_data["streams"] if item.get("codec_type") == "audio"]
            if stream.get("codec_name") != "h264" or stream.get("pix_fmt") != "yuv420p" or audio:
                raise RuntimeError(f"Unexpected encoding in {video}")
            if int(stream["width"]) > 960 or not has_faststart(video):
                raise RuntimeError(f"Invalid progressive delivery in {video}")

            duration = float(video_data["format"]["duration"])
            if abs(duration - float(clip["duration"])) > 0.35:
                raise RuntimeError(f"Duration mismatch in {video}: {duration:.3f} vs {clip['duration']}")

            poster_stream = video_stream(probe(poster), poster)
            if (int(poster_stream["width"]), int(poster_stream["height"])) != (
                int(stream["width"]),
                int(stream["height"]),
            ):
                raise RuntimeError(f"Poster dimensions do not match {video}")

            total_clips += 1
            total_bytes += video.stat().st_size
            total_seconds += duration

    indexed_total = sum(int((item or {}).get("clipCount") or 0) for item in index.values())
    if indexed_total != total_clips:
        raise RuntimeError(f"Total index mismatch: {indexed_total} vs {total_clips}")

    print(json.dumps({
        "projects": len(manifests),
        "clips": total_clips,
        "seconds": round(total_seconds, 3),
        "bytes": total_bytes,
        "averageMbps": round((total_bytes * 8) / max(total_seconds, 0.001) / 1_000_000, 3),
        "projectCounts": project_counts,
        "status": "validated",
    }, indent=2, sort_keys=True))


if __name__ == "__main__":
    main()
