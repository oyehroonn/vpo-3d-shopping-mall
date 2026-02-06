import ScrollReveal from "@/components/ScrollReveal";

const JournalSection = () => {
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

  return (
    <section id="journal" className="relative z-10 bg-light border-t border-border/10">
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-16 md:py-24">
        {/* Header */}
        <ScrollReveal>
          <div className="flex items-end justify-between mb-12 md:mb-16">
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
        </ScrollReveal>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {articles.map((article, index) => (
            <ScrollReveal key={index} delay={0.1 * index}>
              <article className="group cursor-pointer">
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
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JournalSection;
