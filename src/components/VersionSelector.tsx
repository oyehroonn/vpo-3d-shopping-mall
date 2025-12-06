interface VersionSelectorProps {
  onSelect: (version: 'premium' | 'lite') => void;
}

const VersionSelector = ({ onSelect }: VersionSelectorProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="grain-overlay" />
      
      <div className="relative z-10 flex flex-col items-center gap-12 px-6 text-center">
        {/* Logo/Title */}
        <div className="space-y-2">
          <h1 className="font-display text-4xl tracking-[0.3em] text-foreground">
            VIRTUAL PREMIUM OUTLETS
          </h1>
          <p className="text-sm tracking-widest text-muted-foreground">
            SELECT YOUR EXPERIENCE
          </p>
        </div>

        {/* Options */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-12">
          {/* Premium Option */}
          <button
            onClick={() => onSelect('premium')}
            className="group relative flex flex-col items-center gap-4 border border-foreground/20 px-12 py-10 transition-all hover:border-foreground/60 hover:bg-foreground/5"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-background px-3">
              <span className="text-xs tracking-widest text-foreground/60">OPTION 1</span>
            </div>
            <h2 className="font-display text-2xl tracking-widest text-foreground">
              PREMIUM
            </h2>
            <p className="max-w-[200px] text-xs leading-relaxed text-muted-foreground">
              Full cinematic experience with scroll-driven frame animation
            </p>
            <span className="mt-2 text-[10px] tracking-wider text-foreground/40">
              REQUIRES FAST INTERNET
            </span>
          </button>

          {/* Lite Option */}
          <button
            onClick={() => onSelect('lite')}
            className="group relative flex flex-col items-center gap-4 border border-foreground/20 px-12 py-10 transition-all hover:border-foreground/60 hover:bg-foreground/5"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-background px-3">
              <span className="text-xs tracking-widest text-foreground/60">OPTION 2</span>
            </div>
            <h2 className="font-display text-2xl tracking-widest text-foreground">
              LITE
            </h2>
            <p className="max-w-[200px] text-xs leading-relaxed text-muted-foreground">
              Skip animation and jump directly to the main experience
            </p>
            <span className="mt-2 text-[10px] tracking-wider text-foreground/40">
              INSTANT LOADING
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VersionSelector;
