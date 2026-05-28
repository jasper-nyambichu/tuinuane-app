const logos = [
  "Acme Health", "Nairobi Tech", "EduSphere", "Voltora", "BrightCart",
  "ClinicPlus", "MwalimuOS", "ElectroKE", "FashionLab", "PesaPay",
];

const TrustMarquee = () => {
  return (
    <section className="py-16 md:py-20 border-y border-border bg-white/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-10">
          Trusted by ambitious teams across Africa
        </p>

        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />

          <div className="flex marquee gap-14 w-max">
            {[...logos, ...logos].map((name, i) => (
              <div
                key={i}
                className="font-display font-bold text-xl md:text-2xl text-foreground/40 hover:text-foreground transition-colors whitespace-nowrap tracking-tight"
              >
                {name}
              </div>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {[
            { v: "120+", l: "Projects delivered" },
            { v: "98%", l: "Client retention" },
            { v: "24h", l: "Proposal turnaround" },
            { v: "9", l: "Industries served" },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <div className="heading-display text-3xl md:text-4xl gradient-text">{s.v}</div>
              <div className="text-xs md:text-sm text-muted-foreground mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustMarquee;
