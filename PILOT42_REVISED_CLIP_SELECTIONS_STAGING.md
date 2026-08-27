# Pilot 42 revised clip selections — release record

Date: 2026-08-27

## Status

This revision was approved for live publication on 2026-08-27 after local
desktop and mobile verification. The immutable Pilot 41 loader remains the
one-step Squarespace rollback target.

## Reversible baseline

The complete pre-change data and all 11 affected gallery directories are stored
in:

`backups/pre-draft-update-2026-08-27.tar.zst`

SHA-256:

`1d0b645c8993218826ca1b719b485051523513bd8fdcf9b02d8126509ba19dda`

The archive passed `zstd -t` before any media was replaced.

## Revised galleries

| Project | Clips |
| --- | ---: |
| Gabriel Garzón-Montano: Agüita | 10 |
| Awakening: The First Day | 12 |
| Amber Mark: Out of This World | 12 |
| Thom Yorke: Last I Heard | 14 |
| Bright Eyes: Mariana Trench | 12 |
| Celeste: Everyday | 8 |
| Armando Young: Prizefighter | 10 |
| Kelsey Lu / Boys Noize: Ride or Die | 10 |
| Mitski: A Pearl | 8 |
| Diamond Terrifier: Action Fortress | 10 |
| Armando Young: Belladonna | 14 |
| **Affected total** | **120** |

All 15 gallery projects now contain even clip totals, with 150 clips overall.

## Delivery validation

- 150 of 150 gallery MP4s passed H.264, yuv420p, no-audio, duration, maximum
  width, fast-start, and poster-dimension checks.
- Total delivered duration: 760.589 seconds.
- Total progressive MP4 size: 131,922,931 bytes.
- Average delivered bitrate: 1.388 Mbps.
- Every visible poster was regenerated from frame zero of its delivered MP4.
- Awakening retains the 40:17 crop without theatrical letterboxing.
- Diamond A2 and F5 were advanced within their selected shots so both open on
  visible imagery instead of black.

## Browser verification

All 11 affected project pages were loaded through the local Squarespace proxy.
Each installed exactly one gallery with its expected even count. All 120
posters loaded; all 120 local MP4s reached ready and playing state while their
gallery was in view; no media errors were reported.

## Layout and aspect verification

- All 39 current project URLs passed the desktop spacing audit.
- All 20 multi-section project pages passed the 390px mobile spacing audit.
- Desktop inter-section spacing resolves to the shared 3vw rhythm (38.4px at
  the 1280px verification width); mobile resolves to 24px.
- Agüita ignores the incorrect 4:3 Squarespace metadata and uses the decoded
  2880x1080 (8:3) video aspect without letterboxing.
