import ScrollReveal from "@/components/ScrollReveal";

const QuoteSection = () => {
  return (
    <section 
      className="relative z-10 min-h-screen bg-light flex flex-col items-center justify-center px-8 py-32 overflow-hidden"
    >
      {/* Grid pattern background */}
      <div 
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--muted-foreground)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--muted-foreground)) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Quote marks */}
        <ScrollReveal direction="scale">
          <div className="text-6xl font-serif text-vpo-subtle/40 mb-8">"</div>
        </ScrollReveal>

        {/* Quote text */}
        <ScrollReveal delay={0.1}>
          <blockquote 
            className="text-3xl md:text-5xl lg:text-6xl font-serif italic font-light leading-tight text-light tracking-tight"
          >
            "The future of retail is not about convenience. It is about immersion, emotion, and the digital sublime."
          </blockquote>
        </ScrollReveal>

        {/* Attribution */}
        <ScrollReveal delay={0.2}>
          <div className="mt-16 space-y-2">
            <p className="text-sm font-sans tracking-[0.2em] text-light font-medium">VPO JOURNAL</p>
            <p className="text-sm font-sans text-vpo-subtle">Vol. 4, Issue 12</p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default QuoteSection;
