# Squarespace code-injection rollback — before Pilot 77

Captured immediately before the Pilot 77 onepage/project release on 2026-09-01.

## Header

```html
<script src="https://cdn.jsdelivr.net/gh/jdc4444/jdc-video-pilot@0777b807be2e5d4f056e46d81ef28b615f764910/jdc-footer-pilot74.js" crossorigin="anonymous" data-jdc-footer="pilot74"></script>
```

## Footer

```html
<script src="https://cdn.jsdelivr.net/gh/jdc4444/jdc-video-pilot@c5ecb68146f3da304d0aba6fe0bda9d2ab815577/jdc-footer-pilot76.js" crossorigin="anonymous" data-jdc-footer="pilot76"></script>
```

Restoring these two fields returns the public site to the exact pre-Pilot-77
code-injection state. The Not Linked route shells created for Pilot 77 can stay
in place because they contain no portfolio content without the Pilot 77 loader.
