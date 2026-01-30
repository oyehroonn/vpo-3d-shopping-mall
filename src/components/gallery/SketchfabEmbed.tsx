interface SketchfabEmbedProps {
  className?: string;
  labelText?: string;
}

const SketchfabEmbed = ({ 
  className = "", 
  labelText = "Atelier View"
}: SketchfabEmbedProps) => {
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
            3D
          </span>
        </span>
      </div>

      {/* Sketchfab iframe container */}
      <div className="absolute inset-3 md:inset-5 flex items-center justify-center pt-12 pb-4">
        <iframe 
          title="Final Project: B. Crenek - Coze"
          className="w-full h-[280px] md:h-[420px]"
          frameBorder="0"
          allowFullScreen
          allow="autoplay; fullscreen; xr-spatial-tracking"
          src="https://sketchfab.com/models/d047ee946d8048039582e83f412f1e13/embed"
        />
      </div>
    </div>
  );
};

export default SketchfabEmbed;
