# Atelier scroll study 01

A separate experiment at the very bottom of VPO for Brands. The original
28-second interactive film is preserved.

## Storyboard

| Film time | Chapter | What happens | Side narrative |
| --- | --- | --- | --- |
| 0–6 s | Capture | The original bag is photographed; the phone confirms the photo was added. | One photograph. Infinite possibility. |
| 6–13 s | Reconstruct | The scene darkens, the scan rises and a wireframe mesh takes shape. | AI spatial models reconstruct and process the object’s 3D mesh. |
| 13–20 s | Refine | The mesh resolves into leather, stitching, piping and brass hardware. | Every texture. Every little detail. |
| 20–24.3 s | Price & replace | The price field focuses, $399 is typed, the cursor moves to Replace and clicks. | Set your price. Make your move. |
| 24.3–28 s | Reveal | The previous piece is replaced, and the new name and price appear. | A new piece. A living collection. |

The new sequence delays physical replacement until the simulated click. This
change is restricted to the export variant; the original film is unchanged.

## Scroll design

- GSAP ScrollTrigger with linear frame progression and 0.8-second desktop /
  0.5-second mobile scrub smoothing. No automatic snapping or wheel interception.
- 700 viewport heights on desktop, 620 on mobile. The last 6% of scroll travel
  holds the finished display before releasing the scene.
- Native CSS sticky positioning inside the business page’s existing scroll
  container; GSAP listens to that same container across the same-origin frame.
- Side copy crossfades over a 0.75-second film interval. Text, progress and
  publishing overlays follow the image actually displayed when loading catches up.
- Every chapter can be reached using its keyboard-accessible navigation button.
- Reduced-motion mode removes the long pinned scroll and uses manual chapters.
- Image sequence playback works without WebGL. The original 3D scene is used
  only during offline export.

## Assets and loading

673 frames, sampled at 24 fps from time 0 through 28 seconds, inclusive.
Desktop frames are 1600 × 900 WebP (quality .80); mobile frames are 960 × 540
WebP (quality .78). These are original renders from `atelierScene.ts`, using the
same assets documented in `../ASSETS.md`.

A four-request loading queue fetches nearby frames first, with a few chapter
anchors for large jumps. Decoded images are capped at 14 desktop / 16 mobile
frames and explicitly released on eviction/unmount. The browser HTTP cache
retains compressed resources. Adjacent loaded frames blend at fractional frame
positions. Failed frames keep their original indices and can be retried.

## Reproduce

Start the Vite development server and run:

```sh
node scripts/render-brand-sequence.mjs --url http://127.0.0.1:8083 --playwright-module /absolute/path/to/playwright/index.mjs
```

Playwright is an offline authoring/QA dependency, not a new runtime dependency.
The renderer uses local Chrome and writes both resolutions plus `manifest.json`.
Pass `--from-frame 463` to regenerate only the final portion after a scene edit.

Preview routes:

- `/vpo-business?preview=scroll` — jump to the bottom experiment in the real page.
- `/brand-scroll-study` — standalone inspection of the same scroll experience.

GSAP reference: https://gsap.com/docs/v3/Plugins/ScrollTrigger/
