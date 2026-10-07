# Chrome brands marquee

The opening brands marquee uses original, wide geometric letterforms rendered
with beveled chrome, a curved cool/warm reflection band, and silver rim lighting.
The transparent artwork is shared by `VPOBusiness.html` and
`public/VPOBusiness.html`. Styling lives in `public/brands/chrome-marquee.css`.

Two identical groups preserve the seamless 32-second rightward animation. The
existing `DSMStripCoupler` still controls the scroll fade and duration. Reduced
motion disables the animation. The images have empty alternative text because
this repeating strip is decorative; the document retains its existing title.

The browser selects a 3840- or 7680-pixel-wide WebP using `srcset`. All repeats
reuse that asset. This artwork needs no additional runtime renderer or font.

## Rebuild the artwork

The editable geometry, materials, lighting, and camera are in
`scripts/render-brand-wordmark.py`. With Blender 5 installed:

```sh
blender -b --python scripts/render-brand-wordmark.py -- \
  --output /tmp/vpo-wordmark-final.png --width 7680 --samples 96
```

Export the native render and a downsampled variant with Python and Pillow:

```python
from PIL import Image

image = Image.open('/tmp/vpo-wordmark-final.png').convert('RGBA')
image.save('public/brands/vpo-for-brands-chrome-8k.webp', quality=94, method=6)
image.resize((3840, 286), Image.Resampling.LANCZOS).save(
    'public/brands/vpo-for-brands-chrome.webp', quality=94, method=6)
```

Both images preserve transparency. If the wording or proportions change, update
the HTML image dimensions and source sizes alongside the exported images.
