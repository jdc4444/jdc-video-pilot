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

## Production verification

- GitHub Pages deployment `32810133443` completed successfully.
- The public pilot 17 asset matches the committed file byte-for-byte.
- Pilot 17 SHA-256: `ea956b2c1504e87e33a56312eb7aa644e2900c9d903214977b59b87d975a3513`
- Squarespace saved this exact production loader:

```html
<script src="https://jdc4444.github.io/jdc-video-pilot/jdc-footer-pilot17.js?v=6c973d7" crossorigin="anonymous" data-jdc-footer="pilot17"></script>
```

### Live browser verification

The tested path used a fresh homepage load and a real click on the homepage's `Netflix : Kings of Tupelo` link. The project then loaded pilot 17 and reported `adaptive-prefetch-pilot-17-hover-audio`.

| Step | Mode | Muted | Playing | Control |
| --- | --- | --- | --- | --- |
| Project autoplay after homepage click | `hover-ready` | yes | yes | Sound |
| First hover, no video click | `enabled` | no | yes | Mute |
| Leave video | `enabled` | yes | yes | Sound |
| Return to video | `enabled` | no | yes | Mute |
| Leave again | `enabled` | yes | yes | Sound |

The video remained ready and playing throughout the sequence.

Homepage regression check: the visible homepage video loaded ready and autoplayed muted under pilot 17.

Siberia Hills regression check at a 1280 x 720 desktop viewport: the portrait lead remained capped at 319 x 567, loaded ready, and autoplayed muted.
