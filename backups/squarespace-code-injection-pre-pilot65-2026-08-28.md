# Squarespace code injection rollback — pre-pilot65

Captured immediately before publishing the native-title suppression / Winner restoration on 2026-08-28.

## Previous live HEADER and FOOTER value

```html
<script src="https://cdn.jsdelivr.net/gh/jdc4444/jdc-video-pilot@f5745c79634d3d2e76c4e0cf8698357192f07b36/jdc-footer-pilot64.js" crossorigin="anonymous" data-jdc-footer="pilot64"></script>
```

The same single tag was present in both Squarespace Code Injection fields.

## New live HEADER and FOOTER value

```html
<script src="https://cdn.jsdelivr.net/gh/jdc4444/jdc-video-pilot@5b5ce37941d40a060c365b1dbe7f6915abab2a5f/jdc-footer-pilot64.js" crossorigin="anonymous" data-jdc-footer="pilot64"></script>
```

To roll back, restore the previous value in both HEADER and FOOTER and save.
