import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 240;
const FRAME_BASE_URL = "https://dev.heyharoon.io/scene3/samples_frames/frame";

const Scene3Test = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedCount, setLoadedCount] = useState(0);
  const frameIndexRef = useRef({ value: 0 });

  // Preload all images
  useEffect(() => {
    const loadImages = async () => {
      const imageArray: (HTMLImageElement | null)[] = new Array(TOTAL_FRAMES).fill(null);
      
      console.log(`\n========== SCENE 3: STARTING FRAME LOAD ==========`);
      console.log(`Total frames to load: ${TOTAL_FRAMES}`);
      console.log(`Base URL: ${FRAME_BASE_URL}`);
      
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
              console.warn(`Scene 3: Failed to load frame${frameNum}.jpg`);
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
      setIsLoading(false);
      
      console.log(`\n========== SCENE 3: FRAME LOADING COMPLETE ==========`);
      console.log(`✓ Successfully loaded: ${validImages.length}/${TOTAL_FRAMES} frames`);
      console.log(`=============================================\n`);
    };

    loadImages();
  }, []);

  // Setup GSAP animation after images load
  useEffect(() => {
    if (isLoading || images.length === 0) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      renderFrame(Math.round(frameIndexRef.current.value));
    };

    const renderFrame = (index: number) => {
      const frameIndex = Math.min(Math.max(index, 0), images.length - 1);
      const img = images[frameIndex];
      if (!img || !ctx) return;

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
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Render first frame immediately
    renderFrame(0);

    // Calculate scroll distance
    const scrollPerFrame = 10;
    const totalScrollDistance = images.length * scrollPerFrame;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: `+=${totalScrollDistance}`,
        pin: true,
        pinSpacing: true,
        scrub: 0.5,
        anticipatePin: 1,
        onLeave: () => {
          renderFrame(images.length - 1);
        },
        onLeaveBack: () => {
          renderFrame(0);
        },
        onEnterBack: () => {
          renderFrame(images.length - 1);
        },
        onRefresh: () => {
          renderFrame(Math.round(frameIndexRef.current.value));
        },
      },
    });

    tl.to(frameIndexRef.current, {
      value: images.length - 1,
      ease: "none",
      onUpdate: () => {
        renderFrame(Math.round(frameIndexRef.current.value));
      },
    });

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      // Only kill triggers for this specific container
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === container) {
          trigger.kill();
        }
      });
    };
  }, [isLoading, images]);

  const loadingProgress = Math.round((loadedCount / TOTAL_FRAMES) * 100);

  return (
    <div className="min-h-screen bg-background">
      <div
        ref={containerRef}
        className="relative h-screen w-full overflow-hidden bg-background"
      >
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background">
            <h2 className="font-display text-lg tracking-[0.3em] text-foreground/60">
              LOADING SCENE 3
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
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full"
          />
        )}
      </div>
      
      {/* Content after animation */}
      <div className="h-screen flex items-center justify-center bg-background">
        <p className="text-2xl text-foreground/60 font-display tracking-widest">
          END OF SCENE 3
        </p>
      </div>
    </div>
  );
};

export default Scene3Test;
