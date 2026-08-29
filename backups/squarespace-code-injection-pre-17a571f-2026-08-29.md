# Squarespace Code Injection rollback before 17a571f

Captured before publishing the Acoustic Sessions title/link correction on 2026-08-29.

Both Header and Footer Code Injection were pinned to:

```html
<script src="https://cdn.jsdelivr.net/gh/jdc4444/jdc-video-pilot@d941b8cb176417d1d61c3492697e43715c011b6d/jdc-footer-pilot64.js" crossorigin="anonymous" data-jdc-footer="pilot64"></script>
```

To roll back, replace the `17a571fd826048801397584886b90d248a290c75` loader in both fields with the `d941b8cb176417d1d61c3492697e43715c011b6d` loader above and save.
