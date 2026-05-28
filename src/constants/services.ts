import { Stethoscope, ShoppingBag, GraduationCap, Globe, Megaphone, Search, PenTool, Share2 } from "lucide-react";

export const services = [
  {
    id: "shophub",
    title: "ShopHub",
    subtitle: "E-commerce Websites",
    description:
      "Full-featured online stores tailored for electrical shops, household goods, and clothing brands. Beautiful product galleries, M-Pesa & card checkout, inventory tracking and order management — built to convert browsers into buyers.",
    icon: ShoppingBag,
    features: [
      "Electrical, household & fashion storefronts",
      "Rich product galleries with real imagery",
      "M-Pesa, card & cash-on-delivery checkout",
      "Inventory, orders & delivery tracking",
    ],
    price: "KES 60,000",
    priceLabel: "one-time setup",
    mrr: "KES 3,500/month",
    mrrLabel: "maintenance",
    target: "Retailers in electricals, households & clothing",
    color: "hsl(35 100% 55%)",
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80",
  },
  {
    id: "edumanage",
    title: "EduManage",
    subtitle: "School Management Systems",
    description:
      "An end-to-end management platform for Kenyan private schools — nurseries, primary, junior secondary, high schools, colleges and tuition centers. Handle admissions, fees, academics, attendance and parent communication from one portal.",
    icon: GraduationCap,
    features: [
      "Admissions, students & class records",
      "Fee invoicing, M-Pesa & receipts",
      "Exams, grading & report cards",
      "Parent SMS / email notifications",
    ],
    price: "KES 70,000",
    priceLabel: "one-time setup",
    mrr: "KES 4,000/month",
    mrrLabel: "maintenance",
    target: "Private schools, colleges & tuition centers",
    color: "hsl(189 100% 45%)",
    image:
      "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200&q=80",
  },
  {
    id: "cliniccare",
    title: "ClinicCare",
    subtitle: "Medical & Clinical Booking Systems",
    description:
      "Professional websites with online appointment booking for clinics, hospitals, dentists and specialists. Patients book in seconds, get automatic reminders, and doctors manage schedules effortlessly.",
    icon: Stethoscope,
    features: [
      "Online appointment booking",
      "Doctor schedules & availability",
      "Patient SMS / email reminders",
      "Secure patient records",
    ],
    price: "KES 50,000",
    priceLabel: "one-time setup",
    mrr: "KES 3,000/month",
    mrrLabel: "maintenance",
    target: "Clinics, hospitals & private practitioners",
    color: "hsl(150 70% 45%)",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80",
  },
  {
    id: "bizsite",
    title: "BizSite",
    subtitle: "Business & Corporate Websites",
    description:
      "Modern, fast, SEO-ready websites for SMEs, startups, NGOs and professionals. Perfect when you need a strong online presence with contact, services and portfolio pages without the complexity of a full system.",
    icon: Globe,
    features: [
      "Custom responsive design",
      "SEO-ready structure",
      "Contact forms & WhatsApp integration",
      "Free first-year hosting & SSL",
    ],
    price: "KES 40,000",
    priceLabel: "one-time setup",
    mrr: "KES 2,000/month",
    mrrLabel: "maintenance",
    target: "SMEs, startups, NGOs & professionals",
    color: "hsl(245 90% 65%)",
    image:
      "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&q=80",
  },
] as const;

export const marketingServices = [
  {
    id: "social",
    title: "Social Media Marketing",
    description:
      "Content planning, posting, paid ads and community growth across Facebook, Instagram, TikTok, X and LinkedIn.",
    icon: Share2,
    price: "From KES 15,000/month",
    color: "hsl(330 80% 55%)",
  },
  {
    id: "seo",
    title: "SEO & Google Ranking",
    description:
      "On-page SEO, keyword strategy, Google Business optimization and monthly reports to grow organic traffic.",
    icon: Search,
    price: "From KES 20,000/month",
    color: "hsl(189 100% 45%)",
  },
  {
    id: "ads",
    title: "Google & Meta Ads",
    description:
      "ROI-focused paid campaigns on Google, Facebook and Instagram — setup, creatives, targeting and optimization.",
    icon: Megaphone,
    price: "From KES 18,000/month",
    color: "hsl(354 70% 50%)",
  },
  {
    id: "branding",
    title: "Branding & Graphic Design",
    description:
      "Logos, brand identity, business profiles, flyers and product mockups crafted to make your business stand out.",
    icon: PenTool,
    price: "From KES 10,000",
    color: "hsl(35 100% 55%)",
  },
] as const;

export const processSteps = [
  {
    step: 1,
    title: "Tell Us What You Need",
    description: "Share your idea via our quote form or chat with our AI. We learn your business in minutes.",
  },
  {
    step: 2,
    title: "We Design & Build",
    description: "A custom system or website tailored to your business — delivered in days, not months.",
  },
  {
    step: 3,
    title: "Launch & Maintain",
    description: "You go live. We handle hosting, updates and support so you can focus on growth.",
  },
];

export const testimonials = [
  {
    quote: "Tuinuane Digitals built our online electrical shop and orders started coming in the first week. The M-Pesa checkout is seamless.",
    name: "Brian K.",
    business: "Electricals Retailer, Nairobi",
    initials: "BK",
  },
  {
    quote: "Our school finally has one portal for fees, exams and parents. Outstanding balances dropped massively in the first term.",
    name: "Mrs. Akinyi",
    business: "Director, Private Academy",
    initials: "MA",
  },
  {
    quote: "Patients now book online and reminders cut our no-shows by more than half. Truly worth every shilling.",
    name: "Dr. Otieno",
    business: "Private Clinic, Kisumu",
    initials: "DO",
  },
];

export const portfolioItems = [
  {
    title: "Electricals Online Store",
    category: "E-commerce",
    description: "Online shop for an electrical retailer with full product catalog, M-Pesa checkout and delivery tracking.",
    image: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=1200&q=80",
  },
  {
    title: "Fashion Boutique",
    category: "E-commerce",
    description: "Clothing storefront with lookbook galleries, size variants and integrated mobile payments.",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80",
  },
  {
    title: "Household Goods Marketplace",
    category: "E-commerce",
    description: "Multi-category store for home appliances and household essentials with rich product imagery.",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80",
  },
  {
    title: "Private School Portal",
    category: "Education",
    description: "Full school management system covering admissions, fees, exams and parent SMS notifications.",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1200&q=80",
  },
  {
    title: "Dental Clinic Booking",
    category: "Healthcare",
    description: "Appointment booking site for a dental clinic with patient reminders and doctor schedules.",
    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1200&q=80",
  },
  {
    title: "SME Corporate Website",
    category: "Business",
    description: "Modern SEO-ready company website with services, portfolio and WhatsApp lead capture.",
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&q=80",
  },
];
