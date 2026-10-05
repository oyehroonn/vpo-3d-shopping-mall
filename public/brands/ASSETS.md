# VPO brand experience — asset and research notes

The brand demonstrations are deliberately local concept previews. No photos are
uploaded, meshes inferred by an AI service, live inventory changed, visitors
tracked, or multiplayer messages sent. The application renders a real original
Three.js model and simulates the business workflow around it.

## Original model and environment

`src/components/brands/atelierScene.ts` creates the Atelier 01 handbag and the
boutique in code. It includes curved/tapered leather panels, individual saddle
stitches, gusset piping, two rolled handles, mounting rings, brass rivets, a
bevelled turn lock, a leather clochette, feet, and original VPO typography.
The scene includes travertine shelves, bronze edging, walnut slats, inset
lighting, physically based materials, shadows, tone mapping and a studio
reflection environment. No luxury-brand model, logo or product photo is bundled.

`public/brands/atelier-poster-4k.jpg` is a 3840 × 1976 still exported directly
from the original WebGL scene for loading and non-WebGL fallback views.

The model's grain map is generated at 4096 × 4096. The optional 4K control renders
the canvas at a 3840-pixel long edge, subject to the device's texture limit.
Default rendering adapts to device density. This is real-time WebGL, not a
prerendered 4K video. Rendering pauses when offscreen or hidden, and settles when
paused. Reduced-motion visitors get a still scene with manually accessible stages.

## Downloaded material maps

- `leather-normal-4k.webp` — 4096 × 4096 OpenGL normal map.
- `leather-roughness-4k.webp` — 4096 × 4096 roughness map.
- Source: [Brown Leather by Rob Tuytel / Poly Haven](https://polyhaven.com/a/brown_leather).
- License: [CC0](https://polyhaven.com/license).
- Downloads discovered via `https://api.polyhaven.com/files/brown_leather`.
- Original files: `brown_leather_nor_gl_4k.jpg` and `brown_leather_rough_4k.jpg`.
- Optimized locally to WebP without changing dimensions, with cwebp quality 82
  (normal) and 70 (roughness).

## Generated salon image

- Saved asset: `public/brands/private-salon.jpg`.
- Generated with the built-in image generation tool, then encoded as JPEG.
- Actual output dimensions: 1672 × 941. The tool did not return native 4K for
  this image; it is used inside the smaller social-shopping preview.
- All people and the boutique are generated concept imagery.

Final prompt:

> Use case: ads-marketing. Asset type: premium fashion spatial-commerce website background, landscape 16:9 at 3840x2160 if available, maximum quality. Create a cinematic photorealistic architectural visualization of a luxury leather goods boutique, original unbranded architecture inspired by the quiet material quality of Hermès and Louis Vuitton interiors. Deep walnut paneled walls, curved cream travertine niches with exquisite warm hidden LED illumination, long brushed champagne brass floating shelves displaying a few beautifully crafted cognac and black top-handle leather bags, cream polished limestone floor, elegant low round stone central display island. Three stylish adult shoppers in tasteful neutral designer tailoring, two women chatting to each other at center-right, one person looking at a bag toward the back, all fully visible head to foot. View from a slightly elevated corner with good view of store depth, 28mm architectural lens, warm late afternoon light, rich cinematic shadow, extremely detailed believable materials and human faces. Mood refined, expensive, intimate, contemporary Paris boutique. No brand logos, no text, no UI, no typography, no watermarks. Compose as a full-bleed website interactive social lobby background with shoppers centered and top/bottom margins available for HTML overlays. Avoid cartoon look, avoid oversaturated orange lighting, avoid sci-fi.

## Research informing the previews

- [Hermès — leather stories](https://www.hermes.com/dh/en/content/273315-leather-stories/): hand-applied saddle stitching and the attention given to individual pieces informed the original model's seam and hardware detailing.
- [Louis Vuitton — Atlas table](https://us.louisvuitton.com/eng-us/products/atlas-coffee-table-top-nvprod6350156v/R93515): the use of travertine and contrasting sculptural materials informed the architectural palette; no asset from this page was copied.
- [Shopify — InventoryLevel](https://shopify.dev/docs/api/admin-graphql/latest/objects/inventorylevel): inventory belongs to an item at a location and includes available quantities; the demo uses a simple available-stock view.
- [Three.js — MeshPhysicalMaterial](https://threejs.org/docs/#api/en/materials/MeshPhysicalMaterial): reference for physically based surface rendering.

## Integration and preview

- `/vpo-business` retains the original immersive introduction and partnership page.
- "Explore brand demos" opens the new experience directly from the introduction.
- `/vpo-business?preview=experience` opens the demonstrations directly.
- `/brand-experience` is the standalone responsive preview.
- Both legacy HTML copies embed the same bundled React experience before pricing.
- Same-origin, source-checked messages resize the inner frame and navigate to tiers.
- Long tier inclusions remain available in expandable details; the feature matrix
  is replaced by the visual previews.
