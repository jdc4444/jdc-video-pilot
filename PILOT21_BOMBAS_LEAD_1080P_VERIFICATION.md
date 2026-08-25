# Pilot 21 Bombas lead 1080p verification

## Scope

- Keep the large Bombas Spring lead video on its highest available rendition at all times.
- Never expose the 640 x 360 quick-start rendition in the lead position.
- Retain the matching still until the 1920 x 1080 clip can play.
- Preload upcoming clips in the fixed 21-item order without flooding the connection.
- Leave the smaller gallery tiles and all other site pages on the existing adaptive policy.

## Rollback

Pilot 20 remains unchanged and can be restored with this loader:

```html
<script src="https://jdc4444.github.io/jdc-video-pilot/jdc-footer-pilot20.js?v=a8f88d3" crossorigin="anonymous" data-jdc-footer="pilot20"></script>
```

Pilot 20 SHA-256: `1d100501508f96b01913e1c3717136240a68513d1737f5932ec7bdca7d3c1ee8`

## Quality policy

- Read each Squarespace HLS master playlist and select the rendition with the largest pixel area.
- Reject a selected Bombas lead rendition if it is below 1280 pixels wide.
- Feed the player the selected media playlist directly, so adaptive playback cannot fall back to 640 x 360.
- Keep the poster visible while the high-resolution source is resolving and buffering.
- Retry the high-resolution source on failure rather than falling back to the low rendition.

## Ordered preloading

- Fast connection: warm the first high-resolution segment of the next two clips, sequentially.
- Standard or 3G connection: warm only the next high-resolution clip.
- Save-Data or reduced-motion mode: do not spend background bandwidth on upcoming clips.
- The current lead starts before any upcoming-clip preloading begins.

## Source audit

- All 21 playlist clips expose both 640 x 360 and 1920 x 1080 Squarespace renditions.
- All 21 highest-rendition checks resolved to 1920 x 1080.

## Local browser verification

- Fast policy: lead reported `bombas-1080p-locked`, played at 1920 x 1080, remained `loop=false`, and advanced through multiple playlist clips.
- Fast policy: two upcoming clip IDs were tracked and the sequential preloader reached `ready`.
- Simulated 3G policy: lead still played at 1920 x 1080 while only one upcoming clip was preloaded.
- The 21 gallery blocks and 21 playlist entries remained intact.
- Kings of Tupelo control: no Bombas-only policy was applied; its video remained muted, looping, ready, and playing.

Pending source publication, Squarespace loader swap, and live verification.
