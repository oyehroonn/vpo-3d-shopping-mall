

# Premium Slow Zoom Effect for Runway Image

## Current Implementation

The image currently has:
```jsx
className="... group-hover:scale-105 transition-transform duration-[2s]"
```

This creates a 2-second zoom effect, but it still feels too fast and lacks the premium, cinematic quality you're looking for.

## Proposed Changes

### 1. Slower Duration
Increase the transition duration from 2 seconds to **4-5 seconds** for a much more luxurious, slow-motion feel.

### 2. Premium Easing Curve
Add a custom cubic-bezier easing function that starts slow, accelerates slightly, then eases out - creating a more organic, premium motion:
- Use `ease-out` or custom `cubic-bezier(0.25, 0.46, 0.45, 0.94)` for a refined feel

### 3. Subtle Scale Amount
The current 105% scale is good, but we can keep it at 105-110% for maximum cinematic impact without being distracting.

### 4. Optional: Combine with Opacity
Add a subtle opacity transition from 80% to 90% on hover to create a "fade inwards" brightening effect as you described.

## Technical Implementation

### File: `src/components/vpo/RunwaySection.tsx`

**Line 58 changes:**

Current:
```jsx
className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-[2s]"
```

Updated:
```jsx
className="w-full h-full object-cover opacity-80 group-hover:opacity-90 group-hover:scale-110 transition-all duration-[4s] ease-out"
```

**Key changes:**
- `duration-[2s]` → `duration-[4s]` - Doubles the animation time for a slower, more cinematic feel
- `transition-transform` → `transition-all` - Enables both transform and opacity to animate
- Added `group-hover:opacity-90` - Subtle brightening effect on hover (fade inwards)
- `group-hover:scale-105` → `group-hover:scale-110` - Slightly larger zoom for more dramatic effect
- Added `ease-out` - Premium easing that slows down naturally at the end

## Expected Result

When you hover over the runway image:
1. The image will very slowly zoom in from 100% to 110% over 4 seconds
2. Simultaneously, it will subtly brighten from 80% to 90% opacity
3. The animation will feel cinematic and luxurious, matching high-fashion editorial standards
4. When you move your mouse away, it will slowly reverse back to its original state

