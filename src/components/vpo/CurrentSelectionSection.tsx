import { useState, useEffect, useRef } from "react";
import { ArrowUpRight, ArrowDown } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Brand {
  id: string;
  number: string;
  name: string;
  location: string;
  isItalic?: boolean;
  imageUrl: string;
}

const brands: Brand[] = [
  {
    id: "celine",
    number: "01",
    name: "Celine",
    location: "PARIS, FR",
    isItalic: true,
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&q=80",
  },
  {
    id: "balenciaga",
    number: "02",
    name: "BALENCIAGA",
    location: "MADRID, ES",
    isItalic: false,
    imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=500&fit=crop&q=80",
  },
  {
    id: "saint-laurent",
    number: "03",
    name: "Saint Laurent",
    location: "LOS ANGELES, US",
    isItalic: true,
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop&q=80",
  },
  {
    id: "bottega",
    number: "04",
    name: "BOTTEGA VENETA",
    location: "MILAN, IT",
    isItalic: false,
    imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=500&fit=crop&q=80",
  },
  {
    id: "loewe",
    number: "05",
    name: "Loewe",
    location: "TOKYO, JP",
    isItalic: true,
    imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=500&fit=crop&q=80",
  },
];

const CurrentSelectionSection = () => {
  const [hoveredBrand, setHoveredBrand] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const brandRowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const curatedTextRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const curatedText = curatedTextRef.current;

    if (!section || !header) return;

    const ctx = gsap.context(() => {
      // Header animation
      gsap.set(header, { opacity: 0, y: 40 });
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

      // Curated text parallax
      if (curatedText) {
        gsap.to(curatedText, {
          xPercent: -10,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // Brand rows staggered animation
      brandRowRefs.current.forEach((row, index) => {
        if (!row) return;

        gsap.set(row, { 
          opacity: 0, 
          x: index % 2 === 0 ? -60 : 60,
          willChange: "transform, opacity"
        });

        gsap.to(row, {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: row,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      });

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative z-20 bg-background grain-overlay py-24 px-8 md:px-16 overflow-hidden" 
      onMouseMove={handleMouseMove}
    >
      {/* Floating image on hover */}
      {hoveredBrand && (
        <div
          className="fixed pointer-events-none z-50 w-64 h-80 transition-opacity duration-300"
          style={{
            left: mousePosition.x - 128,
            top: mousePosition.y - 160,
            opacity: 1,
          }}
        >
          <img
            src={brands.find((b) => b.id === hoveredBrand)?.imageUrl}
            alt=""
            className="w-full h-full object-cover grayscale animate-float shadow-2xl"
            style={{ transform: "rotate(-3deg)" }}
          />
        </div>
      )}

      {/* Background "CURATED" text */}
      <div 
        ref={curatedTextRef}
        className="absolute top-16 left-1/2 -translate-x-1/2 pointer-events-none select-none"
        style={{ willChange: "transform" }}
      >
        <span className="text-[12rem] md:text-[16rem] font-serif font-light text-foreground/[0.03] tracking-wide">
          CURATED
        </span>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <div ref={headerRef} className="flex items-end justify-between mb-16 border-b border-border/30 pb-8">
          <div>
            <span className="text-xs tracking-[0.3em] text-muted-foreground font-sans block mb-3">
              (02) — SPACES
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-light text-foreground">
              Current Selection
            </h2>
          </div>
          <button className="w-14 h-14 rounded-full border border-border/50 flex items-center justify-center hover:bg-secondary/50 transition-colors">
            <ArrowDown className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Brand list */}
        <div className="relative">
          {brands.map((brand, index) => (
            <div
              key={brand.id}
              ref={(el) => (brandRowRefs.current[index] = el)}
              className="brand-row cursor-pointer"
              onMouseEnter={() => setHoveredBrand(brand.id)}
              onMouseLeave={() => setHoveredBrand(null)}
            >
              <div className="flex items-center gap-8 md:gap-16">
                <span className="text-sm text-muted-foreground font-sans w-8">
                  {brand.number}
                </span>
                <h3
                  className={`text-4xl md:text-6xl lg:text-7xl font-serif ${
                    brand.isItalic ? "italic" : "font-normal tracking-wide"
                  } text-foreground transition-opacity ${
                    hoveredBrand && hoveredBrand !== brand.id ? "opacity-30" : "opacity-100"
                  }`}
                >
                  {brand.name}
                </h3>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-sm tracking-[0.15em] text-muted-foreground font-sans">
                  {brand.location}
                </span>
                <ArrowUpRight 
                  className={`w-5 h-5 transition-all ${
                    hoveredBrand === brand.id 
                      ? "text-foreground translate-x-1 -translate-y-1" 
                      : "text-muted-foreground"
                  }`} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CurrentSelectionSection;
