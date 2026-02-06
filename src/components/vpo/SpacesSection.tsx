import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface BrandWaypoint {
  id: string;
  name: string;
  x: number;
  y: number;
}

const brandWaypoints: BrandWaypoint[] = [
  { id: "chanel", name: "CHANEL", x: 30, y: 35 },
  { id: "hermes", name: "HERMÈS", x: 65, y: 52 },
];

const SpacesSection = () => {
  const [hoveredBrand, setHoveredBrand] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const waypointRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const visual = visualRef.current;
    const badge = badgeRef.current;

    if (!section || !visual || !badge) return;

    const ctx = gsap.context(() => {
      // Badge fade in
      gsap.set(badge, { opacity: 0, y: -20 });
      gsap.to(badge, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      // Parallax on the visual background - moves slower than scroll
      gsap.to(visual, {
        yPercent: -20,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      // Animate waypoints with stagger
      waypointRefs.current.forEach((waypoint, index) => {
        if (!waypoint) return;
        
        gsap.set(waypoint, { opacity: 0, y: 30, scale: 0.9 });
        gsap.to(waypoint, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          delay: index * 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 60%",
            toggleActions: "play none none reverse",
          },
        });
      });

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative z-10 min-h-screen overflow-hidden">
      {/* Location badge */}
      <div 
        ref={badgeRef}
        className="absolute top-8 left-8 z-20 flex items-center gap-2 bg-secondary/80 backdrop-blur-sm rounded-full px-4 py-2"
      >
        <svg className="w-4 h-4 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="text-xs tracking-wide font-sans text-foreground">5TH AVENUE, NYC</span>
      </div>

      {/* Abstract 3D-like visual background */}
      <div 
        ref={visualRef}
        className="relative w-full h-[70vh] overflow-hidden bg-gradient-to-b from-[hsl(0,0%,75%)] to-[hsl(0,0%,55%)]"
        style={{ willChange: "transform" }}
      >
        {/* Simulated abstract waves using CSS */}
        <div className="absolute inset-0 opacity-80">
          <svg viewBox="0 0 1440 600" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(0, 0%, 85%)" />
                <stop offset="50%" stopColor="hsl(0, 0%, 65%)" />
                <stop offset="100%" stopColor="hsl(0, 0%, 50%)" />
              </linearGradient>
            </defs>
            <path
              d="M0,200 C200,100 400,250 600,180 C800,110 1000,280 1200,200 C1400,120 1440,200 1440,200 L1440,600 L0,600 Z"
              fill="url(#waveGrad)"
              opacity="0.6"
            />
            <path
              d="M0,300 C150,220 350,380 550,300 C750,220 950,400 1150,320 C1350,240 1440,300 1440,300 L1440,600 L0,600 Z"
              fill="hsl(0, 0%, 55%)"
              opacity="0.5"
            />
            <path
              d="M0,400 C250,320 450,480 650,400 C850,320 1050,500 1250,420 C1350,380 1440,400 1440,400 L1440,600 L0,600 Z"
              fill="hsl(0, 0%, 45%)"
              opacity="0.4"
            />
          </svg>
        </div>

        {/* Brand waypoints */}
        {brandWaypoints.map((brand, index) => (
          <div
            key={brand.id}
            ref={(el) => (waypointRefs.current[index] = el)}
            className="absolute z-10 cursor-pointer group"
            style={{ left: `${brand.x}%`, top: `${brand.y}%`, willChange: "transform, opacity" }}
            onMouseEnter={() => setHoveredBrand(brand.id)}
            onMouseLeave={() => setHoveredBrand(null)}
          >
            {/* Vertical line */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full h-12 w-px bg-foreground/60 origin-bottom transition-transform group-hover:scale-y-110" />
            
            {/* Label */}
            <div 
              className={`
                bg-foreground text-background px-4 py-2 text-xs tracking-[0.15em] font-sans
                transition-all duration-300
                ${hoveredBrand === brand.id ? 'shadow-lg shadow-black/20 scale-105' : ''}
              `}
            >
              {brand.name}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SpacesSection;
