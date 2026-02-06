import { useEffect, useRef } from "react";
import { ShoppingBag } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const RunwaySection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const mainImageRef = useRef<HTMLDivElement>(null);
  const sidePanelRef = useRef<HTMLDivElement>(null);

  const scheduleItems = [
    { time: "09:00 EST", status: "Live", label: "The Black Coat Collection" },
    { time: "12:00 EST", status: "Upcoming", label: "Accessories Vault" },
    { time: "16:00 EST", status: "Upcoming", label: "Footwear Archive" },
  ];

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const mainImage = mainImageRef.current;
    const sidePanel = sidePanelRef.current;

    if (!section || !header || !mainImage || !sidePanel) return;

    const ctx = gsap.context(() => {
      // Header fade in from top
      gsap.set(header, { opacity: 0, y: -30 });
      gsap.to(header, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });

      // Main image scale and fade
      gsap.set(mainImage, { opacity: 0, scale: 0.95 });
      gsap.to(mainImage, {
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 65%",
          toggleActions: "play none none reverse",
        },
      });

      // Side panel slide in from right
      gsap.set(sidePanel, { opacity: 0, x: 60 });
      gsap.to(sidePanel, {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 60%",
          toggleActions: "play none none reverse",
        },
      });

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="runway" className="relative z-10 bg-background border-t border-border/10">
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-16 md:py-24">
        {/* Header */}
        <div ref={headerRef} className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 md:mb-16">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs tracking-[0.2em] uppercase text-foreground/50 font-sans">
                Live Broadcast
              </span>
              <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
            </div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground italic">
              The Runway
            </h2>
          </div>

          {/* Act Tabs */}
          <div className="flex gap-6 mt-6 md:mt-0">
            <button className="text-sm tracking-[0.15em] uppercase text-foreground pb-2 border-b border-foreground">
              Act I: Genesis
            </button>
            <button className="text-sm tracking-[0.15em] uppercase text-foreground/40 hover:text-foreground/70 transition-colors pb-2 border-b border-transparent">
              Act II: Void
            </button>
            <button className="text-sm tracking-[0.15em] uppercase text-foreground/40 hover:text-foreground/70 transition-colors pb-2 border-b border-transparent">
              Act III: Bloom
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Main Stage Image */}
          <div ref={mainImageRef} className="lg:col-span-3 relative group cursor-pointer overflow-hidden rounded-sm">
            <div className="aspect-[16/10] lg:aspect-auto lg:h-[70vh] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1537832816519-689ad163238b?w=1600&q=90"
                alt="Runway show"
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-[2s] ease-out"
              />
            </div>

            {/* Live Feed Indicator */}
            <div className="absolute top-6 left-6 flex items-center gap-2 bg-background/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
              <span className="text-[10px] tracking-[0.15em] uppercase text-foreground/80 font-sans">
                Live Feed • Cam 04
              </span>
            </div>

            {/* Bottom Gradient Overlay */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background/90 via-background/50 to-transparent" />

            {/* Look Info */}
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
              <div>
                <p className="font-display text-xl md:text-2xl text-foreground italic mb-1">
                  Look 04: Obsidian Veil
                </p>
                <p className="text-xs tracking-[0.15em] uppercase text-foreground/50 font-sans">
                  Designed by Maison VPO
                </p>
              </div>
              <button className="w-12 h-12 rounded-full border border-foreground/30 flex items-center justify-center hover:bg-foreground hover:text-background transition-colors duration-300 group/btn">
                <ShoppingBag className="w-5 h-5 text-foreground group-hover/btn:text-background transition-colors" />
              </button>
            </div>
          </div>

          {/* Side Panel */}
          <div ref={sidePanelRef} className="lg:col-span-1 flex flex-col gap-6">
            {/* Drop Schedule */}
            <div className="bg-secondary/50 border border-border/10 p-6 rounded-sm">
              <p className="text-xs tracking-[0.2em] uppercase text-foreground/40 font-sans mb-6">
                Drop Schedule
              </p>
              <div className="space-y-5">
                {scheduleItems.map((item, index) => (
                  <div
                    key={index}
                    className="group cursor-pointer opacity-50 hover:opacity-100 transition-opacity duration-300"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] tracking-[0.1em] uppercase text-foreground/60 font-sans">
                        {item.time}
                      </span>
                      <span
                        className={`text-[9px] tracking-[0.1em] uppercase font-sans px-1.5 py-0.5 rounded ${
                          item.status === "Live"
                            ? "bg-destructive/20 text-destructive"
                            : "bg-foreground/10 text-foreground/40"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300 font-sans">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Lobby Card */}
            <div className="bg-secondary/50 border border-border/10 p-6 rounded-sm flex-1 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex -space-x-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-muted to-secondary border-2 border-secondary" />
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-muted-foreground to-muted border-2 border-secondary" />
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent to-muted border-2 border-secondary" />
                </div>
                <span className="text-xs text-foreground/50 font-sans">
                  12 Friends Online
                </span>
              </div>
              <p className="text-sm text-foreground/40 font-sans mb-6 leading-relaxed">
                Create a lobby to watch the show together and shop the collection in real-time.
              </p>
              <button className="mt-auto w-full py-3 border border-foreground/20 text-sm tracking-[0.15em] uppercase text-foreground hover:bg-foreground hover:text-background transition-colors duration-300 font-sans">
                Create Lobby
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RunwaySection;
