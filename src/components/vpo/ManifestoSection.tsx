import { ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const ManifestoSection = () => {
  return (
    <section 
      className="relative z-20 min-h-screen bg-background grain-overlay py-32 px-8 md:px-16 flex items-center overflow-hidden"
    >
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
        {/* Left - Headline */}
        <div className="flex flex-col justify-center">
          <ScrollReveal delay={0}>
            <span className="text-xs tracking-[0.3em] text-muted-foreground font-sans mb-8 block">
              (01) — MANIFESTO
            </span>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif font-light leading-[1.1] text-foreground">
              Fashion is<br />
              not just<br />
              seen.
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif font-light italic text-foreground mt-4">
              It is<br />
              experienced.
            </h2>
          </ScrollReveal>
        </div>

        {/* Right - Body text */}
        <div className="flex flex-col justify-center lg:pt-24">
          <ScrollReveal delay={0.3} direction="right">
            <p className="text-xl md:text-2xl font-serif font-light leading-relaxed text-foreground/80">
              We are stripping away the barriers of traditional e-commerce. No more static grids. No more flat images. We bring the texture of the sidewalk, the noise of the city, and the intimacy of the boutique directly to your screen.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.4} direction="right">
            <a
              href="#"
              className="inline-flex items-center gap-3 mt-12 text-sm font-sans tracking-wide text-foreground group"
            >
              <span className="border-b border-foreground/50 pb-1 group-hover:border-foreground transition-colors">
                READ THE JOURNAL
              </span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default ManifestoSection;
