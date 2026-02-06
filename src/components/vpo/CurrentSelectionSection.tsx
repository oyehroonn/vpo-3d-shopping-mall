import { useState, useRef, useEffect } from "react";
import { ArrowUpRight, ArrowDown } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

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
  const [isVisible, setIsVisible] = useState(false);
  
  // Ref to track mouse position for scroll detection
  const mousePositionRef = useRef({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const pos = { x: e.clientX, y: e.clientY };
    setMousePosition(pos);
    mousePositionRef.current = pos;
  };

  // Scroll listener to detect when cursor leaves brand rows during scroll
  useEffect(() => {
    const handleScroll = () => {
      const { x, y } = mousePositionRef.current;
      const elementUnderCursor = document.elementFromPoint(x, y);
      
      // Check if the element under cursor is within a brand row
      const brandRow = elementUnderCursor?.closest('.brand-row');
      
      if (!brandRow) {
        // Cursor is no longer over any brand row, clear the hover state
        setIsVisible(false);
        setHoveredBrand(null);
      } else {
        // Find which brand the cursor is now over
        const brandId = brandRow.getAttribute('data-brand-id');
        if (brandId && brandId !== hoveredBrand) {
          setHoveredBrand(brandId);
          setIsVisible(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hoveredBrand]);

  const handleBrandHover = (brandId: string | null) => {
    if (brandId) {
      // Immediately show the image
      setHoveredBrand(brandId);
      setIsVisible(true);
    } else {
      // Immediately hide the image
      setIsVisible(false);
      setHoveredBrand(null);
    }
  };

  const currentImage = hoveredBrand 
    ? brands.find((b) => b.id === hoveredBrand)?.imageUrl 
    : null;

  return (
    <section 
      className="relative z-20 bg-background grain-overlay py-24 px-8 md:px-16 overflow-hidden" 
      onMouseMove={handleMouseMove}
    >
      {/* Floating image on hover - always rendered but with opacity transition */}
      <div
        className="fixed pointer-events-none z-50 w-64 h-80"
        style={{
          left: mousePosition.x - 128,
          top: mousePosition.y - 160,
          opacity: isVisible && hoveredBrand ? 1 : 0,
          transform: `rotate(-3deg) scale(${isVisible && hoveredBrand ? 1 : 0.9})`,
          transition: 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {currentImage && (
          <img
            src={currentImage}
            alt=""
            className="w-full h-full object-cover grayscale shadow-2xl"
          />
        )}
      </div>

      {/* Background "CURATED" text */}
      <div 
        className="absolute top-16 left-1/2 -translate-x-1/2 pointer-events-none select-none"
      >
        <span className="text-[12rem] md:text-[16rem] font-serif font-light text-foreground/[0.03] tracking-wide">
          CURATED
        </span>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <ScrollReveal>
          <div className="flex items-end justify-between mb-16 border-b border-border/30 pb-8">
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
        </ScrollReveal>

        {/* Brand list */}
        <div className="relative">
          {brands.map((brand, index) => (
            <ScrollReveal 
              key={brand.id} 
              delay={0.1 * index}
              direction={index % 2 === 0 ? "left" : "right"}
            >
              <div
                className="brand-row cursor-pointer"
                data-brand-id={brand.id}
                onMouseEnter={() => handleBrandHover(brand.id)}
                onMouseLeave={() => handleBrandHover(null)}
              >
                <div className="flex items-center gap-8 md:gap-16">
                  <span className="text-sm text-muted-foreground font-sans w-8">
                    {brand.number}
                  </span>
                  <h3
                    className={`text-4xl md:text-6xl lg:text-7xl font-serif ${
                      brand.isItalic ? "italic" : "font-normal tracking-wide"
                    } text-foreground transition-opacity duration-300 ${
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
                    className={`w-5 h-5 transition-all duration-300 ${
                      hoveredBrand === brand.id 
                        ? "text-foreground translate-x-1 -translate-y-1" 
                        : "text-muted-foreground"
                    }`} 
                  />
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CurrentSelectionSection;
