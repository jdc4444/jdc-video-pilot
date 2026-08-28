# Squarespace rollback — combined press default / Behind the Scenes alternate

Captured before the 2026-08-28 project-look release.

## Previous live loader

Both Squarespace Header and Footer code injection used:

```html
<script src="https://cdn.jsdelivr.net/gh/jdc4444/jdc-video-pilot@186f9cffa6dba4bbaeb1a48e8d89ec720ea09246/jdc-footer-pilot64.js" crossorigin="anonymous" data-jdc-footer="pilot64"></script>
```

## New loader

Both Squarespace Header and Footer code injection should use:

```html
<script src="https://cdn.jsdelivr.net/gh/jdc4444/jdc-video-pilot@7997ba517c0d6e508383fbff8f1c7ab44ab63def/jdc-footer-pilot64.js" crossorigin="anonymous" data-jdc-footer="pilot64"></script>
```

The default project look combines press, media, and quotes. The saved alternate is enabled per page with `?jdc-project-look=behind-the-scenes`.

To roll back, restore the previous loader in both injection fields and save.
