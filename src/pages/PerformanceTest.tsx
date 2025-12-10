import { useState, useEffect, useRef } from "react";
import OptimizedFrameSequence from "@/components/OptimizedFrameSequence";

interface LoadMetrics {
  initialLoadTime: number;
  firstPaintTime: number;
  totalLoadTime: number;
  framesLoaded: number;
  totalFrames: number;
}

const PerformanceTest = () => {
  const [showExperience, setShowExperience] = useState(false);
  const [metrics, setMetrics] = useState<LoadMetrics | null>(null);
  const [pageLoadTime, setPageLoadTime] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    // Measure page load time
    const navEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
    if (navEntry) {
      setPageLoadTime(navEntry.loadEventEnd - navEntry.startTime);
    }
  }, []);

  const handleStart = () => {
    startTimeRef.current = performance.now();
    setIsLoading(true);
    setShowExperience(true);
  };

  const handleMetrics = (loadMetrics: LoadMetrics) => {
    setMetrics(loadMetrics);
    setIsLoading(false);
  };

  const handleReset = () => {
    setShowExperience(false);
    setMetrics(null);
    setIsLoading(false);
  };

  if (showExperience) {
    return (
      <div className="relative">
        <OptimizedFrameSequence onMetrics={handleMetrics} />
        
        {/* Performance Overlay */}
        <div className="fixed top-4 right-4 z-50 p-4 bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-lg max-w-xs">
          <h3 className="font-display text-sm font-semibold mb-3 text-foreground">
            Performance Metrics
          </h3>
          
          {isLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-3 h-3 rounded-full border-2 border-transparent border-t-foreground animate-spin" />
              Measuring...
            </div>
          ) : metrics ? (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">First Paint:</span>
                <span className="font-mono text-green-500">
                  {metrics.firstPaintTime.toFixed(0)}ms
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Full Load:</span>
                <span className="font-mono text-foreground">
                  {metrics.totalLoadTime.toFixed(0)}ms
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Frames:</span>
                <span className="font-mono text-foreground">
                  {metrics.framesLoaded}/{metrics.totalFrames}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Virtual Frames:</span>
                <span className="font-mono text-foreground">250</span>
              </div>
              <div className="pt-2 border-t border-border mt-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Compression:</span>
                  <span className="font-mono text-primary">
                    {((1 - metrics.framesLoaded / 250) * 100).toFixed(0)}% less data
                  </span>
                </div>
              </div>
            </div>
          ) : null}
          
          <button
            onClick={handleReset}
            className="mt-4 w-full px-3 py-2 text-xs font-medium bg-muted hover:bg-muted/80 rounded transition-colors"
          >
            Reset Test
          </button>
        </div>
        
        {/* Scroll indicator */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 text-foreground/60">
          <span className="text-xs font-mono">Scroll to animate</span>
          <div className="w-5 h-8 border-2 border-current rounded-full flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-current rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="max-w-2xl text-center space-y-8">
        <div className="space-y-4">
          <h1 className="font-display text-4xl md:text-5xl font-light tracking-tight text-foreground">
            Performance Test
          </h1>
          <p className="text-muted-foreground text-lg">
            Optimized 250-frame scroll animation with progressive loading
          </p>
        </div>
        
        {/* Technical specs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-y border-border">
          <div className="space-y-1">
            <p className="font-mono text-2xl text-foreground">250</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Virtual Frames</p>
          </div>
          <div className="space-y-1">
            <p className="font-mono text-2xl text-foreground">~50</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Actual Loaded</p>
          </div>
          <div className="space-y-1">
            <p className="font-mono text-2xl text-foreground">8</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Initial Frames</p>
          </div>
          <div className="space-y-1">
            <p className="font-mono text-2xl text-green-500">&lt;1s</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">First Paint</p>
          </div>
        </div>
        
        {/* Features */}
        <div className="text-left space-y-3 bg-muted/30 rounded-lg p-6">
          <h3 className="font-medium text-foreground">Optimization Techniques:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              Loads only every 5th frame (80% data reduction)
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              First 8 frames load instantly for immediate display
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              Cross-fade interpolation between loaded frames
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              Progressive background loading after first paint
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              requestAnimationFrame for smooth 60fps rendering
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              Never blocks scroll - always shows nearest available frame
            </li>
          </ul>
        </div>
        
        {pageLoadTime && (
          <p className="text-xs text-muted-foreground font-mono">
            Page load: {pageLoadTime.toFixed(0)}ms
          </p>
        )}
        
        <button
          onClick={handleStart}
          className="px-8 py-4 bg-foreground text-background font-medium tracking-wide rounded-lg hover:opacity-90 transition-opacity"
        >
          Start Performance Test
        </button>
      </div>
    </div>
  );
};

export default PerformanceTest;
