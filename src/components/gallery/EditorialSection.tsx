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
    <div className={`flex flex-col justify-center h-full px-10 md:px-16 lg:px-24 py-20 md:py-24 ${className}`}>
      {/* Section Label */}
      <p className="font-sans text-[11px] tracking-[0.35em] text-[hsl(30_6%_45%)] uppercase mb-10 md:mb-14">
        {sectionNumber} — {sectionLabel}
      </p>

      {/* Headline */}
      <h2 className="font-serif text-[2.75rem] md:text-[3.5rem] lg:text-[4.5rem] font-light leading-[0.95] tracking-[-0.02em] text-[hsl(30_10%_15%)] mb-1">
        {headline}
      </h2>
      <h2 className="font-serif text-[2.75rem] md:text-[3.5rem] lg:text-[4.5rem] font-light italic leading-[0.95] tracking-[-0.01em] text-[hsl(30_8%_30%)] mb-12 md:mb-16">
        {headlineItalic}.
      </h2>

      {/* Elegant Divider */}
      <div className="w-16 h-[1px] bg-gradient-to-r from-[hsl(30_8%_60%)] to-transparent mb-10 md:mb-12" />

      {/* Description */}
      <p className="font-sans text-[15px] md:text-base leading-[1.85] text-[hsl(30_6%_35%)] max-w-[420px] mb-10 md:mb-12 font-light">
        {description}
      </p>

      {/* Features list */}
      {features && features.length > 0 && (
        <div className="space-y-4 mb-12">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="w-5 h-5 border border-[hsl(30_8%_70%)] flex items-center justify-center">
                <div className="w-1 h-1 bg-[hsl(30_8%_50%)]" />
              </div>
              <span className="font-sans text-[13px] tracking-wide text-[hsl(30_6%_40%)] font-light">
                {feature}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* CTA Link */}
      {linkText && (
        <a 
          href={linkHref}
          className="group inline-flex items-center gap-4 mt-2"
        >
          <span className="font-sans text-[11px] tracking-[0.25em] text-[hsl(30_10%_18%)] uppercase font-medium border-b border-[hsl(30_8%_30%)] pb-1 group-hover:border-[hsl(30_8%_50%)] transition-colors duration-300">
            {linkText}
          </span>
          <ArrowRight className="w-4 h-4 text-[hsl(30_8%_35%)] transition-all duration-300 group-hover:translate-x-1.5 group-hover:text-[hsl(30_8%_20%)]" />
        </a>
      )}
    </div>
  );
};

export default EditorialSection;