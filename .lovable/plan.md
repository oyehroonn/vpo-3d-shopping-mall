

# Premium Typography & Effects Refinement Plan

## Analysis: Key Differences Found

After thorough comparison of the reference HTML with our current implementation, here are the exact differences that need to be addressed:

---

## 1. Districts Section - Brand List Typography

### Reference HTML (lines 207-219):
```html
<div class="flex items-center justify-between border-b border-stone-200 pb-2 cursor-pointer group">
    <span class="text-xs font-medium">Comme des Garçons</span>
    <i data-lucide="arrow-right" class="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity"></i>
</div>
```

### Current Implementation:
- Uses `text-sm text-foreground/70` (14px, 70% opacity)
- Uses `py-3` padding (larger vertical spacing)
- Arrow icon uses `w-4 h-4` (16px)

### Issues:
| Property | Reference | Current |
|----------|-----------|---------|
| Font size | `text-xs` (12px) | `text-sm` (14px) |
| Font weight | `font-medium` | normal (no weight specified) |
| Text color | solid black | `foreground/70` (muted) |
| Vertical padding | `pb-2` (8px) | `py-3` (12px top & bottom) |
| Arrow size | `w-3 h-3` (12px) | `w-4 h-4` (16px) |

---

## 2. Districts Section - Title Typography

### Reference HTML (line 202):
```html
<h3 class="text-4xl serif mb-6">District 01: <br> <span class="italic text-stone-400">Neo-Tokyo</span></h3>
```

### Current Implementation:
```tsx
<h3 className="font-display text-2xl md:text-3xl text-foreground italic mb-4">
```

### Issues:
| Property | Reference | Current |
|----------|-----------|---------|
| Font size | `text-4xl` (36px) | `text-2xl md:text-3xl` (24-30px) |
| Title style | Only "Neo-Tokyo" is italic | Entire heading is italic |
| Margin | `mb-6` | `mb-4` |

---

## 3. Runway Section - Image Hover Effect

### Reference HTML (line 124):
```html
<img src="..." class="... group-hover:scale-105 transition-transform duration-[2s]">
```

### Current Implementation:
```tsx
className="... group-hover:scale-105 transition-transform duration-[2s] ease-out"
```

### Issue:
The duration is actually the same (2s), but the reference uses the default easing while we added `ease-out`. However, the user feels it's too fast. The reference scales to 105% in 2s - we should try a subtler, slower approach for a more premium feel.

---

## 4. Runway Section - "Look 04" Title Typography

### Reference HTML (line 115):
```html
<h3 class="text-2xl serif italic text-white mb-2">Look 04: Obsidian Veil</h3>
<p class="text-xs text-stone-400 font-mono">Designed by Maison VPO</p>
```

### Current Implementation:
```tsx
<p className="font-display text-xl md:text-2xl text-foreground italic mb-1">
<p className="text-xs tracking-[0.15em] uppercase text-foreground/50 font-sans">
```

### Issues:
| Property | Reference | Current |
|----------|-----------|---------|
| Look title size | `text-2xl` fixed | `text-xl md:text-2xl` |
| Look title margin | `mb-2` | `mb-1` |
| Designer subtitle | `font-mono`, NOT uppercase | `font-sans`, uppercase with letter-spacing |

---

## 5. Runway Section - Schedule Items

### Reference HTML (lines 134-145):
```html
<div class="flex justify-between text-xs font-mono text-stone-500 mb-1">
    <span>09:00 EST</span>
    <span>Live</span>
</div>
<p class="text-sm font-light text-stone-300">The Black Coat Collection</p>
```

### Current Implementation:
Uses separate styled status badges and different font styling.

---

## 6. Journal Section - Article Titles

### Reference HTML (line 369):
```html
<h3 class="text-xl serif italic mb-3 group-hover:underline decoration-1 underline-offset-4 decoration-stone-300">
```

### Current Implementation:
```tsx
<h3 className="font-display text-xl md:text-2xl text-light italic mb-3 group-hover:underline decoration-1 underline-offset-4 decoration-vpo-subtle/30">
```

### Issue:
Size is similar but reference uses fixed `text-xl` (20px), not responsive sizing.

---

## Implementation Plan

### File: `src/components/vpo/DistrictsSection.tsx`

1. **Brand list typography refinement:**
   - Change `text-sm` to `text-xs`
   - Add `font-medium`
   - Remove opacity from text color
   - Change `py-3` to `pb-2`
   - Reduce arrow icon from `w-4 h-4` to `w-3 h-3`

2. **District title refinement:**
   - Increase size to `text-3xl md:text-4xl`
   - Move italic only to "Neo-Tokyo" span
   - Increase margin to `mb-6`

### File: `src/components/vpo/RunwaySection.tsx`

1. **Slow down image hover effect:**
   - Change duration from `duration-[2s]` to `duration-[3s]`
   - Use subtler scale: `scale-[1.03]` instead of `scale-105`

2. **Designer credit typography:**
   - Remove uppercase transformation
   - Add `font-mono` class for monospace font
   - Remove letter-spacing

3. **Look title refinement:**
   - Use consistent `text-2xl` size
   - Change margin from `mb-1` to `mb-2`

### File: `src/index.css`

Add monospace font to the font stack:

```css
@import url('https://fonts.googleapis.com/css2?family=... &family=IBM+Plex+Mono:wght@300;400&display=swap');

--font-mono: 'IBM Plex Mono', monospace;
```

Add utility class:
```css
.font-mono {
  font-family: var(--font-mono);
}
```

---

## Summary of Changes

| Component | Change | Impact |
|-----------|--------|--------|
| DistrictsSection | Brand names: smaller, bolder, tighter spacing | Matches reference's refined look |
| DistrictsSection | District title: larger, split italic styling | Better visual hierarchy |
| RunwaySection | Image zoom: 3s duration, subtler 1.03x scale | Premium, slow-motion effect |
| RunwaySection | Designer credit: monospace, no uppercase | Matches editorial reference |
| CSS | Add monospace font family | Enables font-mono utility |

---

## Technical Notes

- All changes are typography and timing tweaks - no structural changes
- The monospace font adds subtle editorial authenticity
- Slower animations create the "premium" feel the reference achieves
- Smaller brand names create better visual balance with the map

