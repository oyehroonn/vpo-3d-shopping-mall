

# Make Scroll Animations Reversible and Repeatable

## Problem

Currently, scroll animations only play once and stay in their "revealed" state. When you scroll up and back down, the animations don't replay because:

1. The `ScrollReveal` component uses `observer.unobserve()` after the first reveal - it stops watching after animating once
2. The `revealed` class is added but never removed when scrolling away
3. The GSAP hooks use `toggleActions: "play none none none"` which means "play on enter, do nothing on leave/re-enter"

## Solution

Update the animation logic to support **reversible animations** that:
- Play when scrolling down into view
- Reverse (fade out) when scrolling back up past the element  
- Replay when scrolling down again

## Technical Changes

### 1. Update ScrollReveal Component

**File: `src/components/ScrollReveal.tsx`**

- Remove `observer.unobserve()` so it keeps watching the element
- Add logic to **remove** the `revealed` class when element leaves viewport (scrolling up)
- Check `entry.isIntersecting` for both true (entering) and false (leaving)

```text
Current Logic:
  Element enters viewport → Add "revealed" → Stop watching

New Logic:
  Element enters viewport → Add "revealed" 
  Element exits viewport (upward) → Remove "revealed"
  Element re-enters → Add "revealed" again
  (Continues watching forever)
```

### 2. Update useScrollReveal Hook

**File: `src/hooks/useScrollReveal.ts`**

Change `toggleActions` from `"play none none none"` to `"play none none reverse"`:

| Action | Current | New |
|--------|---------|-----|
| onEnter | play | play |
| onLeave | none | none |
| onEnterBack | none | none |
| onLeaveBack | none | reverse |

This means:
- **play** when scrolling down past the trigger
- **reverse** when scrolling back up past the trigger

### 3. Update useScrollRevealRefs Hook

**File: `src/hooks/useScrollReveal.ts`**

- Remove the `hasAnimated.current` flag that prevents re-animation
- Change `toggleActions` to `"play none none reverse"`

## CSS Already Supports This

The CSS in `index.css` already has transitions defined for both directions - when the `revealed` class is removed, the element will smoothly animate back to its hidden state:

```css
.reveal {
  opacity: 0;
  transform: translateY(60px);
  transition: opacity 0.8s ..., transform 0.8s ...;
}

.reveal.revealed {
  opacity: 1;
  transform: translateY(0);
}
```

## Summary of Changes

| File | Change |
|------|--------|
| `ScrollReveal.tsx` | Keep observing, toggle `revealed` class based on visibility |
| `useScrollReveal.ts` | Change toggleActions to "play none none reverse" |
| `useScrollReveal.ts` | Remove hasAnimated flag from useScrollRevealRefs |

