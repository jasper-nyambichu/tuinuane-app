// src/constants/chatKnowledge.ts
// Static knowledge base injected into Kali's system prompt.
// Update this file whenever prices, products, or processes change.
// Phase 2: replace this with Supabase pgvector RAG for dynamic retrieval.

export const KALI_KNOWLEDGE = `
=== PRODUCTS & PRICING ===

1. ShopHub — E-commerce Website
   - Best for: Retail shops, boutiques, grocery stores, any business selling products online
   - Features: M-Pesa & card payments, product catalogue, inventory management, 
     order tracking, delivery integration, mobile-responsive storefront
   - Starting price: KES 45,000
   - Timeline: 6–8 weeks
   - Includes: 3 months free support after launch

2. EduManage — School Management System
   - Best for: Primary schools, secondary schools, colleges, tutoring centres
   - Features: Student registration, fee collection & receipts, exam results, 
     class scheduling, staff management, parent portal, SMS notifications
   - Starting price: KES 80,000
   - Timeline: 10–12 weeks
   - Includes: Staff training + 3 months free support

3. ClinicCare — Medical Booking System
   - Best for: Clinics, hospitals, pharmacies, dental offices, wellness centres
   - Features: Online appointment booking, patient records, doctor schedules, 
     billing & invoicing, prescription tracking, SMS reminders
   - Starting price: KES 65,000
   - Timeline: 8–10 weeks
   - Includes: HIPAA-conscious data handling + 3 months free support

4. BizSite — Business Website
   - Best for: Any business needing a professional online presence
   - Features: Modern design, contact forms, WhatsApp integration, 
     Google Maps, photo gallery, SEO optimisation, mobile-responsive
   - Starting price: KES 25,000
   - Timeline: 3–4 weeks
   - Includes: 1 month free support + domain setup assistance

5. Custom Solution
   - Best for: Unique business needs not covered by standard products
   - Examples: Custom ERP, inventory systems, booking platforms, marketplaces
   - Pricing: Scoped per project — free proposal within 24 hours
   - Timeline: Depends on scope — discussed during proposal
   - First step: Fill the proposal form at /get-quote

=== OUR PROCESS ===

1. Client submits proposal request (via chat or /get-quote form)
2. Team reviews the brief within 2 hours
3. AI-generated custom proposal sent within 24 hours — includes scope, features, timeline, pricing
4. Client reviews and approves
5. 50% deposit to begin, 50% on delivery
6. Development with weekly progress updates
7. Launch + support period begins

=== FREQUENTLY ASKED QUESTIONS ===

Q: Do you work with businesses outside Nairobi?
A: Yes. We work with businesses across Kenya and East Africa. Everything is done remotely with video calls and WhatsApp updates.

Q: Can I pay in instalments?
A: Yes. Standard is 50% upfront, 50% on delivery. For larger projects we can discuss a milestone-based payment plan.

Q: Do you host the websites you build?
A: Yes. We handle hosting, domain setup, SSL certificates, and ongoing maintenance. Hosting is charged separately after launch.

Q: How do I get a proposal?
A: Two ways — chat with Kali (that is me) and I will collect your details, or go directly to /get-quote and fill the form. You get a proposal within 24 hours.

Q: What happens after my project launches?
A: Every product includes a free support period (1–3 months depending on product). After that, monthly maintenance plans are available.

Q: Can you integrate M-Pesa?
A: Yes. M-Pesa Daraja API integration is included in ShopHub and ClinicCare. It can be added to other products for an additional fee.

Q: Do you sign NDAs?
A: Yes. We sign NDAs before sharing any sensitive business details.

=== CONTACT & ESCALATION ===
WhatsApp / Call: +254 700 000 000
Email: hello@tuinuanedigitals.co.ke
Proposal form: /get-quote
Admin response time: within 2 hours (business hours), within 24 hours (weekends)
`