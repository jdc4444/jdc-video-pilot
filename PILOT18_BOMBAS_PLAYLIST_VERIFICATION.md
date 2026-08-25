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

Pending publication, Squarespace loader swap, and live verification.
