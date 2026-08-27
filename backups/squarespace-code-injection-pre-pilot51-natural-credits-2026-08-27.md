# Squarespace Code Injection rollback — before pilot51 natural credits

Captured before replacing the live pilot50 credits-preview loader with pilot51.

## Current immutable release

- Git commit: `b18210ed35b03640c91fa545d3d064186e48421f`
- Script: `https://cdn.jsdelivr.net/gh/jdc4444/jdc-video-pilot@b18210ed35b03640c91fa545d3d064186e48421f/jdc-footer-pilot50.js`

## Rollback

Restore the script URL above in both the Squarespace Header and Footer Code Injection fields, leaving the existing video-feature gate around the Header loader unchanged.
