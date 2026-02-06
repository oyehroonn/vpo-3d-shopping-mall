import { ArrowRight, MapPin } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const DistrictsSection = () => {
  const brands = [
    "Comme des Garçons",
    "Issey Miyake",
    "Yohji Yamamoto",
  ];

  return (
    <section id="spaces" className="relative z-10 bg-[#F5F5F0] text-[#1a1918] overflow-hidden">
      {/* Grid Background Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="max-w-[1800px] mx-auto px-6 md:px-12 py-32 relative z-10">
        {/* Header */}
        <ScrollReveal>
          <div className="flex flex-col items-center text-center mb-20">
            <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-[0.3em] mb-4">
              World Navigation
            </span>
            <h2 className="text-5xl md:text-7xl font-serif tracking-tight leading-none mb-6">
              Districts & Ateliers
            </h2>
            <div className="w-px h-12 bg-stone-300" />
          </div>
        </ScrollReveal>

        {/* Map Interface */}
        <div className="relative w-full h-[80vh] bg-[#EBE9E4] border border-stone-300 overflow-hidden flex shadow-2xl">
          {/* Sidebar: District Detail */}
          <ScrollReveal direction="left" className="w-full lg:w-1/3 bg-[#FDFBF7] border-r border-stone-200 p-12 flex flex-col z-20 relative">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-[10px] uppercase tracking-widest text-stone-500">
                  Current Location
                </span>
              </div>

              <h3 className="text-4xl font-serif mb-6">
                District 01:{" "}
                <br />
                <span className="italic text-stone-400">Neo-Tokyo</span>
              </h3>

              <p className="text-sm text-stone-600 font-light leading-relaxed mb-8">
                A fusion of brutalist concrete and bioluminescent flora. This district hosts the avant-garde collections and experimental digital ateliers.
              </p>

              {/* Brand List */}
              <div className="space-y-4 mb-8">
                {brands.map((brand, index) => (
                  <div
                    key={index}
                    className="group cursor-pointer flex items-center justify-between border-b border-stone-200 pb-2"
                  >
                    <span className="text-xs font-medium">
                      {brand}
                    </span>
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>

            <button className="w-full flex justify-between items-center px-6 py-4 bg-[#1a1918] text-white hover:bg-stone-800 transition-colors">
              <span className="text-[10px] uppercase tracking-widest">Teleport to District</span>
              <MapPin className="w-4 h-4" />
            </button>
          </ScrollReveal>

          {/* The Map Visual (Abstract Nodes) */}
          <ScrollReveal direction="scale" delay={0.2} className="flex-1 relative overflow-hidden bg-[#E5E2DC] hidden lg:block">
            {/* Map Lines SVG */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" width="100%" height="100%">
              <line x1="20%" y1="30%" x2="50%" y2="50%" stroke="black" strokeWidth="1" />
              <line x1="50%" y1="50%" x2="80%" y2="20%" stroke="black" strokeWidth="1" />
              <line x1="50%" y1="50%" x2="60%" y2="80%" stroke="black" strokeWidth="1" />
              <circle cx="50%" cy="50%" r="200" stroke="black" strokeWidth="0.5" fill="none" />
              <circle cx="50%" cy="50%" r="350" stroke="black" strokeWidth="0.5" fill="none" />
            </svg>

            {/* Paris Node */}
            <div className="absolute top-[30%] left-[20%] group cursor-pointer">
              <div className="w-4 h-4 bg-[#1a1918] rounded-full border-4 border-[#E5E2DC] group-hover:scale-150 transition-transform duration-300" />
              <span className="absolute top-6 left-1/2 -translate-x-1/2 text-[9px] uppercase tracking-widest font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Paris: Rue St. Honoré
              </span>
            </div>

            {/* Tokyo Node - Active (RED) */}
            <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10">
              <div className="relative">
                {/* Ping Animation */}
                <div className="absolute -inset-4 border border-stone-500/30 rounded-full animate-ping" />
                <div className="w-6 h-6 bg-red-700 rounded-full border-4 border-[#E5E2DC] shadow-xl" />
              </div>
              <span className="absolute top-8 left-1/2 -translate-x-1/2 text-[9px] uppercase tracking-widest font-semibold whitespace-nowrap bg-white px-2 py-1">
                Tokyo: Shibuya (Active)
              </span>
            </div>

            {/* Milan Node */}
            <div className="absolute bottom-[20%] right-[40%] group cursor-pointer">
              <div className="w-4 h-4 bg-[#1a1918] rounded-full border-4 border-[#E5E2DC] group-hover:scale-150 transition-transform duration-300" />
              <span className="absolute top-6 left-1/2 -translate-x-1/2 text-[9px] uppercase tracking-widest font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Milan: Galleria
              </span>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default DistrictsSection;
