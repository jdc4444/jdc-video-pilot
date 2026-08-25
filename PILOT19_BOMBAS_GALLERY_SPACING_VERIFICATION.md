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

## Production publication

- GitHub Pages deployment `32812339453` completed successfully.
- Published pilot 19 matched the local file byte-for-byte at 87,805 bytes.
- Pilot 19 SHA-256: `c4f00472a57b2eebc6ed7d35cef2e6f25a1bf67dc553e52bd6fede742bd7a629`
- Squarespace was saved with exactly this loader and no pilot 18 loader:

```html
<script src="https://jdc4444.github.io/jdc-video-pilot/jdc-footer-pilot19.js?v=1449075" crossorigin="anonymous" data-jdc-footer="pilot19"></script>
```

## Live browser verification

- Clean production URL with no test query loaded only pilot 19.
- Narrow viewport 627 x 921: visible credit-to-gallery gap measured 24.01 px.
- Desktop viewport 1280 x 720: visible credit-to-gallery gap measured 38.4 px.
- Bombas retained all 21 gallery video blocks and all 21 playlist items.
- The playlist lead remained ready, playing, muted until hover permission, and configured for natural playlist advancement rather than native looping.
- Homepage control check: the visible video remained ready and autoplaying muted, with no Bombas spacing marker.
- Kings of Tupelo control check: no Bombas spacing or playlist marker, native looping enabled, and muted autoplay ready and playing.
