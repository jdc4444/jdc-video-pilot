# Pilot 41 gallery scheduler rollout

Date: 2026-08-27

## Live immutable loader

```html
<script src="https://cdn.jsdelivr.net/gh/jdc4444/jdc-video-pilot@4659818ed18d3d3716c772f2fec60aa794d2cbda/jdc-footer-pilot41.js" crossorigin="anonymous" data-jdc-footer="pilot41"></script>
```

This revision fixes the shared scheduler used by all 15 progressive MP4 clip
galleries. On fast connections, every nearby gallery clip is attached and
allowed to autoplay; hidden pages pause their gallery clips so background tabs
do not compete for bandwidth. Slow and medium connection limits are retained.

No Squarespace page content, native media block, poster, or gallery export was
changed.

## Live verification

- Bon Iver / Day One: 8 of 8 clips attached, ready, and playing; zero media errors.
- Wynn / Awakening: 10 of 10 clips attached, ready, and playing; zero media errors.
- Thom Yorke / Last I Heard: 13 of 13 clips attached, ready, and playing; zero media errors.
- Uncached public source contained exactly one pilot41 loader, pinned to the
  revision above.

## Exact rollback

Replace the Squarespace Footer injection with this one line and save:

```html
<script src="https://cdn.jsdelivr.net/gh/jdc4444/jdc-video-pilot@6bf8de607cb788460372d738c4c6a56a4be220c1/jdc-footer-pilot41.js" crossorigin="anonymous" data-jdc-footer="pilot41"></script>
```

The previous revision and all of its assets remain immutable.
