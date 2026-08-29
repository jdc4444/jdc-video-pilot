# Pilot 41 loop-flash staging

Date: 2026-08-29

## Scope

This revision fixes the shared selected-clip gallery player. It does not alter
clip timing, compression, posters, project layout, playback concurrency, or
native lead videos.

## Cause

Safari briefly emits `waiting` or `stalled` when a native looping MP4 seeks
back to frame zero. The previous gallery player immediately hid the video on
either event while the poster was still transitioning from transparent to
opaque. That exposed the tile's black background, then the poster, before the
video returned. The two symptoms were therefore one presentation bug:

- a black flash at the loop boundary;
- an occasional first-frame still flash between loops.

The MP4 audit found no encoded black frames in the MTV gallery files.

## Fix

- Keep a gallery video's decoded surface visible after it has painted its
  first frame, including during brief loop-boundary buffering events.
- Use the poster only for initial startup, deactivation, retry, or a genuine
  media error.
- Make poster restoration immediate when a scheduler slot is removed, while
  retaining the existing first-load poster fade-out.

## Verification

- MTV live baseline: repeated loop boundaries removed `data-jdc-clip-playing`
  for approximately one rendered frame while ready state reset.
- MTV local revision: eight seconds of repeated loops across six simultaneous
  clips produced zero playing-layer drops; brief ready-state resets stayed
  visually covered.
- Kelsey Lu / Boys Noize local revision: nine seconds across six simultaneous
  clips produced ten loop resets, three buffering events, and zero
  playing-layer drops.
- `node --check jdc-footer-pilot41.js` passes.

## Publication status

Published after explicit approval. Both Squarespace Code Injection fields are
pinned to commit `d941b8cb176417d1d61c3492697e43715c011b6d` through
`jdc-footer-pilot64.js`.

The public MTV page loaded `pilot41-loop74` with nine gallery clips. A
nine-second live trace covered 51 loop resets and 12 loop-boundary buffering
moments with zero playing-layer drops. A second live gallery produced eight
more loop resets with zero playing-layer drops. Safari also showed the complete
three-by-three MTV gallery without black or poster flashes.

Rollback restores the prior `092e0e6` loader in both fields; see
`backups/squarespace-code-injection-pre-d941b8c-2026-08-29.md`.
