# Pilot 107 About release

Pilot 107 replaces the public Squarespace header's Contact link with the
reviewed About page while leaving the experimental role and title filters off.

## Release path

Squarespace already loaded the pinned Pilot 35 script, which in turn loaded the
GitHub Pages URL below:

```html
<script src="https://jdc4444.github.io/jdc-video-pilot/jdc-footer-pilot34.js?v=e009246" crossorigin="anonymous" data-jdc-pilot35-core="pilot34"></script>
```

Pilot 107 changes only `jdc-footer-pilot34.js` so that this established live
loader attaches `jdc-about-pilot107.js`. Squarespace Code Injection was not
changed. The About asset contains no role, title-case, or sitewide filter code.

## Rollback

Restore `jdc-footer-pilot34.js` from commit
`e9067b8867e673484c87ee74dd7cd6f7ed07db65` and deploy GitHub Pages. The
standalone `jdc-about-pilot107.js` file can remain because nothing else will
load it.

