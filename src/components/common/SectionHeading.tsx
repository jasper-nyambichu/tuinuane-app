interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

const SectionHeading = ({ eyebrow, title, subtitle, centered = true, className = "" }: SectionHeadingProps) => {
  return (
    <div className={`${centered ? "text-center" : ""} mb-12 md:mb-16 ${className}`}>
      {eyebrow && (
        <span className="inline-block text-sm font-semibold tracking-widest uppercase text-primary mb-3">
          {eyebrow}
        </span>
      )}
      <h2 className="heading-display text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight" style={{ textWrap: "balance" }}>
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-muted-foreground text-base md:text-lg max-w-2xl mx-auto" style={{ textWrap: "pretty" }}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;
