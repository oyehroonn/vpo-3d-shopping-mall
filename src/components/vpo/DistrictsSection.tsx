import { ArrowRight, MapPin } from "lucide-react";

const DistrictsSection = () => {
  const brands = [
    "Comme des Garçons",
    "Issey Miyake",
    "Yohji Yamamoto",
  ];

  return (
    <section id="spaces" className="bg-[#F5F5F0] relative overflow-hidden">
      {/* Subtle Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-16 md:py-24 relative">
        {/* Header */}
        <div className="text-center mb-12 md:mb-20">
          <span className="text-xs tracking-[0.3em] uppercase text-stone-500 font-sans block mb-4">
            World Navigation
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-stone-900 italic">
            Districts & Ateliers
          </h2>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Sidebar - District Info */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-stone-200 p-8 rounded-sm">
              <div className="flex items-center gap-2 mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] tracking-[0.2em] uppercase text-stone-500 font-sans">
                  Current Location
                </span>
              </div>

              <h3 className="font-display text-2xl md:text-3xl text-stone-900 italic mb-4">
                District 01:{" "}
                <br className="hidden md:block" />
                Neo-Tokyo
              </h3>

              <p className="text-sm text-stone-500 font-sans leading-relaxed mb-8">
                A fusion of brutalist concrete and bioluminescent flora. This district hosts the avant-garde collections and experimental digital ateliers.
              </p>

              {/* Brand List */}
              <div className="space-y-3 mb-8">
                {brands.map((brand, index) => (
                  <div
                    key={index}
                    className="group cursor-pointer flex items-center justify-between py-3 border-b border-stone-200 last:border-b-0"
                  >
                    <span className="text-sm text-stone-700 font-sans group-hover:text-stone-900 transition-colors">
                      {brand}
                    </span>
                    <ArrowRight className="w-4 h-4 text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                ))}
              </div>

              <button className="w-full py-3.5 bg-stone-900 text-white text-sm tracking-[0.15em] uppercase font-sans hover:bg-stone-800 transition-colors flex items-center justify-center gap-2">
                <span>Teleport to District</span>
                <MapPin className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Side - Map Area */}
          <div className="lg:col-span-2 relative min-h-[400px] lg:min-h-[500px] hidden lg:block">
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
                stroke="#d6d3d1"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <path
                d="M300 200 L300 100"
                stroke="#d6d3d1"
                strokeWidth="1"
                strokeDasharray="4 4"
              />

              {/* Concentric Circles around Tokyo */}
              <circle cx="300" cy="200" r="30" stroke="#e7e5e4" strokeWidth="1" fill="none" />
              <circle cx="300" cy="200" r="50" stroke="#e7e5e4" strokeWidth="1" fill="none" />
              <circle cx="300" cy="200" r="70" stroke="#e7e5e4" strokeWidth="0.5" fill="none" />
            </svg>

            {/* Paris Node */}
            <div className="absolute top-[75%] left-[15%] group cursor-pointer">
              <div className="relative">
                <div className="w-3 h-3 rounded-full bg-stone-300 group-hover:scale-150 transition-transform duration-300" />
                <div className="absolute left-5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  <span className="text-xs text-stone-600 font-sans">
                    Paris: Rue St. Honoré
                  </span>
                </div>
              </div>
            </div>

            {/* Tokyo Node - Active */}
            <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 group cursor-pointer">
              <div className="relative">
                {/* Ping Animation */}
                <div className="absolute inset-0 w-4 h-4 rounded-full border border-stone-400 animate-ping" />
                <div className="w-4 h-4 rounded-full bg-stone-900 relative z-10" />
                <div className="absolute left-6 top-1/2 -translate-y-1/2 whitespace-nowrap">
                  <span className="text-xs text-stone-900 font-sans font-medium">
                    Tokyo: Shibuya (Active)
                  </span>
                </div>
              </div>
            </div>

            {/* Milan Node */}
            <div className="absolute top-[62%] right-[15%] group cursor-pointer">
              <div className="relative">
                <div className="w-3 h-3 rounded-full bg-stone-300 group-hover:scale-150 transition-transform duration-300" />
                <div className="absolute right-5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  <span className="text-xs text-stone-600 font-sans">
                    Milan: Galleria
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DistrictsSection;
