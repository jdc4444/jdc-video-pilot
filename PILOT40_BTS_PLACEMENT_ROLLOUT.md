# Pilot 40 BTS placement rollout

Date: 2026-08-27

## Reversible production state

Production before this rollout used this single Squarespace footer loader:

```html
<script src="https://cdn.jsdelivr.net/gh/jdc4444/jdc-video-pilot@b704fcaceefd5819170e4d9a06c8f84087a52778/jdc-footer-pilot39.js" crossorigin="anonymous" data-jdc-footer="pilot39"></script>
```

Production now uses this single Squarespace footer loader:

```html
<script src="https://cdn.jsdelivr.net/gh/jdc4444/jdc-video-pilot@d76657fe91db4aadcfb9a2d1f344f1fab2d32ce5/jdc-footer-pilot40.js" crossorigin="anonymous" data-jdc-footer="pilot40"></script>
```

Rollback is one operation: replace the pilot40 footer line with the pilot39
line above and save Code Injection. The immutable pilot39 assets were not
changed or removed.

`pilot40` is an additive wrapper around immutable pilot39. Its new behavior is
limited to `/day-one` and `/bombas-dream-of-comfort`; every other route continues
to use the existing pilot39 behavior.

## Day One BTS placement

- The existing portrait BTS video is moved after all eight selected clip tiles,
  so it no longer interrupts the clip grid after tile three.
- The portrait video is centered at one clip-column width on desktop and fills
  the single gallery column on narrow screens.
- Its gallery row is synchronized to the video's intrinsic portrait height, so
  it cannot overlap neighboring rows.
- The original native video block is moved rather than replaced, preserving its
  playback, hover-audio, and control behavior.

## Bombas Dream of Comfort BTS placement

- The existing landscape BTS block is moved out of the narrow Fluid Engine
  column into a responsive full-width 16:9 section after the project credits.
- The obsolete empty host is hidden and the original section's fixed trailing
  whitespace is trimmed to a standard credits-to-gallery transition.
- The original native video block is moved rather than replaced, preserving its
  playback, audio, and controls.

## Verification evidence

- The pilot40 JavaScript passed syntax validation.
- The immutable pilot40 loader returned HTTP 200 from the CDN with JavaScript
  MIME type, cross-origin access, and year-long immutable caching.
- Local desktop QA showed Day One in the order `1–8, BTS`, with a 28-pixel gap
  after the last clip and a centered 378 × 671 portrait video.
- Local narrow QA at 390 pixels showed the same order, a 24-pixel gap, and a
  343 × 652 portrait video with no overlap.
- Local desktop QA showed Bombas' BTS as a 1172 × 660 frame in its own section;
  narrow QA showed a 343 × 193 frame.
- Uncached public source for both project pages contained the single pilot40
  Squarespace loader.
- Live Day One installed eight clips followed by BTS, played the BTS in place,
  and reported zero video errors.
- Live Bombas displayed the BTS in a full-width 16:9 frame after the credits,
  played it in place, and reported zero video errors.
- Live homepage regression QA reported four playing videos and zero video
  errors. Live Alignment retained its pilot39 gallery marker, all 18 slides,
  and zero image or video failures.
