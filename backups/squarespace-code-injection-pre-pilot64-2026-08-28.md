# Squarespace code injection backup — pre-pilot64

Captured read-only from the signed-in Squarespace Code Injection panel on 2026-08-28 before the sitewide Winner release.

## Header

```html
<script src="https://cdn.jsdelivr.net/gh/jdc4444/jdc-video-pilot@ddfa0d78dc5000736a601181a49d28d63b021e93/jdc-footer-pilot52.js" crossorigin="anonymous" data-jdc-footer="pilot52"></script>
```

## Footer

```html
<script src="https://cdn.jsdelivr.net/gh/jdc4444/jdc-video-pilot@ddfa0d78dc5000736a601181a49d28d63b021e93/jdc-footer-pilot52.js" crossorigin="anonymous" data-jdc-footer="pilot52"></script>
```

## Rollback

Restore the exact Header and Footer values above and save. The one-time guards make the duplicate placement harmless, matching the pre-release state.

## Released replacement

Both Header and Footer were changed to the following pinned loader after the GitHub Pages deployment completed successfully:

```html
<script src="https://cdn.jsdelivr.net/gh/jdc4444/jdc-video-pilot@f5745c79634d3d2e76c4e0cf8698357192f07b36/jdc-footer-pilot64.js" crossorigin="anonymous" data-jdc-footer="pilot64"></script>
```

Public verification confirmed that the old `ddfa0d78…/jdc-footer-pilot52.js` injection was absent and that the new Winner marker was active.
