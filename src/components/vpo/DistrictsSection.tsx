import { ArrowRight, MapPin } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const DistrictsSection = () => {
  const brands = [
    "Comme des Garçons",
    "Issey Miyake",
    "Yohji Yamamoto",
  ];

  return (
    <section id="spaces" className="relative z-10 bg-light overflow-hidden">
      {/* Subtle Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-16 md:py-24 relative">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-12 md:mb-20">
            <span className="text-xs tracking-[0.3em] uppercase text-vpo-subtle font-sans block mb-4">
              World Navigation
            </span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-light italic">
              Districts & Ateliers
            </h2>
          </div>
        </ScrollReveal>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Sidebar - District Info */}
          <ScrollReveal direction="left" className="lg:col-span-1">
            <div className="bg-background border border-border/20 p-8 rounded-sm">
              <div className="flex items-center gap-2 mb-6">
                <span className="w-2 h-2 rounded-full bg-[hsl(var(--vpo-secure))]" />
                <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-sans">
                  Current Location
                </span>
              </div>

              <h3 className="font-display text-2xl md:text-3xl text-foreground italic mb-4">
                District 01:{" "}
                <br className="hidden md:block" />
                Neo-Tokyo
              </h3>

              <p className="text-sm text-muted-foreground font-sans leading-relaxed mb-8">
                A fusion of brutalist concrete and bioluminescent flora. This district hosts the avant-garde collections and experimental digital ateliers.
              </p>

              {/* Brand List */}
              <div className="space-y-3 mb-8">
                {brands.map((brand, index) => (
                  <div
                    key={index}
                    className="group cursor-pointer flex items-center justify-between py-3 border-b border-border/30 last:border-b-0"
                  >
                    <span className="text-sm text-foreground/70 font-sans group-hover:text-foreground transition-colors">
                      {brand}
                    </span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                ))}
              </div>

              <button className="w-full py-3.5 bg-foreground text-background text-sm tracking-[0.15em] uppercase font-sans hover:bg-foreground/90 transition-colors flex items-center justify-center gap-2">
                <span>Teleport to District</span>
                <MapPin className="w-4 h-4" />
              </button>
            </div>
          </ScrollReveal>

          {/* Right Side - Map Area */}
          <ScrollReveal direction="scale" delay={0.2} className="lg:col-span-2 relative min-h-[400px] lg:min-h-[500px] hidden lg:block">
            {/* Abstract Map SVG */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 600 400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Connection Lines */}
              <path
                d="M100 300 L300 200 L500 250"
                stroke="hsl(var(--border))"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <path
                d="M300 200 L300 100"
                stroke="hsl(var(--border))"
                strokeWidth="1"
                strokeDasharray="4 4"
              />

              {/* Concentric Circles around Tokyo */}
              <circle cx="300" cy="200" r="30" stroke="hsl(var(--muted))" strokeWidth="1" fill="none" />
              <circle cx="300" cy="200" r="50" stroke="hsl(var(--muted))" strokeWidth="1" fill="none" />
              <circle cx="300" cy="200" r="70" stroke="hsl(var(--muted))" strokeWidth="0.5" fill="none" />
            </svg>

            {/* Paris Node */}
            <div className="absolute top-[75%] left-[15%] group cursor-pointer">
              <div className="relative">
                <div className="w-3 h-3 rounded-full bg-muted-foreground/50 group-hover:scale-150 transition-transform duration-300" />
                <div className="absolute left-5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  <span className="text-xs text-light font-sans">
                    Paris: Rue St. Honoré
                  </span>
                </div>
              </div>
            </div>

            {/* Tokyo Node - Active */}
            <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 group cursor-pointer">
              <div className="relative">
                {/* Ping Animation */}
                <div className="absolute inset-0 w-4 h-4 rounded-full border border-muted-foreground animate-ping" />
                <div className="w-4 h-4 rounded-full bg-foreground relative z-10" />
                <div className="absolute left-6 top-1/2 -translate-y-1/2 whitespace-nowrap">
                  <span className="text-xs text-light font-sans font-medium">
                    Tokyo: Shibuya (Active)
                  </span>
                </div>
              </div>
            </div>

            {/* Milan Node */}
            <div className="absolute top-[62%] right-[15%] group cursor-pointer">
              <div className="relative">
                <div className="w-3 h-3 rounded-full bg-muted-foreground/50 group-hover:scale-150 transition-transform duration-300" />
                <div className="absolute right-5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  <span className="text-xs text-light font-sans">
                    Milan: Galleria
                  </span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default DistrictsSection;
