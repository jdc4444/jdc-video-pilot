# Squarespace rollback: before pilot49 credits preview

Captured from the public site on 2026-08-27 before connecting the sitewide,
query-gated credits preview.

The public delivery state was pilot48 release:

`b63402759f1baac6ef94fca1131ceb352f55f079`

To restore this exact state, replace the release URL in both Squarespace Code
Injection fields with:

`https://cdn.jsdelivr.net/gh/jdc4444/jdc-video-pilot@b63402759f1baac6ef94fca1131ceb352f55f079/jdc-footer-pilot48.js`

The header loader must use `data-jdc-header-loader="pilot48"`; the footer loader
must use `data-jdc-footer="pilot48"`. The rest of the header video gate remains
unchanged from the full copy in
`backups/squarespace-code-injection-pre-pilot48-2026-08-27.md`.

## Footer

```html
<script src="https://cdn.jsdelivr.net/gh/jdc4444/jdc-video-pilot@b63402759f1baac6ef94fca1131ceb352f55f079/jdc-footer-pilot48.js" crossorigin="anonymous" data-jdc-footer="pilot48"></script>
```
