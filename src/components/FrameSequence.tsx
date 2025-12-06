import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 226;
const FRAME_BASE_URL = "http://dev.heyharoon.io/frames1/samples_frames/frame";

const FrameSequence = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentLoadingFrame, setCurrentLoadingFrame] = useState("");
  const [loadLog, setLoadLog] = useState<string[]>([]);
  const frameIndexRef = useRef({ value: 0 });

  // Preload all images
  useEffect(() => {
    const loadImages = async () => {
      const imagePromises: Promise<HTMLImageElement>[] = [];

      for (let i = 1; i <= TOTAL_FRAMES; i++) {
        const promise = new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          const frameUrl = `${FRAME_BASE_URL}${i}.jpg`;
          img.crossOrigin = "anonymous";
          setCurrentLoadingFrame(frameUrl);
          img.onload = () => {
            setLoadedCount((prev) => prev + 1);
            setLoadLog((prev) => [...prev.slice(-9), `✓ Loaded frame${i}.jpg`]);
            resolve(img);
          };
          img.onerror = () => {
            setLoadLog((prev) => [...prev.slice(-9), `✗ Failed frame${i}.jpg`]);
            reject(new Error(`Failed to load ${frameUrl}`));
          };
          img.src = frameUrl;
        });
        imagePromises.push(promise);
      }

      try {
        const loadedImages = await Promise.all(imagePromises);
        setImages(loadedImages);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading images:", error);
      }
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

    // Create the scroll animation
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
      value: TOTAL_FRAMES - 1,
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
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <div className="relative h-1 w-64 overflow-hidden rounded-full bg-muted">
              <div
                className="absolute inset-y-0 left-0 bg-foreground transition-all duration-300 ease-out"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <p className="font-mono text-sm text-muted-foreground">
              Loading frames... {loadedCount}/{TOTAL_FRAMES} ({loadingProgress}%)
            </p>
            <p className="font-mono text-xs text-muted-foreground/60 max-w-md truncate">
              {currentLoadingFrame}
            </p>
            <div className="mt-4 w-80 h-48 overflow-y-auto rounded bg-muted/30 p-3 font-mono text-xs text-muted-foreground">
              <p className="text-foreground/80 mb-2">Debug Log:</p>
              {loadLog.map((log, i) => (
                <p key={i} className={log.startsWith("✓") ? "text-green-500" : "text-red-500"}>
                  {log}
                </p>
              ))}
              {loadLog.length === 0 && <p className="text-muted-foreground/50">Starting...</p>}
            </div>
          </div>
        ) : (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full"
          />
        )}
      </div>

      {/* Content after animation */}
      <section className="flex min-h-screen items-center justify-center bg-background">
        <div className="container mx-auto px-6 text-center">
          <h2 className="mb-6 text-4xl font-light tracking-tight text-foreground md:text-6xl">
            The journey continues
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Scroll down to discover more
          </p>
        </div>
      </section>
    </>
  );
};

export default FrameSequence;
