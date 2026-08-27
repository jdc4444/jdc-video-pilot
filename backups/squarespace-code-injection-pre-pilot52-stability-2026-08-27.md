# Squarespace code injection backup before pilot52

Captured from the live site on 2026-08-27 before the Aguita, Bombas Spring, and LOVB credits stability update.

Both the header and footer injection slots reference the same immutable pilot51 loader:

```html
<script src="https://cdn.jsdelivr.net/gh/jdc4444/jdc-video-pilot@f77d202ceaae70cf2484fbb88d485ef5db6ae90c/jdc-footer-pilot51.js" crossorigin="anonymous" data-jdc-footer="pilot51"></script>
```

Rollback commit: `f77d202ceaae70cf2484fbb88d485ef5db6ae90c`
