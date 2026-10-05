// Change only this value to 'film' to restore the preserved 28-second 4K demo.
// Full instructions: docs/brand-demo.md. URL ?demo=film previews it without edits.
export const BRAND_DEMO_MODE: 'scroll' | 'film' = 'scroll';

export function resolveBrandDemoMode(search = window.location.search): 'scroll' | 'film' {
  const override = new URLSearchParams(search).get('demo');
  return override === 'film' || override === 'scroll' ? override : BRAND_DEMO_MODE;
}
