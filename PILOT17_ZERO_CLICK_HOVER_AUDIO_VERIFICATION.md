# Pilot 17 zero-click hover audio verification

## Scope

- Keep muted autoplay on first load.
- On a desktop fine pointer, make the first deliberate entry into a project video attempt to unmute it at 50% volume without requiring a click.
- Mute on leave and unmute again on return.
- Preserve the Sound control as a fallback if a browser refuses audible playback without a click.
- Keep touch and coarse-pointer devices click-only.
- Preserve pilot 16 playback, loading, sizing, and project layout behavior.

## Rollback

The prior production loader remains available unchanged:

```html
<script src="https://jdc4444.github.io/jdc-video-pilot/jdc-footer-pilot16.js?v=3f8382f" crossorigin="anonymous" data-jdc-footer="pilot16"></script>
```

Pilot 16 SHA-256: `ddabaf14871f879caa5bb387be1061d4b17f1b749ed90be751451393549ae54a`

## Verification

### Local browser verification

Normal same-origin navigation into Kings of Tupelo:

| Step | Mode | Muted | Playing | Control |
| --- | --- | --- | --- | --- |
| Project autoplay after link click | `hover-ready` | yes | yes | Sound |
| First hover, no video click | `enabled` | no | yes | Mute |
| Leave video | `enabled` | yes | yes | Sound |
| Return to video | `enabled` | no | yes | Mute |
| Leave again | `enabled` | yes | yes | Sound |

The video remained ready and playing throughout the sequence.

Fresh direct-entry browser-policy check:

- The browser rejected audible playback on hover when the project URL was opened in a new session with no prior interaction on the origin.
- Pilot 17 recovered immediately to muted playback instead of pausing or leaving a broken panel.
- The mode changed to `gesture-required`, and clicking Sound enabled audio normally.

Pending publication, Squarespace loader swap, and live verification.
