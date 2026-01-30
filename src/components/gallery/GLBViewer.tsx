import { useEffect } from 'react';

interface GLBViewerProps {
  modelUrl: string;
  className?: string;
  labelText?: string;
}

const GLBViewer = ({ 
  modelUrl, 
  className = "", 
  labelText = "3D View"
}: GLBViewerProps) => {
  
  useEffect(() => {
    // Load model-viewer script if not already loaded
    if (!document.querySelector('script[src*="model-viewer"]')) {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js';
      document.head.appendChild(script);
    }
  }, []);

  return (
    <div 
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

      {/* Label */}
      <div className="absolute top-6 left-6 md:top-8 md:left-8 z-20 flex items-center gap-3">
        <span className="font-sans text-[11px] tracking-[0.15em] text-[hsl(30_8%_25%)] uppercase font-medium">
          {labelText}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[hsl(145_60%_40%)] animate-pulse" />
          <span className="text-[9px] font-sans tracking-[0.2em] text-[hsl(145_40%_35%)] uppercase">
            Interactive
          </span>
        </span>
      </div>

      {/* Interaction hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
        <span className="font-sans text-[9px] tracking-[0.25em] text-[hsl(30_8%_45%)] uppercase">
          Drag to rotate · Scroll to zoom
        </span>
      </div>

      {/* Model Viewer */}
      <div className="absolute inset-0 w-full h-full">
        {/* @ts-ignore - model-viewer is a web component */}
        <model-viewer
          src={modelUrl}
          alt={labelText}
          camera-controls
          touch-action="pan-y"
          environment-image="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_03_1k.hdr"
          exposure="0.8"
          shadow-intensity="0.5"
          shadow-softness="1"
          interpolation-decay="75"
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'transparent',
            '--poster-color': 'transparent'
          }}
        />
      </div>
    </div>
  );
};

export default GLBViewer;
