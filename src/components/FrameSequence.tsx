import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import vpoHeroBg from "@/assets/vpo-hero-bg.jpeg";
import VersionSelector from "./VersionSelector";

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 226;
const FRAME_BASE_URL = "https://dev.heyharoon.io/frames1/samples_frames/frame";

const LOADING_MESSAGES = [
  "Curating your experience",
  "Cleaning walkways",
  "Taking you to premium outlets",
  "Preparing exclusive collections",
  "Setting the ambiance",
];

type ViewMode = 'select' | 'premium' | 'lite';

const FrameSequence = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [failedFrames, setFailedFrames] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('select');
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);
  const frameIndexRef = useRef({ value: 0 });

  // Rotate loading messages
  useEffect(() => {
    if (!isLoading || viewMode !== 'premium') return;
    
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % LOADING_MESSAGES.length;
      setLoadingMessage(LOADING_MESSAGES[index]);
    }, 2500);
    
    return () => clearInterval(interval);
  }, [isLoading, viewMode]);

  // Handle version selection
  const handleVersionSelect = (version: 'premium' | 'lite') => {
    setViewMode(version);
    if (version === 'lite') {
      setIsLoading(false);
    }
  };

  // Preload all images with batching for better performance (only in premium mode)
  useEffect(() => {
    if (viewMode !== 'premium') return;
    
    const loadImages = async () => {
      const imageArray: (HTMLImageElement | null)[] = new Array(TOTAL_FRAMES).fill(null);
      const failed: number[] = [];
      
      console.log(`\n========== STARTING FRAME LOAD ==========`);
      console.log(`Total frames to load: ${TOTAL_FRAMES}`);
      console.log(`Base URL: ${FRAME_BASE_URL}`);
      console.log(`=========================================\n`);
      
      // Load in batches for better performance
      const BATCH_SIZE = 10;
      
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
              console.log(`✓ Loaded frame${frameNum}.jpg`);
              resolve();
            };
            
            img.onerror = () => {
              failed.push(frameNum);
              setLoadedCount((prev) => prev + 1);
              setFailedFrames((prev) => [...prev, frameNum]);
              console.warn(`✗ Failed to load frame${frameNum}.jpg`);
              resolve();
            };
            
            img.src = frameUrl;
          });
          batchPromises.push(promise);
        }
        
        await Promise.all(batchPromises);
      }
      
      // Filter out null (failed) images while maintaining order
      const validImages = imageArray.filter((img): img is HTMLImageElement => img !== null);
      setImages(validImages);
      setIsLoading(false);
      
      console.log(`\n========== FRAME LOADING COMPLETE ==========`);
      console.log(`✓ Successfully loaded: ${validImages.length}/${TOTAL_FRAMES} frames`);
      if (failed.length > 0) {
        console.log(`✗ Failed frames (${failed.length}): ${failed.join(', ')}`);
      }
      console.log(`=============================================\n`);
    };

    loadImages();
  }, [viewMode]);

  // Setup GSAP animation after images load (premium mode only)
  useEffect(() => {
    if (viewMode !== 'premium' || isLoading || images.length === 0) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
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

      // Calculate dimensions to cover the canvas while maintaining aspect ratio
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

    // Create the scroll animation with smooth scrubbing
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "+=300%",
        pin: true,
        scrub: 1.5, // Smoother scrubbing
        anticipatePin: 1,
        onLeave: () => {
          // Lock final frame when scrolling past
          renderFrame(images.length - 1);
        },
        onLeaveBack: () => {
          // Lock first frame when scrolling back past start
          renderFrame(0);
        },
        onEnterBack: () => {
          // Re-render last frame when scrolling back into animation
          renderFrame(Math.round(frameIndexRef.current.value));
        },
        onRefresh: () => {
          // Re-render current frame during layout recalculation
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
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === container) {
          trigger.kill();
        }
      });
    };
  }, [viewMode, isLoading, images]);

  const loadingProgress = Math.round((loadedCount / TOTAL_FRAMES) * 100);

  // Show version selector
  if (viewMode === 'select') {
    return <VersionSelector onSelect={handleVersionSelect} />;
  }

  // Lite mode - skip directly to hero section
  if (viewMode === 'lite') {
    return (
      <section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background"
      >
        <img 
          src={vpoHeroBg} 
          alt="" 
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          decoding="sync"
        />
      </section>
    );
  }

  // Premium mode
  return (
    <div className="relative z-0 overflow-hidden">
      <div
        ref={containerRef}
        className="relative h-screen w-full overflow-hidden bg-background"
      >
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-background">
            <div className="grain-overlay" />
            
            {/* Spinning loader */}
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-2 border-muted" />
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-foreground animate-spin" />
            </div>
            
            {/* Rotating premium message */}
            <p className="font-display text-lg tracking-[0.2em] text-foreground/90 transition-opacity duration-500">
              {loadingMessage}
            </p>
            
            {/* Progress bar */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative h-[2px] w-48 overflow-hidden bg-muted">
                <div
                  className="absolute inset-y-0 left-0 bg-foreground/70 transition-all duration-150 ease-out"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
              <p className="font-mono text-xs text-muted-foreground/60 tracking-wider">
                {loadingProgress}%
              </p>
            </div>
          </div>
        ) : images.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background">
            <p className="font-mono text-lg text-red-500">No frames loaded</p>
            <p className="font-mono text-sm text-muted-foreground max-w-md text-center">
              Unable to load frames. Check console for details.
            </p>
          </div>
        ) : (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full"
          />
        )}
      </div>

      {/* Hero section with background image */}
      {!isLoading && images.length > 0 && (
        <section 
          className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050505]"
        >
          <img 
            src={vpoHeroBg} 
            alt="" 
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
            decoding="sync"
          />
        </section>
      )}
    </div>
  );
};

export default FrameSequence;
