# Pilot 41 progressive gallery rollout

Date: 2026-08-27

## Outcome

Pilot 41 is live on `josdiazcontreras.com`. It replaces the selected-clip galleries' segmented HLS delivery with retained, fast-start progressive MP4 delivery while preserving the pilot 40 site behavior everywhere else.

Live immutable loader:

```html
<script src="https://cdn.jsdelivr.net/gh/jdc4444/jdc-video-pilot@22ec9ee6ec4cb19f860011c382725be1e75da41c/jdc-footer-pilot41.js" crossorigin="anonymous" data-jdc-footer="pilot41"></script>
```

## Cause fixed

Pilot 38 destroyed each off-screen HLS player, removed its source, and discarded its downloaded buffer. Scrolling back forced a new manifest and segment download. The high rendition was also declared at 6 Mbps, while only three desktop clips were allowed to remain active.

Pilot 41 instead:

- serves one fast-start H.264 MP4 per exact approved clip;
- retains attached media and downloaded buffers when clips leave the viewport;
- shows the exact first delivered frame as the poster until playback is ready;
- delays gallery media until the gallery approaches the viewport, so the lead film keeps priority;
- starts up to six visible clips and warms nine nearby clips on fast desktop connections;
- adapts to four on fast tablet, two on fast mobile, and lower concurrency on medium, slow, or data-saving connections;
- retries failed media up to three times without leaving an empty panel;
- rebuilds the gallery if Squarespace hydration replaces the initial injected section.

## Export inventory

- Projects: 15
- Clips: 127
- Total duration: 654.143 seconds
- Total optimized bytes: 112,897,002
- Average delivered bitrate: 1.381 Mbps
- Frame width: up to 960 px
- Format: H.264 High Profile, yuv420p, no audio, fast-start MP4
- Posters: regenerated from frame zero of each exact delivered MP4
- Size reduction versus prior high HLS segment set: about 72 percent

All 127 exports passed codec, pixel format, dimensions, duration, no-audio, poster-dimension, and `moov`-before-`mdat` validation.

## Live verification

All 15 gallery pages were checked against the live public site after publishing. Every page reported one pilot 41 gallery section, the exact approved clip count, direct progressive MP4 sources, and zero media errors. On the fast desktop test, all six visible clips reached simultaneous playback.

The Thom Yorke gallery reached all 13 clips attached and ready. After scrolling to the bottom and back to the first row, all 13 remained buffered and the first six were already playing within 250 ms.

Control pages also passed after the loader change:

- Home: four videos playing, zero errors
- Siberia Hills: two videos playing, zero errors
- LOVB Adidas: portrait-grid marker retained, two videos playing, zero errors
- Bombas Dream of Comfort: pilot 40 BTS placement retained, two videos playing, zero errors
- Alignment Documentary: all 18 slides retained, two videos playing, zero errors
- Day One: eight clips followed by the BTS video, pilot 40 BTS placement retained, zero errors

## Exact rollback

Replace the Squarespace Footer injection with this one line and save:

```html
<script src="https://cdn.jsdelivr.net/gh/jdc4444/jdc-video-pilot@d76657fe91db4aadcfb9a2d1f344f1fab2d32ce5/jdc-footer-pilot40.js" crossorigin="anonymous" data-jdc-footer="pilot40"></script>
```

No page content or native Squarespace media blocks need to change for the rollback.
