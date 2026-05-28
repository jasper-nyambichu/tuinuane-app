'use client'
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Phone, Mail } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import logo from "@/assets/logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border bg-card/40 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image src={logo} alt="Tuinuane Digitals" width={32} height={32} className="h-8 w-8 object-contain" />
              <span className="font-display font-extrabold text-lg text-foreground">
                Tuinuane<span className="gradient-text">Digitals</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground max-w-xs">
              Websites, e-commerce, school & clinical systems plus SEO and social media marketing for businesses across Kenya.
            </p>
          </div>

          <div>
            <h4 className="font-display font-bold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Services", to: ROUTES.SERVICES },
                { label: "Portfolio", to: ROUTES.PORTFOLIO },
                { label: "Pricing", to: ROUTES.PRICING },
                { label: "Contact", to: ROUTES.CONTACT },
                { label: "Get a Quote", to: ROUTES.GET_QUOTE },
              ].map((link) => (
                <li key={link.label}>

                  <Link href={link.to} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-foreground mb-4">Services</h4>
            <ul className="space-y-2.5">
              {["E-commerce Websites", "School Management", "Clinical Booking", "Business Websites", "SEO & Social Media"].map((s) => (
                <li key={s}>
                  <span className="text-sm text-muted-foreground">{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-foreground mb-4">Reach Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                <span className="text-sm text-muted-foreground">Serving clients worldwide</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <a href="tel:+254700000000" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  +254 700 000 000
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <a href="mailto:hello@tuinuanedigitals.co.ke" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  hello@tuinuanedigitals.co.ke
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">© {currentYear} Tuinuane Digitals. All rights reserved.</p>
          <span className="text-xs text-muted-foreground">Built with ❤️ by Tuinuane Digitals</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
