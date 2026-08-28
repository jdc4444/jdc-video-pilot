# Squarespace code injection before layout65

Captured before publishing the sitewide legacy-copy and single-section layout fix on 2026-08-28.

Both Squarespace Code Injection fields (Header and Footer) used this exact loader:

```html
<script src="https://cdn.jsdelivr.net/gh/jdc4444/jdc-video-pilot@808a8601f8f49722a18479207e1b06ae9ac95233/jdc-footer-pilot64.js" crossorigin="anonymous" data-jdc-footer="pilot64"></script>
```

Rollback: restore the loader above in both fields and save. The homepage and all Squarespace-authored page content remain unchanged by layout65.

Layout65 changes only the generated sitewide project treatment:

- hides Squarespace-authored project title, description, and temporary-credit blocks after the canonical title and credits exist;
- places the canonical composition between the lead video and remaining media on single-section Fluid Engine pages;
- leaves the existing clip-gallery, custom-gallery, homepage, and Case Studies structures intact.
