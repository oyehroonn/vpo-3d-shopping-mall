import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 250;
const FRAME_BASE_URL = "https://dev.heyharoon.io/scene2/samples_frames/frame";

interface ExperienceContainerProps {
  className?: string;
  showLabel?: boolean;
  labelText?: string;
}

const ExperienceContainer = ({ 
  className = "", 
  showLabel = true,
  labelText = "Store Interior"
}: ExperienceContainerProps) => {
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
      setIsLoading(false);
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
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
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
    renderFrame(0);

    const scrollPerFrame = 8;
    const totalScrollDistance = images.length * scrollPerFrame;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top 20%",
        end: `+=${totalScrollDistance}`,
        scrub: 0.5,
        onUpdate: (self) => {
          const progress = self.progress;
          const frameIndex = Math.round(progress * (images.length - 1));
          frameIndexRef.current.value = frameIndex;
          renderFrame(frameIndex);
        },
        onRefresh: () => {
          renderFrame(Math.round(frameIndexRef.current.value));
        },
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
  }, [isLoading, images]);

  const loadingProgress = Math.round((loadedCount / TOTAL_FRAMES) * 100);

  return (
    <div 
      ref={containerRef}
      className={`relative bg-[hsl(var(--vpo-light-bg))] overflow-hidden ${className}`}
    >
      {showLabel && (
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
          <span className="text-xs font-sans tracking-wide text-light uppercase">
            {labelText}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[hsl(var(--vpo-secure))]" />
            <span className="text-[10px] font-sans tracking-widest text-[hsl(var(--vpo-secure))] uppercase">
              Live Render
            </span>
          </span>
        </div>
      )}

      {isLoading ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <div className="relative h-0.5 w-32 overflow-hidden rounded-full bg-muted/20">
            <div
              className="absolute inset-y-0 left-0 bg-muted-foreground/40 transition-all duration-150 ease-out"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          <p className="font-sans text-[10px] tracking-widest text-muted-foreground/60 uppercase">
            {loadingProgress}%
          </p>
        </div>
      ) : images.length === 0 ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="font-sans text-xs text-muted-foreground/40">Experience unavailable</p>
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
