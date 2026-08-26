# Pilot 39 Alignment gallery rollout

Date: 2026-08-27

## Reversible production state

Production before this rollout used this single Squarespace footer loader:

```html
<script src="https://cdn.jsdelivr.net/gh/jdc4444/jdc-video-pilot@9487368d8ba4f750dbafb075e2b4ae1844ddb95e/jdc-footer-pilot38.js" crossorigin="anonymous" data-jdc-footer="pilot38"></script>
```

Production now uses this single Squarespace footer loader:

```html
<script src="https://cdn.jsdelivr.net/gh/jdc4444/jdc-video-pilot@b704fcaceefd5819170e4d9a06c8f84087a52778/jdc-footer-pilot39.js" crossorigin="anonymous" data-jdc-footer="pilot39"></script>
```

Rollback is one operation: replace the pilot39 footer line with the pilot38
line above and save Code Injection. The immutable pilot38 assets were not
changed or removed.

`pilot39` is an additive wrapper around the immutable pilot38 release. Its only
new page-specific behavior runs on `/alignment-documentary`; pilot38 continues
to provide the homepage, project-video, and approved clip-gallery behavior.

## Alignment gallery

- All 18 supplied finished compositions are included in numeric order, slides
  33 through 50.
- Each supplied two-up composition remains one image; no panel was split,
  cropped, or rearranged.
- The gallery is a single full-width stack after the page's two existing native
  video sections.
- The native Alignment videos and project text were not replaced or modified.
- Images preserve their original aspect ratios and use intrinsic dimensions to
  prevent layout shifts.

## Responsive delivery

Each 3.5K source PNG has three WebP derivatives:

| Delivered width | Complete gallery size |
| ---: | ---: |
| 960 px | 1,840,884 bytes |
| 1600 px | 4,206,114 bytes |
| 2800 px | 9,227,112 bytes |

The original 18 PNGs total 99,097,320 bytes. Browser `srcset` selection delivers
the appropriate tier for the viewport and pixel density; images are lazy-loaded
and asynchronously decoded so the lead video is not forced to compete with all
18 slides on first paint. Source PNGs and local source paths were not published.

## Verification evidence

- All 54 WebP derivatives passed structural validation.
- The pilot39 JavaScript passed syntax validation.
- The immutable pilot39 loader and every derivative returned HTTP 200 from the
  CDN with cross-origin access and year-long immutable caching.
- Local desktop visual QA installed exactly 18 slides in order and loaded all
  18 high-resolution 2800-pixel variants with zero image failures.
- Local control checks left the homepage free of the Alignment gallery and
  preserved the existing eight-clip Day One gallery with zero video errors.
- Uncached public page source contained the single pilot39 Squarespace loader.
- Live `/alignment-documentary` installed exactly 18 slides in order after its
  two native video sections, loaded all 18 high-resolution variants, and
  reported zero image and video failures.
- Live visual checks covered the beginning, middle, end, downward loading, and
  returning upward to the first slide.
