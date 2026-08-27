# Squarespace Code Injection rollback — before pilot50 credits prune

Captured before replacing the live pilot49 credits-preview loader with pilot50.

## Current immutable release

- Git commit: `84645b98caa13883947d1b8cecde579befdc8678`
- Script: `https://cdn.jsdelivr.net/gh/jdc4444/jdc-video-pilot@84645b98caa13883947d1b8cecde579befdc8678/jdc-footer-pilot49.js`

## Rollback

Restore the script URL above in both the Squarespace Header and Footer Code Injection fields, leaving the existing video-feature gate around the Header loader unchanged.
