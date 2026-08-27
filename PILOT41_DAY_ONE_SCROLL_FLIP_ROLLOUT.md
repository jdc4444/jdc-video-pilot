# Pilot 41 Day One scroll and flip rollout

Date: 2026-08-27

## Live immutable loader

```html
<script src="https://cdn.jsdelivr.net/gh/jdc4444/jdc-video-pilot@5a67dac9c88b5932c75fbe8e9e89c875df6438f0/jdc-footer-pilot41.js" crossorigin="anonymous" data-jdc-footer="pilot41"></script>
```

This revision removes the empty original BTS host before the shared project
spacing code initializes, then builds the Day One gallery in its final order:
clips 1 through 8 followed by BTS. This prevents the old host from being
remeasured against the viewport during bottom-to-top scrolling.

Day One clip 8 and its first-frame poster are mirrored horizontally. No source
clip, poster export, native Squarespace media block, or project text was
overwritten.

## Live verification

- Day One held its gallery anchor through a complete top-to-bottom-to-top scroll.
- The former approximately 965 px page-height jump did not recur.
- All 8 Day One clips reached ready state 4, autoplayed, and reported zero media errors.
- Clip 8 reported the horizontal mirror transform on both poster and video.
- The live order was clips 1-8, then BTS.
- Wynn / Awakening remained healthy as a shared-loader regression check: 10 of
  10 clips ready and playing with zero media errors.
- The uncached public source contained exactly one pilot41 loader pinned to the
  revision above.

## Exact rollback

Replace the Squarespace Footer injection with this one line and save:

```html
<script src="https://cdn.jsdelivr.net/gh/jdc4444/jdc-video-pilot@4659818ed18d3d3716c772f2fec60aa794d2cbda/jdc-footer-pilot41.js" crossorigin="anonymous" data-jdc-footer="pilot41"></script>
```

The previous revision and all of its assets remain immutable.
