# Squarespace rollback — single quote span

Captured before the 2026-08-28 single-quote layout release.

Previous loader in both Header and Footer:

```html
<script src="https://cdn.jsdelivr.net/gh/jdc4444/jdc-video-pilot@7997ba517c0d6e508383fbff8f1c7ab44ab63def/jdc-footer-pilot64.js" crossorigin="anonymous" data-jdc-footer="pilot64"></script>
```

New loader in both Header and Footer:

```html
<script src="https://cdn.jsdelivr.net/gh/jdc4444/jdc-video-pilot@808a8601f8f49722a18479207e1b06ae9ac95233/jdc-footer-pilot64.js" crossorigin="anonymous" data-jdc-footer="pilot64"></script>
```

To roll back, restore the previous loader in both Squarespace injection fields and save.
