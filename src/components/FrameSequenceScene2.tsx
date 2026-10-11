import { useEffect, useLayoutEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 250;
const FRAME_BASE_URL = "https://dev.heyharoon.io/scene2/samples_frames/frame";
const SCROLL_VIEWPORTS = 3;

const FrameSequenceScene2 = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedCount, setLoadedCount] = useState(0);
  const frameIndexRef = useRef(0);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  // Preload all images
  useEffect(() => {
    const loadImages = async () => {
      const imageArray: (HTMLImageElement | null)[] = new Array(TOTAL_FRAMES).fill(null);
      
      console.log(`\n========== SCENE 2: STARTING FRAME LOAD ==========`);
      console.log(`Total frames to load: ${TOTAL_FRAMES}`);
      
      const BATCH_SIZE = 15;
      
      for (let batch = 0; batch < Math.ceil(TOTAL_FRAMES / BATCH_SIZE); batch++) {
        const batchPromises: Promise<void>[] = [];
        const startIdx = batch * BATCH_SIZE;
        const endIdx = Math.min(startIdx + BATCH_SIZE, TOTAL_FRAMES);
        
        for (let i = startIdx; i < endIdx; i++) {
          const frameNum = i + 1;
          const promise = new Promise<void>((resolve) => {
            const img = new Image();
            const frameUrl = `${FRAME_BASE_URL}${frameNum}.jpg`;
            img.crossOrigin = "anonymous";
            
            img.onload = () => {
              imageArray[i] = img;
              setLoadedCount((prev) => prev + 1);
              resolve();
            };
            
            img.onerror = () => {
              setLoadedCount((prev) => prev + 1);
              console.warn(`Scene2: Failed to load frame${frameNum}.jpg`);
              resolve();
            };
            
            img.src = frameUrl;
          });
          batchPromises.push(promise);
        }
        
        await Promise.all(batchPromises);
      }
      
      const validImages = imageArray.filter((img): img is HTMLImageElement => img !== null);
      setImages(validImages);
      imagesRef.current = validImages;
      setIsLoading(false);
      
      console.log(`Scene 2: Loaded ${validImages.length}/${TOTAL_FRAMES} frames`);
    };

    loadImages();
  }, []);

  const renderFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const section = sectionRef.current;
    if (!canvas || !container || !section) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imgs = imagesRef.current;
    if (imgs.length === 0) return;

    const frameIndex = Math.min(Math.max(index, 0), imgs.length - 1);
    const img = imgs[frameIndex];
    if (!img) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const imgRatio = img.width / img.height;
    const canvasRatio = canvas.width / canvas.height;

    let drawWidth, drawHeight, offsetX, offsetY;

    if (canvasRatio > imgRatio) {
      drawWidth = canvas.width;
      drawHeight = canvas.width / imgRatio;
      offsetX = 0;
      offsetY = (canvas.height - drawHeight) / 2;
    } else {
      drawHeight = canvas.height;
      drawWidth = canvas.height * imgRatio;
      offsetX = (canvas.width - drawWidth) / 2;
      offsetY = 0;
    }

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }, []);

  // Pin only once the entire scene has reached the viewport. Native scrolling
  // drives the frames for wheel, touch, keyboard, and scrollbar input alike.
  useLayoutEffect(() => {
    if (isLoading || images.length === 0) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resizeCanvas = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      renderFrame(frameIndexRef.current);
    };

    const updateFrame = (progress: number) => {
      const nextFrame = Math.round(progress * (images.length - 1));
      if (nextFrame === frameIndexRef.current) return;
      frameIndexRef.current = nextFrame;
      renderFrame(nextFrame);
    };

    resizeCanvas();

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: () => `+=${window.innerHeight * SCROLL_VIEWPORTS}`,
      pin: container,
      pinSpacing: true,
      // The first scene can finish loading and create its pin after this one.
      // Measure this scene after that upstream pin during every refresh.
      refreshPriority: -1,
      onUpdate: (self) => updateFrame(self.progress),
      onRefresh: (self) => {
        updateFrame(self.progress);
        resizeCanvas();
      },
    });

    // Include the new pin spacing in the page's other scroll calculations.
    ScrollTrigger.refresh();

    return () => {
      trigger.kill();
    };
  }, [isLoading, images, renderFrame]);

  const loadingProgress = Math.round((loadedCount / TOTAL_FRAMES) * 100);

  return (
    <div ref={sectionRef} className="relative z-0">
      <div
        ref={containerRef}
        className="relative h-screen w-full overflow-hidden bg-background"
      >
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background">
            <h2 className="font-display text-lg tracking-[0.3em] text-foreground/60">
              LOADING SCENE
            </h2>
            <div className="relative h-1 w-48 overflow-hidden rounded-full bg-muted">
              <div
                className="absolute inset-y-0 left-0 bg-foreground/60 transition-all duration-150 ease-out"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <p className="font-mono text-xs text-muted-foreground">
              {loadedCount}/{TOTAL_FRAMES} ({loadingProgress}%)
            </p>
          </div>
        ) : images.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center bg-background">
            <p className="font-mono text-sm text-muted-foreground">Scene unavailable</p>
          </div>
        ) : (
          <>
            <canvas
              ref={canvasRef}
              className="absolute inset-0 h-full w-full"
            />
            <div className="pointer-events-none absolute bottom-8 left-1/2 z-20 -translate-x-1/2">
              <span className="font-sans text-[10px] tracking-[0.25em] text-foreground/50 uppercase">
                Scroll to explore
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FrameSequenceScene2;
