import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ManifestoSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subHeadlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const leftCol = leftColRef.current;
    const rightCol = rightColRef.current;
    const headline = headlineRef.current;
    const subHeadline = subHeadlineRef.current;
    const body = bodyRef.current;
    const link = linkRef.current;

    if (!section || !leftCol || !rightCol || !headline || !subHeadline || !body || !link) return;

    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set([headline, subHeadline], { 
        opacity: 0, 
        y: 60,
        willChange: "transform, opacity"
      });
      gsap.set([body, link], { 
        opacity: 0, 
        y: 40,
        willChange: "transform, opacity"
      });

      // Create timeline for coordinated animations
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          end: "center center",
          toggleActions: "play none none reverse",
        },
      });

      // Animate headlines with stagger
      tl.to(headline, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
      })
      .to(subHeadline, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
      }, "-=0.7")
      // Animate body text
      .to(body, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      }, "-=0.5")
      // Animate link
      .to(link, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
      }, "-=0.4");

      // Parallax effect on the right column
      gsap.to(rightCol, {
        yPercent: -15,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative z-10 min-h-screen bg-background grain-overlay py-32 px-8 md:px-16 flex items-center overflow-hidden"
    >
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
        {/* Left - Headline */}
        <div ref={leftColRef} className="flex flex-col justify-center">
          <span className="text-xs tracking-[0.3em] text-muted-foreground font-sans mb-8">
            (01) — MANIFESTO
          </span>
          <h2 
            ref={headlineRef}
            className="text-5xl md:text-6xl lg:text-7xl font-serif font-light leading-[1.1] text-foreground"
          >
            Fashion is<br />
            not just<br />
            seen.
          </h2>
          <h2 
            ref={subHeadlineRef}
            className="text-5xl md:text-6xl lg:text-7xl font-serif font-light italic text-foreground mt-4"
          >
            It is<br />
            experienced.
          </h2>
        </div>

        {/* Right - Body text */}
        <div ref={rightColRef} className="flex flex-col justify-center lg:pt-24">
          <p 
            ref={bodyRef}
            className="text-xl md:text-2xl font-serif font-light leading-relaxed text-foreground/80"
          >
            We are stripping away the barriers of traditional e-commerce. No more static grids. No more flat images. We bring the texture of the sidewalk, the noise of the city, and the intimacy of the boutique directly to your screen.
          </p>
          <a
            ref={linkRef}
            href="#"
            className="inline-flex items-center gap-3 mt-12 text-sm font-sans tracking-wide text-foreground group"
          >
            <span className="border-b border-foreground/50 pb-1 group-hover:border-foreground transition-colors">
              READ THE JOURNAL
            </span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default ManifestoSection;
