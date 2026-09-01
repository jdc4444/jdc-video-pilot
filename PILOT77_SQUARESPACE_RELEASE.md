# Pilot 77 Squarespace release

Pilot 77 makes the reviewed combined portfolio the public project-page and
onepage authority while keeping the established regular homepage intentionally
smaller.

## Collection contract

- Regular homepage: 33 established projects.
- Onepage: 50 approved projects.
- Direct project routes: all 52 projects.
- `Maybelline — Whip It Up x Gigi Hadid` and `Maybelline — Loaded Bolds` remain
  hidden from both collections but retain direct project pages.
- Limn and Instagram remain excluded from this release.

The five projects from the 2026-08-25 Squarespace batch remain available on
onepage and at their direct routes, but are hidden from the regular homepage:

- `/mtv-vote-early`
- `/u2-the-best-thing-about-me`
- `/gabriel-garzon-montano-crawl`
- `/armando-young-loved-ones`
- `/dig-brand-identity`

## Not Linked route shells

Create these pages in Squarespace's Not Linked section so every released route
returns a real page rather than a styled 404:

- `/onepage`
- `/seletar-archive`
- `/paracosm`
- `/new-york-lottery-loteria`
- `/gabriel-garzon-montano-my-balloon`
- `/maybelline-gigi-glow-talk`
- `/maybelline-gigi-vs-gigi`
- `/maybelline-gigi-whip-it-up`
- `/maybelline-loaded-bolds`
- `/maybelline-superstay`
- `/aishti-aizone`
- `/bad-night`
- `/tomorrow-i-love-you`
- `/sticky-fingers`
- `/just-let-me-show-you`

## Release behavior

- Onepage media sources load only as they approach the viewport, preventing the
  role filters from stalling under hundreds of simultaneous video requests.
- The filter order is JDC, Director, Producer, Creative Director, Editor.
- Creative Director also includes Jos's Art Director, Graphics Director, and
  Art & Animation Director credits.
- Just Let Me Show You uses the official-page 2:38 trailer copy instead of the
  unsuitable 39-minute archival research file.
- The public data payload contains no workstation paths or local-only URLs.

## Rollback

Restore the exact code-injection values in
`backups/squarespace-code-injection-pre-pilot77-2026-09-01.md`.
