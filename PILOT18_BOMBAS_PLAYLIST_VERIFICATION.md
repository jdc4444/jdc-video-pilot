# Pilot 18 Bombas lead playlist verification

## Scope

- Change only `/bombas-spring`.
- Replace the silent 30-second hero source with a 21-clip playlist made from every audio-bearing clip in the Bombas grid.
- Use a curated sequence that starts from the grid's visual center and jumps between rows and columns instead of following grid order.
- Keep the lead frame at 16:9 while switching clips.
- Advance automatically at the natural end of every clip and wrap after clip 21.
- Carry hover-enabled sound across clip changes.
- Preserve the existing grid, progressive loading, layout, and every non-Bombas page.

## Rollback

The prior production loader remains available unchanged:

```html
<script src="https://jdc4444.github.io/jdc-video-pilot/jdc-footer-pilot17.js?v=6c973d7" crossorigin="anonymous" data-jdc-footer="pilot17"></script>
```

Pilot 17 SHA-256: `ea956b2c1504e87e33a56312eb7aa644e2900c9d903214977b59b87d975a3513`

## Playlist source audit

- Live Bombas page: 22 video blocks total.
- Existing lead: 30.03 seconds, 16:9, no audio codec.
- Playlist: all 21 grid clips; every selected clip reports AAC audio and 16:9 video.

## Verification

### Local browser verification

- Playlist marker appeared only on the Bombas lead.
- Playlist count: 21; unique clip IDs: 21; every ID matched an existing grid clip.
- The playlist order differed from visual grid order.
- The lead remained 16:9 at 1261 x 709 before hover and 1280 x 720 during hover.
- The lead video had native looping disabled and advanced from playlist item 1 to item 2 exactly once at the natural clip ending.
- Later natural transitions advanced from item 3 to item 4 while remaining ready and playing.
- Hover enabled sound at 50% volume, and the next clip remained unmuted after the transition.
- Leaving muted the current clip; returning restored sound; leaving again muted it.
- All 22 original Bombas blocks remained in the DOM, so the 21-item grid was unchanged.
- Kings of Tupelo control check: no playlist marker, normal looping remained enabled, and muted autoplay remained ready and playing.

### Production publication

- GitHub Pages deployment `32811524480` completed successfully.
- Published pilot 18 matched the local file byte-for-byte.
- Pilot 18 SHA-256: `605b44ca4acf089f545f4fc40239c827f011e9d9dd0a6c554b80e6c647e55b7d`
- Squarespace was saved with this exact loader:

```html
<script src="https://jdc4444.github.io/jdc-video-pilot/jdc-footer-pilot18.js?v=ffbccbb" crossorigin="anonymous" data-jdc-footer="pilot18"></script>
```

### Live browser verification

- Entered the live Bombas page through its normal homepage link, rather than a test-only URL.
- The live lead reported 21 playlist items, native looping disabled, and all 22 original video blocks still present.
- Observed natural item 1 to 2 and item 2 to 3 transitions while the lead remained ready and playing.
- Hover enabled sound without clicking the video, and sound remained enabled across the next natural clip transition.
- Moving away muted the playing lead again.
- The live lead stayed at a stable 16:9 frame of approximately 1261 x 709.
- The homepage still loaded pilot 18 with its visible video ready and autoplaying muted.
- Live Kings of Tupelo control check: no playlist marker, native looping remained enabled, and muted autoplay was ready and playing.

Fresh direct visits can still require the browser's one-time **Sound** permission before hover audio is allowed. Normal same-origin navigation from the homepage passed the zero-click hover-sound test.
