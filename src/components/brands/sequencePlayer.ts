export type SequenceQuality = 'auto' | '4k' | 'lite';
export type SequenceVariant = '4k' | 'desktop' | 'mobile';
const dimensions = { '4k': [3840, 2160], desktop: [1920, 1080], mobile: [1280, 720] } as const;
type Connection = { saveData?: boolean; effectiveType?: string };

/** Fetch only nearby frames. A bounded bitmap cache avoids decoding the entire film. */
export function createSequencePlayer(
  canvas: HTMLCanvasElement,
  options: {
    mobile: boolean; count: number;
    onPaint: (frame: number, waiting: boolean) => void;
    onFailure: () => void;
    onVariant: (variant: SequenceVariant) => void;
  },
) {
  const context = canvas.getContext('2d', { alpha: false });
  if (!context) {
    options.onFailure();
    return { seek: (_frame: number) => {}, resize: () => {}, destroy: () => {}, retry: () => {}, setQuality: (_quality: SequenceQuality) => {}, setActive: (_active: boolean) => {} };
  }
  const connection = (navigator as Navigator & { connection?: Connection }).connection;
  const constrained = connection?.saveData || /(^|-)2g|3g/.test(connection?.effectiveType || '');
  const defaultVariant: SequenceVariant = options.mobile ? 'mobile' : constrained ? 'desktop' : '4k';
  let variant = defaultVariant, quality: SequenceQuality = 'auto';
  const images = new Map<number, ImageBitmap>();
  const pending = new Map<number, AbortController>();
  const failed = new Set<number>();
  let wanted = 0, direction = 1, queue: number[] = [], destroyed = false, active = true;
  let paintFrame = 0, lastPainted = -1, forcePaint = true, generation = 0, slowRequests = 0, resizeAfterLoad = false;
  const clamp = (n: number) => Math.max(0, Math.min(options.count - 1, n));
  const maxDecoded = () => variant === '4k' ? 4 : variant === 'desktop' ? 10 : 14;

  function paint() {
    paintFrame = 0;
    if (destroyed || !active || !images.size) return;
    let nearest = wanted, image = images.get(wanted);
    if (!image) {
      let distance = Infinity;
      for (const [index, candidate] of images) {
        if (Math.abs(index - wanted) < distance) { distance = Math.abs(index - wanted); nearest = index; image = candidate; }
      }
    }
    if (!image) return;
    if (lastPainted !== nearest || forcePaint) {
      const ratio = Math.max(canvas.width / image.width, canvas.height / image.height);
      const width = image.width * ratio, height = image.height * ratio;
      // Draw a crisp frame; crossfading moving silhouettes made the earlier study soft.
      context!.drawImage(image, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height);
      lastPainted = nearest; forcePaint = false;
      canvas.dataset.frame = String(nearest); canvas.dataset.variant = variant;
    }
    options.onPaint(nearest, nearest !== wanted);
  }
  const schedulePaint = () => { if (!paintFrame && !destroyed && active) paintFrame = requestAnimationFrame(paint); };
  function evict() {
    const candidates = [...images.keys()].filter(index => index !== wanted && index !== lastPainted)
      .sort((a, b) => Math.abs(b - wanted) - Math.abs(a - wanted));
    while (images.size > maxDecoded() && candidates.length) {
      const key = candidates.shift()!; images.get(key)?.close(); images.delete(key);
    }
  }
  function pump() {
    if (destroyed || !active) return;
    const concurrency = variant === '4k' ? 2 : 3;
    while (pending.size < concurrency && queue.length) {
      const index = queue.shift()!;
      if (images.has(index) || pending.has(index) || failed.has(index)) continue;
      const controller = new AbortController(), requestGeneration = generation;
      const started = performance.now();
      pending.set(index, controller);
      fetch(`/brands/scroll-sequence/${variant}/frame-${String(index).padStart(4, '0')}.webp?v=2`, { signal: controller.signal, cache: 'force-cache' })
        .then(response => { if (!response.ok) throw new Error(`Frame ${index}: ${response.status}`); return response.blob(); })
        .then(blob => {
          if (destroyed || controller.signal.aborted || requestGeneration !== generation) return;
          return createImageBitmap(blob);
        })
        .then(bitmap => {
          if (!bitmap) return;
          if (destroyed || controller.signal.aborted || requestGeneration !== generation) { bitmap.close(); return; }
          images.set(index, bitmap); evict();
          if (resizeAfterLoad) { resizeAfterLoad = false; resize(); }
          schedulePaint();
          // Auto can fall back on a sustained slow connection. Explicit 4K stays 4K.
          if (quality === 'auto' && variant === '4k') {
            slowRequests = performance.now() - started > 550 ? slowRequests + 1 : 0;
            if (slowRequests >= 3) changeVariant('desktop');
          }
        })
        .catch(error => {
          if (!destroyed && requestGeneration === generation && error.name !== 'AbortError') { failed.add(index); options.onFailure(); }
        })
        .finally(() => { if (pending.get(index) === controller) pending.delete(index); pump(); });
    }
  }
  function refill() {
    const candidates = [wanted];
    const ahead = Math.min(5, maxDecoded() - 2);
    for (let i = 1; i <= ahead; i++) candidates.push(clamp(wanted + i * direction));
    candidates.push(clamp(wanted - direction));
    queue = [...new Set(candidates)].filter(index => !images.has(index) && !pending.has(index) && !failed.has(index));
    // Fast jumps must not wait behind downloads for a scene the visitor has left.
    for (const [index, controller] of pending) {
      if (Math.abs(index - wanted) > maxDecoded() * 3) { controller.abort(); pending.delete(index); }
    }
    pump(); schedulePaint();
  }
  function seek(frame: number) {
    const next = clamp(Math.round(frame));
    if (next !== wanted) { direction = next > wanted ? 1 : -1; wanted = next; refill(); }
    else schedulePaint();
  }
  function resize() {
    const bounds = canvas.getBoundingClientRect();
    const [width, height] = dimensions[variant];
    // Honour Retina/4K screens without inflating the canvas beyond source detail.
    const ratio = Math.min(window.devicePixelRatio || 1, width / Math.max(1, bounds.width), height / Math.max(1, bounds.height));
    canvas.width = Math.max(1, Math.round(bounds.width * ratio)); canvas.height = Math.max(1, Math.round(bounds.height * ratio));
    context!.imageSmoothingEnabled = true; context!.imageSmoothingQuality = 'high';
    forcePaint = true; schedulePaint();
  }
  function changeVariant(next: SequenceVariant) {
    if (next === variant) return;
    generation++; pending.forEach(controller => controller.abort()); pending.clear(); queue = [];
    images.forEach(image => image.close()); images.clear(); failed.clear();
    variant = next; lastPainted = -1; slowRequests = 0; resizeAfterLoad = true;
    // Keep the existing canvas visible until a frame at the new quality arrives.
    options.onVariant(variant); refill();
  }
  const observer = new ResizeObserver(resize); observer.observe(canvas);
  options.onVariant(variant); resize(); refill();
  return {
    seek, resize,
    retry: () => { failed.clear(); refill(); },
    setQuality: (next: SequenceQuality) => { quality = next; changeVariant(next === '4k' ? '4k' : next === 'lite' ? options.mobile ? 'mobile' : 'desktop' : defaultVariant); },
    setActive: (next: boolean) => {
      if (active === next) return;
      active = next;
      if (active) refill();
      else {
        pending.forEach(controller => controller.abort()); pending.clear(); queue = []; cancelAnimationFrame(paintFrame); paintFrame = 0;
        images.forEach((image, index) => { if (index !== lastPainted) { image.close(); images.delete(index); } });
      }
    },
    destroy: () => {
      destroyed = true; generation++; pending.forEach(controller => controller.abort()); pending.clear();
      observer.disconnect(); cancelAnimationFrame(paintFrame); images.forEach(image => image.close()); images.clear(); queue = [];
    },
  };
}
