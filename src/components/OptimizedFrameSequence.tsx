import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Configuration
const TOTAL_VIRTUAL_FRAMES = 250;
const FRAME_SKIP = 5; // Load every 5th frame (50 frames total)
const INITIAL_FRAMES = [1, 6, 11, 16, 21, 26, 31, 36]; // First 8 key frames for instant display
const FRAME_BASE_URL = "https://dev.heyharoon.io/frames1/samples_frames/frame";

// Calculate which actual frames to load (every Nth frame)
const FRAMES_TO_LOAD = Array.from(
  { length: Math.ceil(TOTAL_VIRTUAL_FRAMES / FRAME_SKIP) },
  (_, i) => i * FRAME_SKIP + 1
).filter(f => f <= TOTAL_VIRTUAL_FRAMES);

interface LoadMetrics {
  initialLoadTime: number;
  firstPaintTime: number;
  totalLoadTime: number;
  framesLoaded: number;
  totalFrames: number;
}

interface OptimizedFrameSequenceProps {
  onMetrics?: (metrics: LoadMetrics) => void;
}

const OptimizedFrameSequence = ({ onMetrics }: OptimizedFrameSequenceProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameMapRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const frameIndexRef = useRef({ value: 0 });
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(performance.now());
  
  const [isInitialReady, setIsInitialReady] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [metrics, setMetrics] = useState<LoadMetrics | null>(null);

  // Get the nearest loaded frame for a virtual frame index
  const getNearestFrames = useCallback((virtualIndex: number): { lower: number; upper: number; t: number } => {
    const frameMap = frameMapRef.current;
    const sortedFrames = Array.from(frameMap.keys()).sort((a, b) => a - b);
    
    if (sortedFrames.length === 0) return { lower: 1, upper: 1, t: 0 };
    
    const targetFrame = virtualIndex + 1; // Convert to 1-indexed
    
    let lower = sortedFrames[0];
    let upper = sortedFrames[0];
    
    for (const frame of sortedFrames) {
      if (frame <= targetFrame) lower = frame;
      if (frame >= targetFrame) {
        upper = frame;
        break;
      }
      upper = frame;
    }
    
    const t = upper === lower ? 0 : (targetFrame - lower) / (upper - lower);
    return { lower, upper, t };
  }, []);

  // Render frame with interpolation
  const renderFrame = useCallback((virtualIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const frameMap = frameMapRef.current;
    const { lower, upper, t } = getNearestFrames(virtualIndex);
    
    const lowerImg = frameMap.get(lower);
    const upperImg = frameMap.get(upper);
    
    if (!lowerImg && !upperImg) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw the lower frame
    const img = t < 0.5 ? (lowerImg || upperImg) : (upperImg || lowerImg);
    if (!img) return;
    
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
    
    // If we have both frames and they're different, do a crossfade
    if (lowerImg && upperImg && lower !== upper && t > 0 && t < 1) {
      // Draw lower frame
      ctx.globalAlpha = 1 - t;
      const lowerRatio = lowerImg.width / lowerImg.height;
      let lw, lh, lx, ly;
      if (canvasRatio > lowerRatio) {
        lw = canvas.width;
        lh = canvas.width / lowerRatio;
        lx = 0;
        ly = (canvas.height - lh) / 2;
      } else {
        lh = canvas.height;
        lw = canvas.height * lowerRatio;
        lx = (canvas.width - lw) / 2;
        ly = 0;
      }
      ctx.drawImage(lowerImg, lx, ly, lw, lh);
      
      // Draw upper frame with fade
      ctx.globalAlpha = t;
      const upperRatio = upperImg.width / upperImg.height;
      let uw, uh, ux, uy;
      if (canvasRatio > upperRatio) {
        uw = canvas.width;
        uh = canvas.width / upperRatio;
        ux = 0;
        uy = (canvas.height - uh) / 2;
      } else {
        uh = canvas.height;
        uw = canvas.height * upperRatio;
        ux = (canvas.width - uw) / 2;
        uy = 0;
      }
      ctx.drawImage(upperImg, ux, uy, uw, uh);
      
      ctx.globalAlpha = 1;
    } else {
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    }
  }, [getNearestFrames]);

  // Load a single frame
  const loadFrame = useCallback((frameNum: number): Promise<HTMLImageElement | null> => {
    return new Promise((resolve) => {
      if (frameMapRef.current.has(frameNum)) {
        resolve(frameMapRef.current.get(frameNum)!);
        return;
      }
      
      const img = new Image();
      img.crossOrigin = "anonymous";
      
      img.onload = () => {
        frameMapRef.current.set(frameNum, img);
        resolve(img);
      };
      
      img.onerror = () => {
        console.warn(`Failed to load frame ${frameNum}`);
        resolve(null);
      };
      
      img.src = `${FRAME_BASE_URL}${frameNum}.jpg`;
    });
  }, []);

  // Phase 1: Load initial frames for instant display
  useEffect(() => {
    const loadInitialFrames = async () => {
      console.log("Phase 1: Loading initial frames...", INITIAL_FRAMES);
      
      const promises = INITIAL_FRAMES.map(frameNum => loadFrame(frameNum));
      await Promise.all(promises);
      
      const firstPaintTime = performance.now() - startTimeRef.current;
      console.log(`✓ Initial frames loaded in ${firstPaintTime.toFixed(0)}ms`);
      
      // Setup canvas
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        renderFrame(0);
      }
      
      setIsInitialReady(true);
      setLoadProgress(INITIAL_FRAMES.length / FRAMES_TO_LOAD.length * 100);
    };
    
    loadInitialFrames();
  }, [loadFrame, renderFrame]);

  // Phase 2: Progressive loading of remaining frames
  useEffect(() => {
    if (!isInitialReady) return;
    
    const loadRemainingFrames = async () => {
      console.log("Phase 2: Loading remaining frames progressively...");
      
      const remainingFrames = FRAMES_TO_LOAD.filter(f => !INITIAL_FRAMES.includes(f));
      const BATCH_SIZE = 5;
      
      for (let i = 0; i < remainingFrames.length; i += BATCH_SIZE) {
        const batch = remainingFrames.slice(i, i + BATCH_SIZE);
        await Promise.all(batch.map(frameNum => loadFrame(frameNum)));
        
        const loaded = INITIAL_FRAMES.length + i + batch.length;
        setLoadProgress((loaded / FRAMES_TO_LOAD.length) * 100);
        
        // Re-render current frame with new loaded frames
        renderFrame(Math.round(frameIndexRef.current.value));
        
        // Small delay to prevent blocking
        await new Promise(r => setTimeout(r, 10));
      }
      
      const totalLoadTime = performance.now() - startTimeRef.current;
      const firstPaintTime = totalLoadTime * (INITIAL_FRAMES.length / FRAMES_TO_LOAD.length);
      
      const loadMetrics: LoadMetrics = {
        initialLoadTime: firstPaintTime,
        firstPaintTime: firstPaintTime,
        totalLoadTime,
        framesLoaded: frameMapRef.current.size,
        totalFrames: FRAMES_TO_LOAD.length,
      };
      
      setMetrics(loadMetrics);
      onMetrics?.(loadMetrics);
      
      console.log(`✓ All frames loaded in ${totalLoadTime.toFixed(0)}ms`);
      console.log(`  Frames loaded: ${frameMapRef.current.size}/${FRAMES_TO_LOAD.length}`);
    };
    
    loadRemainingFrames();
  }, [isInitialReady, loadFrame, renderFrame, onMetrics]);

  // Setup GSAP scroll animation
  useEffect(() => {
    if (!isInitialReady) return;
    
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    
    // Resize handler
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      renderFrame(Math.round(frameIndexRef.current.value));
    };
    
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    
    // Animation loop with RAF
    let lastRenderTime = 0;
    const animate = (time: number) => {
      if (time - lastRenderTime > 16) { // ~60fps
        renderFrame(Math.round(frameIndexRef.current.value));
        lastRenderTime = time;
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    
    // GSAP ScrollTrigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "+=300%",
        pin: true,
        scrub: 0.5,
        anticipatePin: 1,
      },
    });
    
    tl.to(frameIndexRef.current, {
      value: TOTAL_VIRTUAL_FRAMES - 1,
      ease: "none",
    });
    
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === container) {
          trigger.kill();
        }
      });
    };
  }, [isInitialReady, renderFrame]);

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-background"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
      />
      
      {/* Subtle loading indicator */}
      {loadProgress < 100 && isInitialReady && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-2 bg-background/80 backdrop-blur-sm rounded-full">
          <div className="w-2 h-2 rounded-full bg-foreground/50 animate-pulse" />
          <span className="text-xs font-mono text-foreground/60">
            Enhancing... {Math.round(loadProgress)}%
          </span>
        </div>
      )}
      
      {/* Initial loading state (only shows briefly) */}
      {!isInitialReady && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-2 border-muted" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-foreground animate-spin" />
          </div>
          <p className="font-display text-sm tracking-[0.2em] text-foreground/70">
            Preparing experience
          </p>
        </div>
      )}
    </div>
  );
};

export default OptimizedFrameSequence;
