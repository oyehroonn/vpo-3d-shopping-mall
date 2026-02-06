import { Check } from "lucide-react";

const AccessSection = () => {
  const benefits = [
    "Global Inventory Storage",
    "Cross-district Teleportation",
    "Private Lobby Hosting",
  ];

  return (
    <section id="account" className="bg-[#111111] border-t border-stone-800">
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column - Content */}
          <div>
            <span className="text-xs tracking-[0.3em] uppercase text-white/40 font-sans block mb-6">
              03 — Private Access
            </span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-white mb-6">
              The VPO{" "}
              <br className="hidden md:block" />
              <span className="italic">Membership.</span>
            </h2>
            <p className="text-base md:text-lg text-white/50 font-sans leading-relaxed mb-10 max-w-lg">
              Unlock early access to drops, private viewing rooms, and persistent identity across the metaverse. Your wallet is your passport.
            </p>

            {/* Benefits List */}
            <div className="space-y-4 mb-10">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white/60" />
                  </div>
                  <span className="text-sm text-white/70 font-sans">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>

            <a
              href="#"
              className="inline-block text-sm text-white/60 font-sans underline underline-offset-4 decoration-white/30 hover:text-white hover:decoration-white transition-colors"
            >
              View Tiers & Benefits
            </a>
          </div>

          {/* Right Column - Membership Card */}
          <div className="flex flex-col items-center">
            {/* Card Container with Perspective */}
            <div className="perspective-1000 w-full max-w-sm">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-rose-500/20 blur-[80px] opacity-50" />

              {/* Card */}
              <div className="group relative transform-style-3d transition-transform duration-500 hover:[transform:rotateY(6deg)_rotateX(3deg)]">
                <div
                  className="relative rounded-xl overflow-hidden border border-white/10"
                  style={{ aspectRatio: "1.586" }}
                >
                  {/* Card Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-stone-800 via-stone-900 to-black" />

                  {/* Holographic Shine Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Card Content */}
                  <div className="relative h-full p-6 flex flex-col justify-between">
                    {/* Top Row */}
                    <div className="flex items-start justify-between">
                      <span className="font-display text-xl text-white/90 italic">
                        VPO.
                      </span>
                      {/* Holographic Chip */}
                      <div className="relative w-10 h-8 rounded-sm overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-300 via-orange-400 to-rose-400" />
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent animate-shimmer" />
                        {/* Chip Lines */}
                        <div className="absolute inset-1 flex flex-col justify-center gap-0.5">
                          <div className="h-px bg-black/20" />
                          <div className="h-px bg-black/20" />
                          <div className="h-px bg-black/20" />
                        </div>
                      </div>
                    </div>

                    {/* Middle - Decorative Element */}
                    <div className="flex justify-center py-4">
                      <svg
                        width="60"
                        height="60"
                        viewBox="0 0 60 60"
                        fill="none"
                        className="text-white/10"
                      >
                        <circle cx="30" cy="30" r="28" stroke="currentColor" strokeWidth="0.5" />
                        <circle cx="30" cy="30" r="20" stroke="currentColor" strokeWidth="0.5" />
                        <circle cx="30" cy="30" r="12" stroke="currentColor" strokeWidth="0.5" />
                      </svg>
                    </div>

                    {/* Bottom Row */}
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-[9px] tracking-[0.2em] uppercase text-white/30 font-sans mb-1">
                          Member ID
                        </p>
                        <p className="text-xs tracking-[0.1em] text-white/70 font-sans">
                          0000 8821 99X1
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] tracking-[0.2em] uppercase text-white/30 font-sans mb-1">
                          Tier
                        </p>
                        <p className="text-xs tracking-[0.1em] text-white/70 font-sans">
                          Ether
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Animated Border Shimmer */}
                  <div className="absolute inset-0 rounded-xl border border-white/5" />
                </div>
              </div>
            </div>

            {/* Access Vault Button */}
            <div className="mt-8 text-center">
              <p className="text-xs text-white/30 font-sans mb-3">
                Already a member?
              </p>
              <button className="px-8 py-3 bg-white text-black text-sm tracking-[0.15em] uppercase font-sans hover:bg-white/90 transition-colors">
                Access Vault
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AccessSection;
