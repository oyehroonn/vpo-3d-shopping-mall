/** Bounded decoder: frames keep their original indices even when a request fails. */
export function createSequencePlayer(
  canvas: HTMLCanvasElement,
  options: { mobile: boolean; count: number; onPaint: (frame: number, waiting: boolean) => void; onFailure: () => void },
) {
  const context = canvas.getContext('2d', { alpha: false });
  if (!context) { options.onFailure(); return { seek: (_frame: number) => {}, resize: () => {}, destroy: () => {}, retry: () => {} }; }
  const images = new Map<number, ImageBitmap>();
  const pending = new Set<number>();
  const failed = new Set<number>();
  const abort = new AbortController();
  const anchors = [0, 144, 312, 480, 584, options.count - 1];
  const maxDecoded = options.mobile ? 16 : 14;
  let wanted = 0, queue: number[] = [], destroyed = false, paintFrame = 0, lastPainted = -1;
  const clamp = (n: number) => Math.max(0, Math.min(options.count - 1, n));

  function draw(image: ImageBitmap, alpha = 1) {
    const ratio = Math.max(canvas.width / image.width, canvas.height / image.height);
    const w = image.width * ratio, h = image.height * ratio;
    context!.globalAlpha = alpha;
    context!.drawImage(image, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
  }
  function paint() {
    paintFrame = 0;
    if (destroyed) return;
    const low = Math.floor(wanted), high = Math.ceil(wanted);
    const first = images.get(low), next = images.get(high);
    if (first) {
      draw(first);
      if (next && high !== low) draw(next, wanted - low);
      context!.globalAlpha = 1;
      lastPainted = low;
      options.onPaint(wanted, false);
    } else if (images.size) {
      let nearest = -1, distance = Infinity;
      for (const index of images.keys()) if (Math.abs(index - wanted) < distance) { distance = Math.abs(index - wanted); nearest = index; }
      draw(images.get(nearest)!);
      lastPainted = nearest;
      options.onPaint(nearest, true);
    }
  }
  const schedulePaint = () => { if (!paintFrame && !destroyed) paintFrame = requestAnimationFrame(paint); };
  function evict() {
    const candidates = [...images.keys()].filter(i => i !== lastPainted && !anchors.includes(i))
      .sort((a, b) => Math.abs(b - wanted) - Math.abs(a - wanted));
    while (images.size > maxDecoded && candidates.length) {
      const key = candidates.shift()!; images.get(key)?.close(); images.delete(key);
    }
  }
  function pump() {
    if (destroyed) return;
    while (pending.size < 4 && queue.length) {
      const index = queue.shift()!;
      if (images.has(index) || pending.has(index) || failed.has(index)) continue;
      pending.add(index);
      const size = options.mobile ? 'mobile' : 'desktop';
      fetch(`/brands/scroll-sequence/${size}/frame-${String(index).padStart(4, '0')}.webp`, { signal: abort.signal, cache: 'force-cache' })
        .then(response => { if (!response.ok) throw new Error(`Frame ${index}: ${response.status}`); return response.blob(); })
        .then(blob => createImageBitmap(blob))
        .then(bitmap => {
          if (destroyed) { bitmap.close(); return; }
          images.set(index, bitmap); evict(); schedulePaint();
        })
        .catch(error => { if (!destroyed && error.name !== 'AbortError') { failed.add(index); options.onFailure(); } })
        .finally(() => { pending.delete(index); pump(); });
    }
  }
  function seek(frame: number) {
    const previous = wanted;
    wanted = Math.max(0, Math.min(options.count - 1, frame));
    const center = Math.floor(wanted), direction = wanted >= previous ? 1 : -1;
    const candidates = [center, clamp(center + 1)];
    // Close frames first, then a short directional buffer. No full-sequence decode.
    for (let i = 1; i <= 3; i++) candidates.push(clamp(center + i * direction), clamp(center - i * direction));
    candidates.push(...anchors);
    queue = [...new Set(candidates)].filter(i => !images.has(i) && !pending.has(i) && !failed.has(i));
    pump(); schedulePaint();
  }
  function resize() {
    const bounds = canvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, options.mobile ? 2 : 1.5);
    canvas.width = Math.max(1, Math.round(bounds.width * ratio)); canvas.height = Math.max(1, Math.round(bounds.height * ratio));
    schedulePaint();
  }
  const observer = new ResizeObserver(resize); observer.observe(canvas); resize(); seek(0);
  return {
    seek, resize,
    retry: () => { failed.clear(); seek(wanted); },
    destroy: () => { destroyed = true; abort.abort(); observer.disconnect(); cancelAnimationFrame(paintFrame); images.forEach(image => image.close()); images.clear(); queue = []; },
  };
}
