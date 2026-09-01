# Squarespace code injection before custom-player pilot84

Footer injection captured before replacing the Squarespace mirror renderer pin:

```html
<script src="https://cdn.jsdelivr.net/gh/jdc4444/jdc-video-pilot@56f54ca2efdac0e7f987ff055cf2ff19e393f3bc/jdc-squarespace-mirror-data-draft1.js" crossorigin="anonymous" data-jdc-squarespace-mirror-data="pilot83"></script>
<script src="https://cdn.jsdelivr.net/gh/jdc4444/jdc-video-pilot@c1ca899f775986b0a7d513a51e42abc0c6a1a613/jdc-squarespace-mirror-draft1.js" crossorigin="anonymous" data-jdc-squarespace-mirror="pilot81"></script>
<script src="https://cdn.jsdelivr.net/gh/jdc4444/jdc-video-pilot@c5ecb68146f3da304d0aba6fe0bda9d2ab815577/jdc-footer-pilot76.js" crossorigin="anonymous" data-jdc-footer="pilot76"></script>
```

Rollback: restore the footer injection above and save.
