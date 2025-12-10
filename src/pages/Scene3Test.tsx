import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FRAME_BASE_URL = 'http://dev.heyharoon.io/scene3/samples_frames/';
const START_FRAME = 11;
const END_FRAME = 240;
const TOTAL_FRAMES = END_FRAME - START_FRAME + 1; // 230 frames

const Scene3Test = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedCount, setLoadedCount] = useState(0);
  const frameIndexRef = useRef({ value: 0 });

  // Preload all frames
  useEffect(() => {
    const loadImages = async () => {
      const loadedImages: HTMLImageElement[] = [];
      let loaded = 0;

      const batchSize = 10;
      for (let i = START_FRAME; i <= END_FRAME; i += batchSize) {
        const batch = [];
        for (let j = i; j < Math.min(i + batchSize, END_FRAME + 1); j++) {
          batch.push(
            new Promise<HTMLImageElement | null>((resolve) => {
              const img = new Image();
              img.crossOrigin = 'anonymous';
              img.onload = () => {
                loaded++;
                setLoadedCount(loaded);
                resolve(img);
              };
              img.onerror = () => {
                console.warn(`Failed to load frame${j}.jpg`);
                loaded++;
                setLoadedCount(loaded);
                resolve(null);
              };
              img.src = `${FRAME_BASE_URL}frame${j}.jpg`;
            })
          );
        }
        const results = await Promise.all(batch);
        results.forEach((img) => {
          if (img) loadedImages.push(img);
        });
      }

      console.log(`Scene 3: Loaded ${loadedImages.length} frames`);
      setImages(loadedImages);
      setIsLoading(false);
    };

    loadImages();
  }, []);

  // Setup GSAP animation
  useEffect(() => {
    if (isLoading || images.length === 0) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();

    const renderFrame = (index: number) => {
      const frameIndex = Math.min(Math.max(0, Math.round(index)), images.length - 1);
      const img = images[frameIndex];
      if (!img || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
      const x = (canvas.width - img.width * scale) / 2;
      const y = (canvas.height - img.height * scale) / 2;

      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
    };

    renderFrame(0);

    const scrollPerFrame = 4;
    const totalScrollDistance = images.length * scrollPerFrame;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: `+=${totalScrollDistance}`,
        pin: true,
        scrub: 1.5,
        onUpdate: (self) => {
          const frameIndex = Math.round(self.progress * (images.length - 1));
          renderFrame(frameIndex);
          frameIndexRef.current.value = frameIndex;
        },
        onLeave: () => renderFrame(images.length - 1),
        onLeaveBack: () => renderFrame(0),
        onEnterBack: () => renderFrame(images.length - 1),
        onRefresh: () => renderFrame(frameIndexRef.current.value),
      },
    });

    tl.to(frameIndexRef.current, {
      value: images.length - 1,
      ease: 'none',
    });

    const handleResize = () => {
      setCanvasSize();
      renderFrame(frameIndexRef.current.value);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === container) {
          trigger.kill();
        }
      });
    };
  }, [isLoading, images]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <div className="w-16 h-16 border-2 border-white/20 border-t-white rounded-full animate-spin mb-8" />
        <p className="text-sm tracking-widest uppercase opacity-60">
          Loading Scene 3... {loadedCount}/{TOTAL_FRAMES}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-black">
      <div ref={containerRef} className="relative w-full h-screen overflow-hidden">
        {images.length > 0 ? (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-white">
            Scene unavailable
          </div>
        )}
      </div>

      {/* Content after animation */}
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white/60 text-lg tracking-wider">
          Scene 3 Complete
        </p>
      </div>
    </div>
  );
};

export default Scene3Test;
