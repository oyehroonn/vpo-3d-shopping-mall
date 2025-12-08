import { useEffect, useRef, useState, useCallback } from "react";

const TOTAL_FRAMES = 250;
const FRAME_BASE_URL = "https://dev.heyharoon.io/scene2/samples_frames/frame";

interface ExperienceContainerProps {
  className?: string;
  showLabel?: boolean;
  labelText?: string;
  isPrimary?: boolean; // Only the first/primary container loads frames
}

const ExperienceContainer = ({ 
  className = "", 
  showLabel = true,
  labelText = "Store Interior",
  isPrimary = false
}: ExperienceContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const frameIndexRef = useRef(0);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  // Preload all images - ONLY for primary container
  useEffect(() => {
    if (!isPrimary) {
      setIsLoading(false);
      return;
    }

    const loadImages = async () => {
      const imageArray: (HTMLImageElement | null)[] = new Array(TOTAL_FRAMES).fill(null);
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
    };

    loadImages();
  }, [isPrimary]);

  const renderFrame = useCallback((index: number) => {
    if (!isPrimary) return;
    
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    
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
  }, [isPrimary]);

  // Setup canvas and wheel-based animation - ONLY for primary
  useEffect(() => {
    if (!isPrimary || isLoading || images.length === 0) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      renderFrame(frameIndexRef.current);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    renderFrame(0);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [isPrimary, isLoading, images, renderFrame]);

  // Wheel event handler - only active when hovering AND primary
  // Allows normal scrolling when animation reaches boundaries
  useEffect(() => {
    if (!isPrimary) return;
    
    const container = containerRef.current;
    if (!container || isLoading || images.length === 0) return;

    const handleWheel = (e: WheelEvent) => {
      if (!isHovering) return;
      
      const delta = e.deltaY;
      const currentFrame = frameIndexRef.current;
      const maxFrame = images.length - 1;
      
      // Allow normal scroll if at the end and scrolling down
      if (currentFrame >= maxFrame && delta > 0) {
        return; // Don't prevent default - let page scroll
      }
      
      // Allow normal scroll if at the beginning and scrolling up
      if (currentFrame <= 0 && delta < 0) {
        return; // Don't prevent default - let page scroll
      }
      
      // Otherwise, capture the scroll for animation
      e.preventDefault();
      e.stopPropagation();
      
      const sensitivity = 0.5;
      const frameChange = Math.sign(delta) * Math.max(1, Math.abs(delta) * sensitivity / 50);
      
      frameIndexRef.current = Math.min(
        Math.max(currentFrame + frameChange, 0),
        maxFrame
      );
      
      renderFrame(Math.round(frameIndexRef.current));
    };

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [isPrimary, isHovering, isLoading, images, renderFrame]);

  // Touch event handler for mobile - ONLY for primary
  useEffect(() => {
    if (!isPrimary) return;
    
    const container = containerRef.current;
    if (!container || isLoading || images.length === 0) return;

    let lastTouchY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      lastTouchY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const currentTouchY = e.touches[0].clientY;
      const delta = lastTouchY - currentTouchY;
      lastTouchY = currentTouchY;
      
      const sensitivity = 0.3;
      const frameChange = delta * sensitivity;
      
      frameIndexRef.current = Math.min(
        Math.max(frameIndexRef.current + frameChange, 0),
        images.length - 1
      );
      
      renderFrame(Math.round(frameIndexRef.current));
    };

    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
    };
  }, [isPrimary, isLoading, images, renderFrame]);

  const loadingProgress = Math.round((loadedCount / TOTAL_FRAMES) * 100);

  // Static placeholder for non-primary containers
  if (!isPrimary) {
    return (
      <div 
        ref={containerRef}
        className={`relative overflow-hidden ${className}`}
        style={{
          background: "linear-gradient(135deg, hsl(38 12% 94%) 0%, hsl(35 10% 91%) 100%)"
        }}
      >
        {/* Subtle inner border for gallery frame effect */}
        <div className="absolute inset-3 md:inset-5 border border-[hsl(30_8%_70%/0.3)] pointer-events-none z-10" />
        
        {/* Corner accents */}
        <div className="absolute top-3 left-3 md:top-5 md:left-5 w-4 h-4 border-t border-l border-[hsl(30_8%_50%/0.4)] pointer-events-none z-10" />
        <div className="absolute top-3 right-3 md:top-5 md:right-5 w-4 h-4 border-t border-r border-[hsl(30_8%_50%/0.4)] pointer-events-none z-10" />
        <div className="absolute bottom-3 left-3 md:bottom-5 md:left-5 w-4 h-4 border-b border-l border-[hsl(30_8%_50%/0.4)] pointer-events-none z-10" />
        <div className="absolute bottom-3 right-3 md:bottom-5 md:right-5 w-4 h-4 border-b border-r border-[hsl(30_8%_50%/0.4)] pointer-events-none z-10" />

        {showLabel && (
          <div className="absolute top-6 left-6 md:top-8 md:left-8 z-20 flex items-center gap-3">
            <span className="font-sans text-[11px] tracking-[0.15em] text-[hsl(30_8%_25%)] uppercase font-medium">
              {labelText}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[hsl(30_8%_60%)]" />
              <span className="text-[9px] font-sans tracking-[0.2em] text-[hsl(30_8%_50%)] uppercase">
                Standby
              </span>
            </span>
          </div>
        )}

        {/* Static placeholder content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
          <div className="w-12 h-px bg-[hsl(30_8%_75%)]" />
          <p className="font-serif text-lg md:text-xl italic text-[hsl(30_8%_45%)] text-center px-8">
            Premium experience available above
          </p>
          <p className="font-sans text-[10px] tracking-[0.3em] text-[hsl(30_8%_55%)] uppercase">
            Scroll to Section 01
          </p>
          <div className="w-12 h-px bg-[hsl(30_8%_75%)]" />
        </div>
      </div>
    );
  }

  // Primary container with full experience
  return (
    <div 
      ref={containerRef}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={`relative overflow-hidden cursor-grab active:cursor-grabbing ${className}`}
      style={{
        background: "linear-gradient(135deg, hsl(38 12% 94%) 0%, hsl(35 10% 91%) 100%)"
      }}
    >
      {/* Subtle inner border for gallery frame effect */}
      <div className="absolute inset-3 md:inset-5 border border-[hsl(30_8%_70%/0.3)] pointer-events-none z-10" />
      
      {/* Corner accents */}
      <div className="absolute top-3 left-3 md:top-5 md:left-5 w-4 h-4 border-t border-l border-[hsl(30_8%_50%/0.4)] pointer-events-none z-10" />
      <div className="absolute top-3 right-3 md:top-5 md:right-5 w-4 h-4 border-t border-r border-[hsl(30_8%_50%/0.4)] pointer-events-none z-10" />
      <div className="absolute bottom-3 left-3 md:bottom-5 md:left-5 w-4 h-4 border-b border-l border-[hsl(30_8%_50%/0.4)] pointer-events-none z-10" />
      <div className="absolute bottom-3 right-3 md:bottom-5 md:right-5 w-4 h-4 border-b border-r border-[hsl(30_8%_50%/0.4)] pointer-events-none z-10" />

      {showLabel && (
        <div className="absolute top-6 left-6 md:top-8 md:left-8 z-20 flex items-center gap-3">
          <span className="font-sans text-[11px] tracking-[0.15em] text-[hsl(30_8%_25%)] uppercase font-medium">
            {labelText}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[hsl(145_60%_40%)] animate-pulse" />
            <span className="text-[9px] font-sans tracking-[0.2em] text-[hsl(145_40%_35%)] uppercase">
              Live
            </span>
          </span>
        </div>
      )}

      {/* Hover indicator */}
      <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 z-20 transition-opacity duration-300 ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
        <span className="font-sans text-[9px] tracking-[0.25em] text-[hsl(30_8%_40%)] uppercase">
          Scroll to explore
        </span>
      </div>

      {isLoading ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <div className="relative h-px w-40 overflow-hidden bg-[hsl(30_8%_80%)]">
            <div
              className="absolute inset-y-0 left-0 bg-[hsl(30_8%_40%)] transition-all duration-150 ease-out"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          <p className="font-sans text-[10px] tracking-[0.3em] text-[hsl(30_8%_50%)] uppercase">
            Loading Experience · {loadingProgress}%
          </p>
        </div>
      ) : images.length === 0 ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="font-sans text-xs tracking-widest text-[hsl(30_8%_60%)] uppercase">Experience unavailable</p>
        </div>
      ) : (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
        />
      )}
    </div>
  );
};

export default ExperienceContainer;