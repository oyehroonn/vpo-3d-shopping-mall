# Atelier sequence — native 4K, version 2

The primary VPO for Brands product demonstration. The original 28-second film is
preserved behind a single setting; see **`docs/brand-demo.md`** for restoration,
quality options, loading behavior, sizes and performance limits.

## Storyboard

| Film time | Chapter | Action |
| --- | --- | --- |
| 0–6 s | Capture | Photograph the original bag; confirm the photo is added. |
| 6–13 s | Reconstruct | Darken the scene, raise the scan and form the wireframe mesh. |
| 13–20 s | Refine | Reveal leather, stitching, piping and brass hardware. |
| 20–24.3 s | Price & replace | Hold the new piece beside the shelf, enter $399 and simulate the Replace click. |
| 24.3–28 s | Reveal | Replace the previous piece and reveal the new name and price. |

GSAP ScrollTrigger uses 0.8-second desktop / 0.5-second mobile scrub smoothing,
with native CSS sticky positioning in the page's real scroll container. There
are 700 viewport heights on desktop and 620 on mobile. The last 6% of travel
holds the final shelf before releasing the section. Chapters can be selected
manually. Reduced motion removes the long scroll.

## Assets

673 original frames sampled at 24 fps, from 0 through 28 seconds inclusive:

- `4k/`: **3840×2160**, WebP quality 88, rendered at native 4K.
- `desktop/`: 1920×1080, WebP quality 86, derived from the 4K render.
- `mobile/`: 1280×720, WebP quality 84, derived from the 4K render.

The original VPO scene and assets documented in `../ASSETS.md` are used. Runtime
playback does not need WebGL; the scene is rendered offline. The export variant
waits for the simulated Replace click before placing the bag. The original
film's animation remains independent.

The manifest contains exact byte totals and dimensions. Requests include `?v=2`
to invalidate the previous lower-resolution experiment's cached images. Change
this version in both the manifest/exporter and `sequencePlayer.ts` plus poster
URLs when regenerating with a new visual treatment.

## Reproduce

Start Vite, then run:

```sh
node scripts/render-brand-sequence.mjs --url http://127.0.0.1:8083 --playwright-module /absolute/path/to/playwright/index.mjs
```

The renderer uses local Chrome and verifies native 4K dimensions. Playwright is
an offline authoring/QA dependency, not a new runtime dependency. Optional
`--from-frame 463 --to-frame 672` regenerates only a selected interval. Use a
full render when changing dimensions, materials or encoding quality. Rebuild
production after rendering so all emitted assets are copied to `dist`.

Preview `/vpo-business?preview=scroll` in the actual page, or `/brand-scroll-study`
for the standalone sequence. The latter route is retained for existing links.
