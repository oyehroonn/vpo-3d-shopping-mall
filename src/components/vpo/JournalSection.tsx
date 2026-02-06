import ScrollReveal from "@/components/ScrollReveal";

const JournalSection = () => {
  const articles = [
    {
      image: "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?q=80&w=2670&auto=format&fit=crop",
      category: "Editorial",
      date: "Oct 12, 2024",
      title: "Digital Tactility",
      description: "Exploring how haptic feedback allows users to 'feel' virtual velvet.",
    },
    {
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2670&auto=format&fit=crop",
      category: "Tech",
      date: "Oct 08, 2024",
      title: "The Infinite Mall",
      description: "Why infinite procedural generation is the future of discovery.",
    },
    {
      image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2670&auto=format&fit=crop",
      category: "Collab",
      date: "Oct 01, 2024",
      title: "VPO x Balenciaga",
      description: "A deep dive into the first gravity-defying couture collection.",
    },
  ];

  return (
    <section id="journal" className="relative z-10 py-32 bg-[#FDFBF7] text-[#1a1918] border-t border-stone-200">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12">
        {/* Header */}
        <ScrollReveal>
          <div className="flex items-end justify-between mb-16 border-b border-stone-200 pb-6">
            <h2 className="text-4xl md:text-5xl font-serif text-[#1a1918]">
              The Journal
            </h2>
            <a
              href="#"
              className="text-[10px] uppercase tracking-widest hover:opacity-60 transition-opacity"
            >
              View Archive
            </a>
          </div>
        </ScrollReveal>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <ScrollReveal key={index} delay={0.1 * index}>
              <article className="group cursor-pointer">
                {/* Image Container */}
                <div className="aspect-[4/5] w-full overflow-hidden mb-6 bg-stone-100 relative">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out"
                  />
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 bg-white px-3 py-1 text-[9px] uppercase tracking-widest">
                    {article.category}
                  </div>
                </div>

                {/* Content */}
                <div>
                  <span className="text-[9px] text-stone-400 uppercase tracking-widest block mb-2">
                    {article.date}
                  </span>
                  <h3 className="text-xl font-serif italic text-[#1a1918] mb-3 group-hover:underline decoration-1 underline-offset-4 decoration-stone-300">
                    {article.title}
                  </h3>
                  <p className="text-xs text-stone-500 font-light leading-relaxed line-clamp-2">
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
