import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import vpoHeroBg from "@/assets/vpo-hero-bg.jpeg";

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 226;
const FRAME_BASE_URL = "https://dev.heyharoon.io/frames1/samples_frames/frame";

const FrameSequence = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentLoadingFrame, setCurrentLoadingFrame] = useState("");
  const [loadLog, setLoadLog] = useState<string[]>([]);
  const [failedFrames, setFailedFrames] = useState<number[]>([]);
  const frameIndexRef = useRef({ value: 0 });

  // Preload all images with batching for better performance
  useEffect(() => {
    const loadImages = async () => {
      const imageArray: (HTMLImageElement | null)[] = new Array(TOTAL_FRAMES).fill(null);
      const failed: number[] = [];
      
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
            setCurrentLoadingFrame(`frame${frameNum}.jpg`);
            
            img.onload = () => {
              imageArray[i] = img;
              setLoadedCount((prev) => prev + 1);
              setLoadLog((prev) => [...prev.slice(-19), `✓ frame${frameNum}.jpg loaded`]);
              console.log(`✓ Loaded frame${frameNum}.jpg`);
              resolve();
            };
            
            img.onerror = () => {
              failed.push(frameNum);
              setLoadedCount((prev) => prev + 1);
              setFailedFrames((prev) => [...prev, frameNum]);
              setLoadLog((prev) => [...prev.slice(-19), `✗ frame${frameNum}.jpg failed`]);
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
        console.log(`✗ Failed frames: ${failed.join(', ')}`);
      }
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
        scrub: 1, // Smoother scrubbing
        anticipatePin: 1,
      },
    });

    tl.to(frameIndexRef.current, {
      value: images.length - 1, // Use actual loaded count
      ease: "none",
      onUpdate: () => {
        renderFrame(Math.round(frameIndexRef.current.value));
      },
    });

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [isLoading, images]);

  const loadingProgress = Math.round((loadedCount / TOTAL_FRAMES) * 100);

  return (
    <>
      <div
        ref={containerRef}
        className="relative h-screen w-full overflow-hidden bg-background"
      >
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background">
            <div className="relative h-1 w-64 overflow-hidden rounded-full bg-muted">
              <div
                className="absolute inset-y-0 left-0 bg-foreground transition-all duration-150 ease-out"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <p className="font-mono text-sm text-muted-foreground">
              Loading frames... {loadedCount}/{TOTAL_FRAMES} ({loadingProgress}%)
            </p>
            <p className="font-mono text-xs text-muted-foreground/60">
              Current: {currentLoadingFrame}
            </p>
            <div className="mt-4 w-96 h-64 overflow-y-auto rounded bg-muted/30 p-3 font-mono text-xs">
              <p className="text-foreground/80 mb-2 font-semibold">Frame Loading Log:</p>
              <div className="space-y-0.5">
                {loadLog.map((log, i) => (
                  <p key={i} className={log.startsWith("✓") ? "text-green-500" : "text-red-500"}>
                    {log}
                  </p>
                ))}
                {loadLog.length === 0 && <p className="text-muted-foreground/50">Initializing...</p>}
              </div>
            </div>
            {failedFrames.length > 0 && (
              <p className="font-mono text-xs text-red-400">
                Failed: {failedFrames.length} frames
              </p>
            )}
          </div>
        ) : images.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background">
            <p className="font-mono text-lg text-red-500">No frames loaded</p>
            <p className="font-mono text-sm text-muted-foreground max-w-md text-center">
              Unable to load frames. Check console for details.
            </p>
            <div className="mt-4 w-96 h-64 overflow-y-auto rounded bg-muted/30 p-3 font-mono text-xs">
              <p className="text-foreground/80 mb-2 font-semibold">Debug Log:</p>
              {loadLog.map((log, i) => (
                <p key={i} className={log.startsWith("✓") ? "text-green-500" : "text-red-500"}>
                  {log}
                </p>
              ))}
            </div>
          </div>
        ) : (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full"
          />
        )}
      </div>

      {/* Hero section with background image */}
      <section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url(${vpoHeroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
    </>
  );
};

export default FrameSequence;
