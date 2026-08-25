# Pilot 16 hover audio verification

## Scope

- Preserve muted autoplay on first visit.
- Restore the original desktop behavior after one deliberate audio opt-in: entering a project video unmutes it at 50% volume and leaving remutes it.
- Let either the `Sound` control or a direct video click provide the opt-in gesture.
- Keep touch and coarse-pointer devices click-only.
- Preserve pilot 15 playback, sizing, progressive loading, and portrait-lead behavior.

## Rollback

The prior production loader remains available unchanged:

```html
<script src="https://jdc4444.github.io/jdc-video-pilot/jdc-footer-pilot15.js?v=d10efcc" crossorigin="anonymous" data-jdc-footer="pilot15"></script>
```

Pilot 15 SHA-256: `f0ec40d91ffbfe38c79f9e7c7608c112ed3445d243e023168bf98cbf5ec39d15`

## Local browser verification

Kings of Tupelo, desktop fine pointer:

| Step | Mode | Muted | Playing | Control |
| --- | --- | --- | --- | --- |
| Initial autoplay | `awaiting-gesture` | yes | yes | Sound |
| Enter before opt-in | `awaiting-gesture` | yes | yes | Sound |
| Click Sound | `enabled` | no | yes | Mute |
| Leave video | `enabled` | yes | yes | Sound |
| Return to video | `enabled` | no | yes | Mute |
| Leave again | `enabled` | yes | yes | Sound |

A direct click on the video also changed the mode to `enabled` and unmuted it. The video remained 16:9 and continued autoplaying in the normal loading mode. Hover handlers are gated by `(hover:hover) and (pointer:fine)`; other pointers retain click-only audio.

## Production verification

Pending GitHub Pages publication and Squarespace loader swap.
