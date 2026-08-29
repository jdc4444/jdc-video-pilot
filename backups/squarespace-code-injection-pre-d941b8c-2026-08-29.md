# Squarespace Code Injection Rollback

Snapshot captured from the public site immediately before publishing the
gallery loop-presentation fix in commit
`d941b8cb176417d1d61c3492697e43715c011b6d` on 2026-08-29.

Restore this exact line in both **Header** and **Footer** on the Squarespace
Code Injection screen:

```html
<script src="https://cdn.jsdelivr.net/gh/jdc4444/jdc-video-pilot@092e0e6dd4395bb523cd0f9a3fe0d4af09abd67d/jdc-footer-pilot64.js" crossorigin="anonymous" data-jdc-footer="pilot64"></script>
```
