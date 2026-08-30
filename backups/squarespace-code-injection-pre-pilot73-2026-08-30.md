# Squarespace Code Injection rollback before Pilot 73

Captured before publishing the all-visible gallery playback release on 2026-08-30.

Both Header and Footer Code Injection were pinned to Pilot 72:

```html
<script src="https://cdn.jsdelivr.net/gh/jdc4444/jdc-video-pilot@4beb9fa8e8ed7361692f7a8eaa841345af7b41b3/jdc-footer-pilot72.js" crossorigin="anonymous" data-jdc-footer="pilot72"></script>
```

To roll back, replace the Pilot 73 script in both Header and Footer with the snippet above and save.
