# Pilot 19 Bombas gallery spacing verification

## Scope

- Change only the live `/bombas-spring` project.
- Preserve the pilot 18 lead playlist, autoplay, hover sound, and all 21 gallery clips.
- Remove the empty full-viewport remainder below the project credits.
- Place the first visible gallery video one standard project gap below the credit text.
- Preserve all other project pages.

## Rollback

The prior production loader remains available unchanged:

```html
<script src="https://jdc4444.github.io/jdc-video-pilot/jdc-footer-pilot18.js?v=ffbccbb" crossorigin="anonymous" data-jdc-footer="pilot18"></script>
```

Pilot 18 SHA-256: `605b44ca4acf089f545f4fc40239c827f011e9d9dd0a6c554b80e6c647e55b7d`

## Cause

Squarespace retained a viewport-height intro section after the lead video and project information had been repositioned. The gallery lived in the next section, so it inherited several hundred pixels of empty space even though its internal grid was correctly arranged.

## Local browser verification

- Desktop viewport: 1280 x 720.
- Desktop credit-to-gallery gap: 38.4 px, matching the existing adaptive project gap.
- Narrow viewport: 627 x 921.
- Narrow credit-to-gallery gap: 24.01 px, matching the 24 px mobile project gap.
- Bombas playlist count remained 21 and native looping remained disabled on the playlist lead.
- The gallery retained its original clips and grid order.
- Kings of Tupelo control check: no Bombas spacing marker, no playlist marker, normal looping enabled, and muted autoplay ready and playing.

Pending publication, Squarespace loader swap, and live verification.
