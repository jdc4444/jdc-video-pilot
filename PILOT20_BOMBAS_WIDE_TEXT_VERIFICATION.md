# Pilot 20 Bombas wide-screen text verification

## Scope

- Fix the cropped Bombas project title at wide viewport sizes.
- Preserve the pilot 19 compact credit-to-gallery spacing.
- Preserve the 21-item Bombas lead playlist, gallery contents, autoplay, and hover sound.
- Preserve all other project pages.

## Rollback

The prior production loader remains available unchanged:

```html
<script src="https://jdc4444.github.io/jdc-video-pilot/jdc-footer-pilot19.js?v=1449075" crossorigin="anonymous" data-jdc-footer="pilot19"></script>
```

Pilot 19 SHA-256: `c4f00472a57b2eebc6ed7d35cef2e6f25a1bf67dc553e52bd6fede742bd7a629`

## Cause

Pilot 19 pulled the entire gallery section upward until its first video reached the desired gap. At wide sizes, Squarespace adds an internal top inset to that section, so the section itself overlapped the title and its white background masked the upper portion of the headline.

## Correction

- Place the gallery section boundary after the text at the standard responsive gap.
- Shift all gallery grid blocks upward together by Squarespace's internal inset.
- Keep the section background out of the title area while retaining the compact first-row position.

## Local browser verification

- Wide viewport 1280 x 720: section-to-text separation 38.40 px, with no overlap.
- Wide viewport 1280 x 720: visible credit-to-first-gallery-video gap 38.40 px.
- Intermediate viewport 1179 x 921: section-to-text separation 35.38 px, with no overlap.
- Intermediate viewport 1179 x 921: visible credit-to-first-gallery-video gap 35.37 px.
- Full Bombas headline was visible in the wide-screen screenshot.
- Bombas playlist count remained 21; the lead remained ready, playing, and configured for natural playlist advancement.
- Kings of Tupelo control check: no Bombas spacing or playlist marker, native looping enabled, and muted autoplay ready and playing.

## Publication

- Source commit: `a8f88d3` (`Prevent Bombas gallery from cropping title`).
- GitHub Pages deployment: `32813473992`, completed successfully.
- Published file: 89,241 bytes, SHA-256 `1d100501508f96b01913e1c3717136240a68513d1737f5932ec7bdca7d3c1ee8`.
- Squarespace footer loader:

```html
<script src="https://jdc4444.github.io/jdc-video-pilot/jdc-footer-pilot20.js?v=a8f88d3" crossorigin="anonymous" data-jdc-footer="pilot20"></script>
```

## Live verification

- Clean public Bombas load at 1280 x 720 loaded only the pilot 20 footer and reported version `adaptive-prefetch-pilot-20-bombas-wide-text`.
- The complete `Bombas : Spring Campaign` headline and both credit lines were visible at the wide breakpoint; the gallery background no longer crossed or masked the text.
- Live spacing telemetry reported the 38.40 px responsive gap and `-38.4` overlap, meaning 38.40 px of separation rather than overlap.
- All 21 gallery blocks and all 21 lead-playlist entries remained mapped. The lead was playing, ready state 4, and `loop=false` so the playlist continues to advance.
- Gallery videos in view progressively instantiated and played while the remaining grid retained its still-image coverage.
- Homepage control: pilot 20 loaded, the visible hero was muted, looping, ready state 4, and playing; no Bombas-only attributes were present.
- Kings of Tupelo control: pilot 20 loaded, the visible hero was muted, looping, ready state 4, and playing; no Bombas-only attributes or playlist were present.
- Pilot 19 remains available unchanged for immediate rollback.
