# Pilot 41 Awakening native-frame rollout

Date: 2026-08-27

## Outcome

The ten selected clips on `/wynn-awakening` now display the film's native
`40:17` frame without the baked 16:9 black matte. No other project media or
layout was changed.

Live immutable loader:

```html
<script src="https://cdn.jsdelivr.net/gh/jdc4444/jdc-video-pilot@6bf8de607cb788460372d738c4c6a56a4be220c1/jdc-footer-pilot41.js" crossorigin="anonymous" data-jdc-footer="pilot41"></script>
```

## Media change

- Source: each clip's existing authoritative selected `high.m3u8` edit
- Source raster: 1280x720 with an 88 px black matte at top and bottom
- Native image after crop: 1280x544 (`40:17`)
- Web delivery: 960x408 H.264 High Profile, yuv420p, no audio, fast-start MP4
- Posters: regenerated from frame zero of each exact delivered MP4 at 960x408
- Total delivered video: 6,835,030 bytes across 45.837 seconds
- Average delivered bitrate: 1.193 Mbps

The exporter records the Awakening-specific crop while retaining the existing
default export treatment for every other gallery.

## Verification

- All ten MP4s passed codec, pixel format, dimensions, duration, no-audio, and
  `moov`-before-`mdat` checks.
- All ten posters passed 960x408 dimension checks and were visually reviewed
  together.
- Local and immutable-CDN previews each rendered one ten-item gallery at
  `40:17`, with no empty panels or gallery errors.
- The live page loaded all ten files at 960x408; six visible clips autoplayed
  simultaneously and the browser reported no errors.
- The live homepage retained four playing videos and zero video or browser
  errors after the loader update.

## Exact rollback

Replace the Squarespace Footer injection with this one line and save:

```html
<script src="https://cdn.jsdelivr.net/gh/jdc4444/jdc-video-pilot@22ec9ee6ec4cb19f860011c382725be1e75da41c/jdc-footer-pilot41.js" crossorigin="anonymous" data-jdc-footer="pilot41"></script>
```

That restores the prior 960x540 letterboxed Awakening exports and 16:9 gallery
panels without changing any Squarespace page content.
