import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const JournalSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const articleRefs = useRef<(HTMLDivElement | null)[]>([]);

  const articles = [
    {
      image: "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=800&q=90",
      category: "Editorial",
      date: "Oct 12, 2024",
      title: "Digital Tactility",
      description: "Exploring how haptic feedback allows users to 'feel' virtual velvet.",
    },
    {
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=90",
      category: "Tech",
      date: "Oct 08, 2024",
      title: "The Infinite Mall",
      description: "Why infinite procedural generation is the future of discovery.",
    },
    {
      image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=90",
      category: "Collab",
      date: "Oct 01, 2024",
      title: "VPO x Balenciaga",
      description: "A deep dive into the first gravity-defying couture collection.",
    },
  ];

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;

    if (!section || !header) return;

    const ctx = gsap.context(() => {
      // Header fade in
      gsap.set(header, { opacity: 0, y: 40 });
      gsap.to(header, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });

      // Articles staggered reveal
      articleRefs.current.forEach((article, index) => {
        if (!article) return;

        gsap.set(article, { opacity: 0, y: 60 });
        gsap.to(article, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: index * 0.15,
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
    <section ref={sectionRef} id="journal" className="relative z-10 bg-light border-t border-border/10">
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-16 md:py-24">
        {/* Header */}
        <div ref={headerRef} className="flex items-end justify-between mb-12 md:mb-16">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-light italic">
            The Journal
          </h2>
          <a
            href="#"
            className="text-sm text-vpo-subtle font-sans underline underline-offset-4 decoration-vpo-subtle/30 hover:text-light hover:decoration-light transition-colors"
          >
            View Archive
          </a>
        </div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {articles.map((article, index) => (
            <article 
              key={index} 
              ref={(el: HTMLElement | null) => {
                if (el) articleRefs.current[index] = el as HTMLDivElement;
              }}
              className="group cursor-pointer"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/5] overflow-hidden mb-6">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out"
                />
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-light bg-background/90 backdrop-blur-sm px-3 py-1.5 font-sans">
                    {article.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div>
                <span className="text-xs text-vpo-subtle font-sans block mb-2">
                  {article.date}
                </span>
                <h3 className="font-display text-xl md:text-2xl text-light italic mb-3 group-hover:underline decoration-1 underline-offset-4 decoration-vpo-subtle/30">
                  {article.title}
                </h3>
                <p className="text-sm text-vpo-subtle font-sans leading-relaxed">
                  {article.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JournalSection;
