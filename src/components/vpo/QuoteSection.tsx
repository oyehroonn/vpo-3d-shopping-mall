import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const QuoteSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const quoteMarkRef = useRef<HTMLDivElement>(null);
  const quoteTextRef = useRef<HTMLQuoteElement>(null);
  const attributionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const quoteMark = quoteMarkRef.current;
    const quoteText = quoteTextRef.current;
    const attribution = attributionRef.current;
    const grid = gridRef.current;

    if (!section || !quoteMark || !quoteText || !attribution) return;

    const ctx = gsap.context(() => {
      // Grid parallax
      if (grid) {
        gsap.to(grid, {
          yPercent: 10,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // Quote mark scale animation
      gsap.set(quoteMark, { opacity: 0, scale: 0.5 });
      gsap.to(quoteMark, {
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });

      // Quote text reveal with scrub
      gsap.set(quoteText, { 
        opacity: 0, 
        y: 60,
        willChange: "transform, opacity"
      });
      
      gsap.to(quoteText, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 60%",
          toggleActions: "play none none reverse",
        },
      });

      // Attribution fade in
      gsap.set(attribution, { opacity: 0, y: 20 });
      gsap.to(attribution, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 50%",
          toggleActions: "play none none reverse",
        },
      });

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative z-10 min-h-screen bg-light flex flex-col items-center justify-center px-8 py-32 overflow-hidden"
    >
      {/* Grid pattern background */}
      <div 
        ref={gridRef}
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(0 0% 50%) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(0 0% 50%) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          willChange: "transform",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Quote marks */}
        <div ref={quoteMarkRef} className="text-6xl font-serif text-vpo-subtle/40 mb-8">"</div>

        {/* Quote text */}
        <blockquote 
          ref={quoteTextRef}
          className="text-3xl md:text-5xl lg:text-6xl font-serif italic font-light leading-tight text-light tracking-tight"
        >
          "The future of retail is not about convenience. It is about immersion, emotion, and the digital sublime."
        </blockquote>

        {/* Attribution */}
        <div ref={attributionRef} className="mt-16 space-y-2">
          <p className="text-sm font-sans tracking-[0.2em] text-light font-medium">VPO JOURNAL</p>
          <p className="text-sm font-sans text-vpo-subtle">Vol. 4, Issue 12</p>
        </div>
      </div>
    </section>
  );
};

export default QuoteSection;
