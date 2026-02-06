import { ShoppingBag } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const RunwaySection = () => {
  const scheduleItems = [
    { time: "09:00 EST", status: "Live", label: "The Black Coat Collection" },
    { time: "12:00 EST", status: "Upcoming", label: "Accessories Vault" },
    { time: "16:00 EST", status: "Upcoming", label: "Footwear Archive" },
  ];

  return (
    <section id="runway" className="relative z-10 bg-[#080808] text-stone-200 py-32 border-t border-white/10">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12">
        {/* Header */}
        <ScrollReveal>
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 border-b border-white/10 pb-6">
            <div>
              <span className="text-[10px] font-semibold text-red-700 uppercase tracking-[0.3em] mb-4 block">
                Live Broadcast
              </span>
              <h2 className="text-5xl md:text-7xl font-serif tracking-tight leading-none">
                The Runway
              </h2>
            </div>

            {/* Act Tabs */}
            <div className="flex gap-8 mt-8 md:mt-0">
              <button className="text-[10px] uppercase tracking-widest text-white border-b border-white pb-1">
                Act I: Genesis
              </button>
              <button className="text-[10px] uppercase tracking-widest text-stone-500 hover:text-white transition-colors">
                Act II: Void
              </button>
              <button className="text-[10px] uppercase tracking-widest text-stone-500 hover:text-white transition-colors">
                Act III: Bloom
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Stage Image */}
          <ScrollReveal direction="scale" className="lg:col-span-9">
            <div className="relative h-[70vh] w-full bg-[#111] overflow-hidden group">
              {/* Live Feed Indicator */}
              <div className="absolute top-6 left-6 z-20 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                <span className="text-[9px] uppercase tracking-widest text-white/80">
                  Live Feed • Cam 04
                </span>
              </div>

              {/* Image */}
              <img
                src="https://images.unsplash.com/photo-1537832816519-689ad163238b?q=80&w=2659&auto=format&fit=crop"
                alt="Runway Model"
                className="w-full h-full object-cover opacity-80 group-hover:opacity-90 group-hover:scale-110 transition-all duration-[4s] ease-out"
              />

              {/* Bottom Gradient Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/90 to-transparent z-20 flex justify-between items-end">
                <div>
                  <h3 className="text-2xl font-serif italic text-white mb-2">
                    Look 04: Obsidian Veil
                  </h3>
                  <p className="text-xs text-stone-400 font-mono">
                    Designed by Maison VPO
                  </p>
                </div>
                <button className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-colors backdrop-blur-md">
                  <ShoppingBag className="w-4 h-4" />
                </button>
              </div>
            </div>
          </ScrollReveal>

          {/* Side Panel */}
          <ScrollReveal direction="right" delay={0.2} className="lg:col-span-3 flex flex-col justify-between h-full border-l border-white/5 pl-0 lg:pl-12">
            {/* Drop Schedule */}
            <div>
              <h4 className="text-lg font-serif italic mb-8 text-stone-400">
                Drop Schedule
              </h4>
              <ul className="space-y-6">
                {scheduleItems.map((item, index) => (
                  <li
                    key={index}
                    className={`group cursor-pointer ${index > 0 ? 'opacity-50 hover:opacity-100' : ''} transition-opacity`}
                  >
                    <div className="flex justify-between text-xs font-mono text-stone-500 mb-1 group-hover:text-white transition-colors">
                      <span>{item.time}</span>
                      <span>{item.status}</span>
                    </div>
                    <p className="text-sm font-light text-stone-300">
                      {item.label}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Lobby/Social Feature Teaser */}
            <div className="mt-12 lg:mt-0 p-6 bg-white/5 border border-white/5 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full bg-stone-700 border border-black" />
                  <div className="w-6 h-6 rounded-full bg-stone-600 border border-black" />
                  <div className="w-6 h-6 rounded-full bg-stone-500 border border-black" />
                </div>
                <span className="text-[10px] uppercase tracking-wider text-stone-400">
                  12 Friends Online
                </span>
              </div>
              <p className="text-xs text-stone-400 mb-4 leading-relaxed">
                Create a lobby to watch the show together and shop the collection in real-time.
              </p>
              <button className="w-full py-2 border border-white/20 text-[9px] uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
                Create Lobby
              </button>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default RunwaySection;
