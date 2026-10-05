# VPO brand demo: active scroll sequence and preserved original

The GSAP frame sequence is the main product demo in **VPO for Brands → Experience**,
before the social lobby, inventory, and heatmap previews. The duplicate bottom
experiment has been removed.

## Restore the original 28-second 4K film

Change one value in `src/components/brands/demoMode.ts`:

```ts
export const BRAND_DEMO_MODE: 'scroll' | 'film' = 'film';
```

Change it back to `'scroll'` to use the frame sequence again. Rebuild for production.
The canonical `/vpo-business` route passes this choice to the legacy page and its
React experience frame. There is no need to uncomment a large block or delete the
new implementation.

Preview the preserved film without any source edit:

- `/vpo-business?demo=film&preview=experience` — original film in the business page.
- `/brand-experience?demo=film` — standalone original and business previews.
- `/vpo-business?demo=scroll&preview=scroll` — current main scroll sequence.

An explicit `demo` URL parameter overrides the source setting. When opening the
legacy `/VPOBusiness.html` file directly, use `?demo=film&preview=experience` too;
the canonical React page is what applies `demoMode.ts` automatically.

The original is preserved as `src/components/brands/AtelierFilm.tsx`, with its
28-second timeline, play/pause, replay, day/night, rotation, fullscreen and 4K
renderer. It now starts in 4K when restored. `atelierScene.ts`, original material
maps and the 4K poster are retained. The film component is lazy-loaded only in
film mode: hiding it does not run a second renderer or download its material maps.

## Image quality

The old experiment used 1600×900 frames. Version 2 is rendered **natively at
3840×2160**, using the original scene's 4K renderer and 4K leather normal/roughness
maps. These are not upscaled copies. All variants have 673 frames sampled at
24 fps, including the final frame at 28 seconds.

| Variant | Dimensions | WebP quality | Complete set | Average frame |
| --- | --- | --- | --- | --- |
| 4K | 3840×2160 | 88 | 297.52 MB | 442 KB |
| Desktop / Data saver | 1920×1080 | 86 | 89.92 MB | 134 KB |
| Mobile | 1280×720 | 84 | 52.67 MB | 78 KB |

Sizes are decimal units from `public/brands/scroll-sequence/manifest.json`.
The smaller variants are downsampled from the same native 4K render.
The 2D display canvas honours device pixel ratio up to the source's useful
resolution. Playback draws crisp individual frames rather than blending adjacent
product silhouettes. GSAP still smooths the scroll-to-playhead movement.

**Auto** starts with 4K on desktop and 720p on phones. Save-Data or an advertised
2G/3G connection selects the smaller desktop variant. Three consecutive 4K
requests taking more than 550 ms cause Auto to use 1080p. The control reports
`Auto · 4K` or `Auto · HD`. **4K Ultra HD** explicitly selects native 4K on any
device and disables that automatic fallback. **Data saver** selects the smaller
variant manually.

## Loading and performance limits

A 4K image sequence is bandwidth-heavy even though its animation does not require
real-time 3D rendering. It cannot be guaranteed to load instantly or remain smooth
on every device or connection. A visitor who slowly traverses every 4K frame can
download roughly 298 MB; this is not the initial page payload.

The implementation limits its impact:

- The sequence iframe itself is not loaded until the visitor approaches within
  about 900 px of the demo, inside the business page's actual scroll container.
- Only nearby frames are fetched. There is no full-sequence preload or hidden
  second copy at the bottom of the page.
- Two requests run concurrently in 4K; three in smaller variants. Large jumps
  cancel requests for distant frames. Compressed images use the browser cache.
- The decoded bitmap cache holds at most four 4K frames (about 126.6 MiB of raw
  pixels), ten 1080p frames (79.1 MiB), or fourteen 720p frames (49.2 MiB).
  In-flight decodes, the display canvas and browser/GPU overhead are additional;
  these figures are cache budgets, not total browser-memory guarantees.
- Evicted bitmaps are explicitly closed. Offscreen/hidden playback pauses work
  and releases all cached frames except the last displayed one.
- If a requested frame is still loading, the last available image remains
  visible, and the text follows the frame actually shown. Failed requests can
  be retried; a static poster is present before the first frame.
- Reduced motion replaces the long pinned section with manual chapter choices.

Production performance still depends on hosting latency, cache headers, bandwidth
and the device. Serve the versioned sequence assets from a CDN with durable cache
headers when deploying; no external deployment or hosting changes were made here.

## Verification (local Chrome, 2026-10-05)

A fresh production-preview load at 1440×1000 with device pixel ratio 2 displayed
the 4K sequence in **1.96 seconds** and requested **five images initially**
(three nearby 4K frames and the two poster/phone images, about 1.5 MB combined).
This timing includes the local business page and iframe startup.

With a cold cache and Chrome network emulation at **8 Mbps / 80 ms latency**,
the standalone sequence displayed a first frame in **2.97 seconds**. Auto
switched to 1080p by **3.77 seconds**. Explicit 4K remained 4K under the same
throttle. These measurements are local checks, not production benchmarks or
promises for slower networks/devices.

Instrumented frame decoding confirmed four retained 4K frames (126.6 MiB raw
pixels), with a transient fifth during replacement, and one retained frame after
leaving the section. Other application textures and browser/GPU memory are not
included in this sequence-cache measurement.

Also checked: forward/reverse native wheel scrolling, all five chapters, $399
entry and completed shelf replacement, quality changes, 390 px mobile layout
without horizontal overflow, explicit 4K on mobile, reduced-motion chapters,
retry after an aborted frame request, and the original 28-second film restored
through its URL override with 4K selected. No runtime errors were observed.
Build, TypeScript and changed-file ESLint checks passed.

## Regenerate the frames

See `public/brands/scroll-sequence/README.md` for the storyboard and exporter.
The exporter verifies that the source render really is 3840×2160 before encoding
any frame and records dimensions, counts and byte totals in the manifest.

References:

- [GSAP ScrollTrigger: scrub and native scrolling](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [MDN: releasing ImageBitmap resources](https://developer.mozilla.org/en-US/docs/Web/API/ImageBitmap/close)
