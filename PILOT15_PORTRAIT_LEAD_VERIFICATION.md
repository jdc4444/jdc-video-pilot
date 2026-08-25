# Pilot 15 portrait lead verification

## Scope

- Cap only the first project-page video when its real aspect ratio is portrait (`width / height < 0.8`).
- Apply the cap only at desktop widths in landscape orientation.
- Preserve full-width landscape leads, the existing project galleries, and mobile sizing.

## Rollback

The prior production loader remains available unchanged:

```html
<script src="https://jdc4444.github.io/jdc-video-pilot/jdc-footer-pilot14.js?v=7590c32" crossorigin="anonymous" data-jdc-footer="pilot14"></script>
```

Pilot 14 SHA-256: `69e8efb1f0be958ea8c6e740167177bbc2275633b499fcbd136bb81e0b68c162`

## Local browser verification

Desktop viewport: 1280 x 720.

| Check | Pilot 14 | Pilot 15 |
| --- | ---: | ---: |
| Siberia lead | 1260.8 x 2241.4 | 319.1 x 567.4 |
| Siberia lead aspect | 0.5625 | 0.5625 |
| Siberia first gallery clip | 379.4 x 674.5 | 379.4 x 674.5 |
| Bombas Spring landscape lead | 1260.8 x 709.2 | 1260.8 x 709.2 |

The Siberia lead remains centered and the project information begins 38px below the visible video. The cap is contained in a `(min-width: 768px) and (orientation: landscape)` media query, so portrait/mobile sizing retains the existing 100% width rule.

## Production verification

- GitHub Pages deployment `32806228658` completed successfully.
- Public pilot 15 SHA-256 matched the local tested file: `f0ec40d91ffbfe38c79f9e7c7608c112ed3445d243e023168bf98cbf5ec39d15`.
- Squarespace was saved with exactly one footer loader and the editor was fully reloaded to verify persistence:

```html
<script src="https://jdc4444.github.io/jdc-video-pilot/jdc-footer-pilot15.js?v=d10efcc" crossorigin="anonymous" data-jdc-footer="pilot15"></script>
```

- Public Siberia Hills at 1280 x 720 measured its lead at 319.1 x 567.4, centered, aspect ratio 0.5625, and playing.
- Public Siberia's first gallery clip remained 379.4 x 674.5 and playing in `progressive-gallery` mode.
- Public Bombas Spring remained a full-width 16:9 lead at 1260.8 x 709.2 and playing.
