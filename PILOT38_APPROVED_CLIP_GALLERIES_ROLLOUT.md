# Pilot 38 approved clip galleries rollout

Date: 2026-08-27

## Reversible production state

Production before this rollout used this one-line Squarespace footer loader:

```html
<script src="https://cdn.jsdelivr.net/gh/jdc4444/jdc-video-pilot@b3a2c442b6a2510f964d138b0ef73e29183abbac/jdc-footer-pilot36.js" crossorigin="anonymous" data-jdc-footer="pilot36"></script>
```

Production now uses this one-line Squarespace footer loader:

```html
<script src="https://cdn.jsdelivr.net/gh/jdc4444/jdc-video-pilot@9487368d8ba4f750dbafb075e2b4ae1844ddb95e/jdc-footer-pilot38.js" crossorigin="anonymous" data-jdc-footer="pilot38"></script>
```

Rollback is a single operation: replace the current footer line with the
`pilot36` line above and save Code Injection. The immutable `pilot36` assets
were not changed or removed.

`pilot38` is an additive wrapper around the immutable `pilot36` core. The
nested pilot36/pilot35/pilot34/pilot33 scripts visible at runtime are the
existing compatibility chain; uncached public page source contains only the
single pilot38 footer loader.

## Approved galleries

| Project page | Clips |
| --- | ---: |
| `/day-one` | 8 |
| `/ggm-aguita` | 6 |
| `/wynn-awakening` | 10 |
| `/amber-mark-out-of-this-world` | 8 |
| `/thom-yorke-last-i-heard` | 13 |
| `/bright-eyes-mariana-trench` | 11 |
| `/kings-of-tupelo` | 6 |
| `/celeste-everyday` | 6 |
| `/armando-young-prizefighyer` | 7 |
| `/kelsey-lu-boys-noize-ride-or-die` | 9 |
| `/mitski-a-pearl` | 6 |
| `/kombilesa-mi-los-peinados` | 8 |
| `/lovb-launch` | 8 |
| `/diamond-terrifier-action-fortress` | 7 |
| `/armando-young-belladonna` | 14 |
| **Total** | **127** |

Bombas Dream of Comfort, Polymarket Documentary, Black Twitter, and Alignment
Documentary were explicitly skipped and are absent from the public pilot38
data.

## Delivery behavior

- Every cell paints an exact first-frame WebP immediately.
- Every loop has a 640-pixel low stream and a 1280-pixel high stream in one
  adaptive HLS master playlist.
- Streams are muted, inline, and autoplay when selected by the viewport-aware
  loader.
- Desktop allows three nearby loops at once, smaller screens allow two, and
  Save Data/2G-class connections allow one.
- Day One's native portrait BTS video is preserved and relocated into a
  full-width gallery section after the first clip row.
- Existing homepage and project-video behavior remains in the pilot36 core.

## Verification evidence

- 15 projects, 127 loops, 649.826 seconds of selected material.
- 127 low playlists, 127 high playlists, 127 master playlists, and 127 posters.
- All streams validated as muted H.264/YUV420P with duration matching the
  approved range; master-playlist resolutions match each source aspect ratio.
- Every poster was regenerated from frame zero of its delivered high stream.
- 254 hosted URLs (all posters and all master playlists) returned successfully
  with cross-origin access enabled.
- Local browser sweep: all 15 pages installed, all 127 posters loaded, three
  nearby loops played per desktop page, and zero playback errors.
- Live browser sweep: all 15 pages installed with their exact counts, all 127
  posters loaded, and zero playback errors. Longer startup checks reached three
  simultaneous nearby loops.
- Live Day One was visually checked at 1280 pixels: 378-pixel clip cells, a
  centered 420 x 747 portrait BTS block, down-scroll playback, and up-scroll
  resumption.
- Live homepage retained its original behavior; at a panel boundary a 4K and
  a 1080p homepage video played simultaneously.

The local selection manifests, contact sheets, source paths, and review pages
were intentionally not committed or published.
