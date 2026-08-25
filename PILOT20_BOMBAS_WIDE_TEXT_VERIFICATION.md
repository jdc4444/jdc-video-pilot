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

Pending publication, Squarespace loader swap, and live verification.
