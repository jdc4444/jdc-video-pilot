# Pilot 14 gallery verification

Date: 2026-08-25

## Rollback point

- Live controller before this rollout: `jdc-footer-pilot13.js?v=f72a3b4`
- Pilot 13 SHA-256: `69d67923e9e93d2e22137097689eb1f0d9985aa70d8e520754cb1bd41d46cbab`
- Rollback is a one-line Squarespace footer-loader change from pilot 14 back to the loader above.

## Pilot 14 behavior

- Applies the progressive queue to project pages with three or more video blocks.
- Keeps every first-frame poster visible until its video is actually playing.
- Starts at most two new streams at once on a normal connection and one on a conservative connection.
- Starts from the smallest HLS rendition in browsers using hls.js, then leaves adaptive quality enabled.
- Uses Safari's native adaptive HLS while retaining the same startup queue.
- Queues every visible clip before one adjacent preload in each scroll direction.
- Releases a startup slot after 10 seconds on a normal connection or 15 seconds on a conservative connection so a stalled stream cannot starve the gallery.
- Does not alter the homepage scheduler or project-page layout rules from pilot 13.

## Verification

- Syntax and whitespace checks passed.
- Deterministic 18-clip gallery: nine simultaneously visible clips all played; maximum concurrent startups was two.
- Stalled-stream case: the first two streams yielded; every other visible clip received a startup turn; maximum concurrent startups remained two.
- Conservative-network case: startup concurrency remained one and all nine visible clips played.
- Single-column fast-network case: startup concurrency remained two; visible clips played both downward and upward.
- Bombas Spring captured page with real Squarespace HLS: nine of nine visible gallery clips played in each tested viewport position, including after scrolling down and back up; maximum concurrent startups was two.
- Siberia Hills vertical captured page with real Squarespace HLS: six of six visible vertical clips played; their `0.5625` aspect ratios were retained; maximum concurrent startups was two.

## Publication

- Pilot 14 SHA-256: `69e8efb1f0be958ea8c6e740167177bbc2275633b499fcbd136bb81e0b68c162`
- Controller commit: `7590c32`
- Public checksum: matched the local SHA-256 above after the successful GitHub Pages deployment.
- Squarespace persisted loader: `jdc-footer-pilot14.js?v=7590c32`; confirmed after a full editor reload, with no pilot 13 loader remaining.
- Live Bombas Spring: nine of nine visible gallery clips played after scrolling down, farther down, and back up; startup peak remained two.
- Live Siberia Hills: six of six visible vertical clips played at the multi-clip position; `0.5625` aspect ratios remained intact; upward scrolling repopulated correctly.
- Live homepage regression: pilot 14 loaded in standard mode and the visible optimized homepage video played.
