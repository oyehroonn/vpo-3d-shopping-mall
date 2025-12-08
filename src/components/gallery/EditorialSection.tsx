import { ArrowRight } from "lucide-react";

interface EditorialSectionProps {
  sectionNumber: string;
  sectionLabel: string;
  headline: string;
  headlineItalic: string;
  description: string;
  linkText?: string;
  linkHref?: string;
  features?: string[];
  className?: string;
}

const EditorialSection = ({
  sectionNumber,
  sectionLabel,
  headline,
  headlineItalic,
  description,
  linkText,
  linkHref = "#",
  features,
  className = "",
}: EditorialSectionProps) => {
  return (
    <div className={`flex flex-col justify-center h-full px-8 md:px-16 lg:px-20 py-16 ${className}`}>
      {/* Section Label */}
      <p className="font-sans text-xs tracking-[0.25em] text-muted-foreground/60 uppercase mb-8">
        {sectionNumber} — {sectionLabel}
      </p>

      {/* Headline */}
      <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal leading-[1.1] text-light mb-2">
        {headline}
      </h2>
      <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal italic leading-[1.1] text-light/80 mb-10">
        {headlineItalic}.
      </h2>

      {/* Divider */}
      <div className="w-12 h-px bg-muted-foreground/30 mb-8" />

      {/* Description */}
      <p className="font-sans text-base md:text-lg leading-relaxed text-light/70 max-w-md mb-8">
        {description}
      </p>

      {/* Features list */}
      {features && features.length > 0 && (
        <div className="space-y-3 mb-10">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-4 h-4 border border-muted-foreground/30 rounded-sm flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full" />
              </div>
              <span className="font-sans text-sm text-light/60">{feature}</span>
            </div>
          ))}
        </div>
      )}

      {/* CTA Link */}
      {linkText && (
        <a 
          href={linkHref}
          className="group inline-flex items-center gap-3 font-sans text-xs tracking-[0.2em] text-light uppercase hover:text-light/70 transition-colors"
        >
          <span className="border-b border-light/40 pb-0.5 group-hover:border-light/20 transition-colors">
            {linkText}
          </span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </a>
      )}
    </div>
  );
};

export default EditorialSection;
