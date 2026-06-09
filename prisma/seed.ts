/**
 * Database seed — realistic Polish-market sample data.
 * Idempotent: uses upsert on unique slugs so it can be re-run safely.
 *
 *   npm run db:seed
 */
import { PrismaClient } from "@prisma/client";
import { createHash } from "node:crypto";

const prisma = new PrismaClient();

// Lightweight password hashing for the demo admin (swap for bcrypt/argon2 in prod).
function hash(pw: string) {
  return createHash("sha256").update(pw).digest("hex");
}

// Official brand icons bundled in /public/logos (fetched from each brand's own
// site / favicon service). Link4 has no fetchable icon → bundled SVG fallback.
const brandLogo: Record<string, string> = {
  mbank: "/logos/mbank-real.png",
  ing: "/logos/ing-real.png",
  santander: "/logos/santander-real.png",
  "pko-bp": "/logos/pko-bp-real.jpg",
  revolut: "/logos/revolut-real.png",
  millennium: "/logos/millennium-real.jpg",
  "nest-bank": "/logos/nest-bank-real.png",
  pzu: "/logos/pzu-real.png",
  warta: "/logos/warta-real.png",
  link4: "/logos/link4.svg",
  allianz: "/logos/allianz-real.png",
  "ergo-hestia": "/logos/ergo-hestia-real.png",
};

async function main() {
  console.log("🌱 Seeding database...");

  // --- Admin user ---
  await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL ?? "admin@example.com" },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL ?? "admin@example.com",
      name: "Admin",
      role: "ADMIN",
      passwordHash: hash(process.env.ADMIN_PASSWORD ?? "admin123"),
    },
  });

  // --- Categories ---
  const categories = [
    { slug: "personal-accounts", name: "Personal accounts", vertical: "BANKING", icon: "Wallet", order: 1, featured: true, description: "Everyday checking accounts for individuals." },
    { slug: "business-accounts", name: "Business accounts", vertical: "BANKING", icon: "Briefcase", order: 2, featured: true, description: "Accounts for companies, sole traders and startups." },
    { slug: "cashback-cards", name: "Cards with cashback", vertical: "BANKING", icon: "CreditCard", order: 3, featured: true, description: "Debit and credit cards that pay you back." },
    { slug: "accounts-for-foreigners", name: "Accounts for foreigners", vertical: "BANKING", icon: "Globe", order: 4, description: "Open an account in Poland without a PESEL." },
    { slug: "online-account-opening", name: "Online account opening", vertical: "BANKING", icon: "Laptop", order: 5, description: "100% online sign-up, no branch visit." },
    { slug: "premium-banking", name: "Premium banking", vertical: "BANKING", icon: "Crown", order: 6, description: "Premium accounts with concierge perks." },
    { slug: "student-accounts", name: "Student accounts", vertical: "BANKING", icon: "GraduationCap", order: 7, description: "Free accounts for students under 26." },
    { slug: "car-insurance", name: "Car insurance", vertical: "INSURANCE", icon: "Car", order: 8, featured: true, description: "OC and AC car insurance compared." },
    { slug: "home-insurance", name: "Home insurance", vertical: "INSURANCE", icon: "Home", order: 9, featured: true, description: "Protect your flat or house." },
    { slug: "health-insurance", name: "Health insurance", vertical: "INSURANCE", icon: "HeartPulse", order: 10, description: "Private healthcare packages." },
    { slug: "life-insurance", name: "Life insurance", vertical: "INSURANCE", icon: "ShieldCheck", order: 11, description: "Financial security for your family." },
    { slug: "travel-insurance", name: "Travel insurance", vertical: "INSURANCE", icon: "Plane", order: 12, description: "Cover for trips abroad." },
    { slug: "business-insurance", name: "Business insurance", vertical: "INSURANCE", icon: "Building2", order: 13, description: "Liability and property cover for firms." },
  ];

  const categoryMap: Record<string, string> = {};
  for (const c of categories) {
    const row = await prisma.category.upsert({
      where: { slug: c.slug },
      update: c,
      create: c,
    });
    categoryMap[c.slug] = row.id;
  }

  // --- Banks ---
  const banks = [
    { slug: "mbank", name: "mBank", website: "https://mbank.pl", logoUrl: "https://logo.clearbit.com/mbank.pl", description: "Digital-first Polish bank." },
    { slug: "ing", name: "ING Bank Śląski", website: "https://ing.pl", logoUrl: "https://logo.clearbit.com/ing.pl", description: "One of Poland's largest banks." },
    { slug: "santander", name: "Santander Bank Polska", website: "https://santander.pl", logoUrl: "https://logo.clearbit.com/santander.pl", description: "Global banking group in Poland." },
    { slug: "pko-bp", name: "PKO Bank Polski", website: "https://pkobp.pl", logoUrl: "https://logo.clearbit.com/pkobp.pl", description: "Poland's largest bank." },
    { slug: "revolut", name: "Revolut", website: "https://revolut.com", logoUrl: "https://logo.clearbit.com/revolut.com", description: "Borderless digital banking." },
    { slug: "millennium", name: "Bank Millennium", website: "https://bankmillennium.pl", logoUrl: "https://logo.clearbit.com/bankmillennium.pl", description: "Modern retail bank." },
    { slug: "nest-bank", name: "Nest Bank", website: "https://nestbank.pl", logoUrl: "https://logo.clearbit.com/nestbank.pl", description: "Bank for entrepreneurs." },
  ];
  const bankMap: Record<string, string> = {};
  for (const b of banks) {
    const data = { ...b, logoUrl: brandLogo[b.slug] ?? b.logoUrl };
    const row = await prisma.bank.upsert({ where: { slug: b.slug }, update: data, create: data });
    bankMap[b.slug] = row.id;
  }

  // --- Insurance providers ---
  const providers = [
    { slug: "pzu", name: "PZU", website: "https://pzu.pl", logoUrl: "https://logo.clearbit.com/pzu.pl", description: "Poland's largest insurer." },
    { slug: "warta", name: "Warta", website: "https://warta.pl", logoUrl: "https://logo.clearbit.com/warta.pl", description: "Established Polish insurer." },
    { slug: "link4", name: "Link4", website: "https://link4.pl", logoUrl: "https://logo.clearbit.com/link4.pl", description: "Direct car insurance." },
    { slug: "allianz", name: "Allianz", website: "https://allianz.pl", logoUrl: "https://logo.clearbit.com/allianz.pl", description: "Global insurance group." },
    { slug: "ergo-hestia", name: "ERGO Hestia", website: "https://ergohestia.pl", logoUrl: "https://logo.clearbit.com/ergohestia.pl", description: "Premium insurance brand." },
  ];
  const providerMap: Record<string, string> = {};
  for (const p of providers) {
    const data = { ...p, logoUrl: brandLogo[p.slug] ?? p.logoUrl };
    const row = await prisma.insuranceProvider.upsert({ where: { slug: p.slug }, update: data, create: data });
    providerMap[p.slug] = row.id;
  }

  // --- Authors ---
  const authors = [
    { slug: "anna-kowalska", name: "Anna Kowalska", role: "Senior finance editor", bio: "Anna has 10 years of experience covering retail banking and personal finance in Poland.", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80" },
    { slug: "marek-nowak", name: "Marek Nowak", role: "Insurance analyst", bio: "Marek specialises in insurance products and consumer protection.", avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80" },
  ];
  const authorMap: Record<string, string> = {};
  for (const a of authors) {
    const row = await prisma.author.upsert({ where: { slug: a.slug }, update: a, create: a });
    authorMap[a.slug] = row.id;
  }

  // --- Products ---
  type Seed = {
    slug: string;
    name: string;
    tagline: string;
    summary: string;
    type: string;
    categorySlug: string;
    bank?: string;
    provider?: string;
    logoUrl?: string;
    monthlyFee?: number;
    cardFee?: number;
    cashbackPercent?: number;
    promoAmount?: number;
    currency?: string;
    flags?: Partial<Record<
      "onlineOpening" | "applePay" | "googlePay" | "blik" | "foreignersFriendly" | "businessFriendly" | "freeMaintenance" | "eurAccount" | "noPeselRequired",
      boolean
    >>;
    pros: string[];
    cons: string[];
    benefits: string[];
    requirements: string[];
    badges?: string[];
    popularity: number;
    featured?: boolean;
    rating: { overall: number; fees: number; usability: number; support: number; benefits: number; reviewCount: number };
    features: { group: string; label: string; value: string }[];
    faqs: { question: string; answer: string }[];
    affiliate: { partner: string; url: string };
  };

  const products: Seed[] = [
    {
      slug: "mbank-ekonto",
      name: "mBank eKonto",
      tagline: "The all-rounder current account, free for active users",
      summary: "eKonto is mBank's flagship personal account: no monthly fee when you pay by card, a slick mobile app, BLIK, Apple Pay and Google Pay out of the box.",
      type: "PERSONAL_ACCOUNT",
      categorySlug: "personal-accounts",
      bank: "mbank",
      monthlyFee: 0,
      cardFee: 0,
      promoAmount: 200,
      flags: { onlineOpening: true, applePay: true, googlePay: true, blik: true, freeMaintenance: true, foreignersFriendly: true },
      pros: ["No monthly fee with card activity", "Excellent mobile app", "Welcome bonus up to 200 PLN", "Free ATM withdrawals in Poland"],
      cons: ["Fee applies without monthly card payment", "Currency exchange spread on card"],
      benefits: ["Apple Pay & Google Pay", "BLIK payments", "Free virtual card", "Real-time spend notifications"],
      requirements: ["18+ years old", "Polish address or residence permit", "Valid ID document"],
      badges: ["Editor's pick", "Popular choice"],
      popularity: 98,
      featured: true,
      rating: { overall: 4.8, fees: 4.9, usability: 4.9, support: 4.4, benefits: 4.6, reviewCount: 1240 },
      features: [
        { group: "Fees", label: "Monthly fee", value: "0 PLN (with card payment)" },
        { group: "Fees", label: "Card fee", value: "0 PLN" },
        { group: "Fees", label: "ATM (Poland)", value: "Free" },
        { group: "Digital", label: "Mobile app", value: "iOS & Android" },
        { group: "Digital", label: "BLIK", value: "Yes" },
      ],
      faqs: [
        { question: "How do I avoid the monthly fee?", answer: "Make at least one card payment per month and the 0 PLN fee applies automatically." },
        { question: "Can I open the account online?", answer: "Yes, the whole process is online and takes about 10 minutes with a video or transfer verification." },
      ],
      affiliate: { partner: "mBank Affiliate", url: "https://mbank.pl/ekonto?ref=finport" },
    },
    {
      slug: "ing-konto-direct",
      name: "ING Konto Direct",
      tagline: "Simple, transparent and genuinely free",
      summary: "Konto Direct from ING is a no-frills current account with zero monthly fee, free domestic transfers and a well-rated mobile app.",
      type: "PERSONAL_ACCOUNT",
      categorySlug: "personal-accounts",
      bank: "ing",
      monthlyFee: 0,
      cardFee: 0,
      flags: { onlineOpening: true, applePay: true, googlePay: true, blik: true, freeMaintenance: true },
      pros: ["Always 0 PLN monthly fee", "Free card with conditions", "Great savings integration"],
      cons: ["ATM fees outside ING network", "Card fee if low activity"],
      benefits: ["Apple Pay & Google Pay", "BLIK", "Smart saving goals", "24/7 support"],
      requirements: ["18+ years old", "Polish residence", "Valid ID"],
      badges: ["Low fees"],
      popularity: 90,
      featured: true,
      rating: { overall: 4.6, fees: 4.7, usability: 4.7, support: 4.5, benefits: 4.4, reviewCount: 980 },
      features: [
        { group: "Fees", label: "Monthly fee", value: "0 PLN" },
        { group: "Fees", label: "Card fee", value: "0 PLN (with activity)" },
        { group: "Digital", label: "BLIK", value: "Yes" },
      ],
      faqs: [
        { question: "Is the account really free?", answer: "Yes, the monthly account fee is always 0 PLN. A small card fee may apply if you don't use the card." },
      ],
      affiliate: { partner: "ING Affiliate", url: "https://ing.pl/konto-direct?ref=finport" },
    },
    {
      slug: "revolut-standard",
      name: "Revolut Standard",
      tagline: "Borderless banking for foreigners and travellers",
      summary: "Revolut Standard is ideal if you don't have a PESEL yet: open in minutes, hold EUR and 25+ currencies, and spend abroad at great rates.",
      type: "PERSONAL_ACCOUNT",
      categorySlug: "accounts-for-foreigners",
      bank: "revolut",
      monthlyFee: 0,
      cardFee: 0,
      flags: { onlineOpening: true, applePay: true, googlePay: true, foreignersFriendly: true, eurAccount: true, noPeselRequired: true, freeMaintenance: true },
      pros: ["No PESEL required", "Multi-currency EUR account", "Open in 5 minutes", "Great FX rates"],
      cons: ["Limited cash deposits", "Weekend FX markup", "Support mainly in-app"],
      benefits: ["EUR & 25+ currencies", "Apple Pay & Google Pay", "Instant virtual cards", "Budgeting tools"],
      requirements: ["Valid passport or EU ID", "Smartphone", "No PESEL needed"],
      badges: ["Popular with newcomers"],
      popularity: 95,
      featured: true,
      rating: { overall: 4.7, fees: 4.8, usability: 4.9, support: 4.0, benefits: 4.7, reviewCount: 2100 },
      features: [
        { group: "Fees", label: "Monthly fee", value: "0 PLN" },
        { group: "Account", label: "EUR account", value: "Yes" },
        { group: "Account", label: "PESEL required", value: "No" },
        { group: "Digital", label: "Currencies", value: "25+" },
      ],
      faqs: [
        { question: "Can I open Revolut without a PESEL?", answer: "Yes. Revolut only requires a valid passport or national ID, making it popular with newcomers to Poland." },
        { question: "Does it support EUR?", answer: "Yes, you can hold and exchange EUR alongside 25+ other currencies." },
      ],
      affiliate: { partner: "Revolut Affiliate", url: "https://revolut.com/pl?ref=finport" },
    },
    {
      slug: "santander-konto-jakie-chce",
      name: "Santander Konto Jakie Chcę",
      tagline: "Flexible account with strong cashback",
      summary: "A customisable account with up to 2% cashback on selected categories and a polished app experience.",
      type: "PERSONAL_ACCOUNT",
      categorySlug: "cashback-cards",
      bank: "santander",
      monthlyFee: 0,
      cardFee: 0,
      cashbackPercent: 2,
      flags: { onlineOpening: true, applePay: true, googlePay: true, blik: true, freeMaintenance: true },
      pros: ["Up to 2% cashback", "Free with conditions", "Wide branch network"],
      cons: ["Cashback capped monthly", "Conditions for free maintenance"],
      benefits: ["2% cashback categories", "Apple Pay & Google Pay", "BLIK", "Multicurrency card option"],
      requirements: ["18+ years old", "Polish residence", "Valid ID"],
      badges: ["Cashback"],
      popularity: 88,
      featured: true,
      rating: { overall: 4.5, fees: 4.4, usability: 4.5, support: 4.3, benefits: 4.7, reviewCount: 760 },
      features: [
        { group: "Rewards", label: "Cashback", value: "Up to 2%" },
        { group: "Fees", label: "Monthly fee", value: "0 PLN (with conditions)" },
        { group: "Digital", label: "BLIK", value: "Yes" },
      ],
      faqs: [
        { question: "How much cashback can I earn?", answer: "Up to 2% on selected categories, subject to a monthly cap defined in the current promotion." },
      ],
      affiliate: { partner: "Santander Affiliate", url: "https://santander.pl/konto?ref=finport" },
    },
    {
      slug: "nest-konto-biznes",
      name: "Nest Konto Biznes",
      tagline: "Built for sole traders and small companies",
      summary: "A business account with free maintenance, free domestic transfers and accounting integrations — ideal for JDG and small firms.",
      type: "BUSINESS_ACCOUNT",
      categorySlug: "business-accounts",
      bank: "nest-bank",
      monthlyFee: 0,
      cardFee: 0,
      flags: { onlineOpening: true, businessFriendly: true, freeMaintenance: true, blik: true },
      pros: ["Free business maintenance", "Free domestic transfers", "Accounting integrations", "Fast online setup"],
      cons: ["Cash deposit fees", "Fewer branches"],
      benefits: ["Free ZUS & US transfers", "Invoicing tools", "Business card included", "Multi-user access"],
      requirements: ["Registered business (JDG/sp. z o.o.)", "NIP number", "Valid ID"],
      badges: ["For business"],
      popularity: 84,
      featured: true,
      rating: { overall: 4.5, fees: 4.7, usability: 4.4, support: 4.2, benefits: 4.5, reviewCount: 540 },
      features: [
        { group: "Fees", label: "Monthly fee", value: "0 PLN" },
        { group: "Business", label: "ZUS/US transfers", value: "Free" },
        { group: "Business", label: "Multi-user", value: "Yes" },
      ],
      faqs: [
        { question: "Is it suitable for a JDG?", answer: "Yes, Nest Konto Biznes is designed for sole traders and small companies, with free maintenance and tax transfers." },
      ],
      affiliate: { partner: "Nest Bank Affiliate", url: "https://nestbank.pl/biznes?ref=finport" },
    },
    {
      slug: "millennium-konto-360",
      name: "Millennium Konto 360°",
      tagline: "A complete everyday account with cashback",
      summary: "Konto 360° bundles a free account, free card and cashback offers in a modern, well-rated app.",
      type: "PERSONAL_ACCOUNT",
      categorySlug: "personal-accounts",
      bank: "millennium",
      monthlyFee: 0,
      cardFee: 0,
      cashbackPercent: 1.5,
      flags: { onlineOpening: true, applePay: true, googlePay: true, blik: true, freeMaintenance: true },
      pros: ["Free with light conditions", "Cashback offers", "Strong mobile app"],
      cons: ["Cashback requires opt-in", "Some ATM fees"],
      benefits: ["Cashback program", "Apple Pay & Google Pay", "BLIK", "Goal-based saving"],
      requirements: ["18+ years old", "Polish residence", "Valid ID"],
      popularity: 80,
      rating: { overall: 4.4, fees: 4.4, usability: 4.6, support: 4.2, benefits: 4.3, reviewCount: 610 },
      features: [
        { group: "Fees", label: "Monthly fee", value: "0 PLN (with conditions)" },
        { group: "Rewards", label: "Cashback", value: "Up to 1.5%" },
      ],
      faqs: [
        { question: "How do I get cashback?", answer: "Activate the cashback program in the app and pay with your card at participating merchants." },
      ],
      affiliate: { partner: "Millennium Affiliate", url: "https://bankmillennium.pl/konto-360?ref=finport" },
    },
    {
      slug: "pko-konto-dla-mlodych",
      name: "PKO Konto dla Młodych",
      tagline: "Free student account from Poland's biggest bank",
      summary: "A free account for people under 26 with no monthly fee, free card and full mobile banking via IKO.",
      type: "PERSONAL_ACCOUNT",
      categorySlug: "student-accounts",
      bank: "pko-bp",
      monthlyFee: 0,
      cardFee: 0,
      flags: { onlineOpening: true, applePay: true, googlePay: true, blik: true, freeMaintenance: true },
      pros: ["Free for under-26s", "Largest ATM network", "IKO app"],
      cons: ["Fees apply after turning 26", "FX spreads"],
      benefits: ["Free account & card", "BLIK", "Apple Pay & Google Pay", "Student discounts"],
      requirements: ["Under 26 years old", "Polish residence", "Valid ID"],
      badges: ["For students"],
      popularity: 78,
      rating: { overall: 4.3, fees: 4.6, usability: 4.3, support: 4.1, benefits: 4.2, reviewCount: 430 },
      features: [
        { group: "Fees", label: "Monthly fee", value: "0 PLN (under 26)" },
        { group: "Digital", label: "App", value: "IKO" },
      ],
      faqs: [
        { question: "What happens after I turn 26?", answer: "The account converts to a standard plan; you can switch to another free account before then." },
      ],
      affiliate: { partner: "PKO Affiliate", url: "https://pkobp.pl/mlodzi?ref=finport" },
    },
    {
      slug: "link4-oc",
      name: "Link4 OC",
      tagline: "Affordable mandatory car insurance, fully online",
      summary: "Link4 offers competitively priced OC (third-party liability) car insurance with a quick online quote and 24/7 assistance.",
      type: "CAR_INSURANCE",
      categorySlug: "car-insurance",
      provider: "link4",
      monthlyFee: 89,
      flags: { onlineOpening: true },
      pros: ["Competitive OC pricing", "Instant online quote", "24/7 assistance", "Direct claims handling"],
      cons: ["AC sold separately", "Pricing varies by region"],
      benefits: ["Mandatory OC cover", "Assistance add-on", "Online policy management"],
      requirements: ["Valid driving licence", "Vehicle registration", "Polish address"],
      badges: ["Popular choice"],
      popularity: 86,
      featured: true,
      rating: { overall: 4.4, fees: 4.5, usability: 4.5, support: 4.2, benefits: 4.2, reviewCount: 1500 },
      features: [
        { group: "Cover", label: "Type", value: "OC (liability)" },
        { group: "Cover", label: "Assistance", value: "Optional" },
        { group: "Service", label: "Quote", value: "Online, instant" },
      ],
      faqs: [
        { question: "Is OC insurance mandatory?", answer: "Yes, third-party liability (OC) is legally required for every registered vehicle in Poland." },
      ],
      affiliate: { partner: "Link4 Affiliate", url: "https://link4.pl/oc?ref=finport" },
    },
    {
      slug: "pzu-dom",
      name: "PZU Dom",
      tagline: "Comprehensive home insurance from Poland's top insurer",
      summary: "PZU Dom protects your flat or house against fire, flood, theft and third-party liability, with flexible add-ons.",
      type: "HOME_INSURANCE",
      categorySlug: "home-insurance",
      provider: "pzu",
      monthlyFee: 45,
      flags: { onlineOpening: true },
      pros: ["Broad cover options", "Trusted brand", "Nationwide claims network"],
      cons: ["Premiums higher than direct insurers", "Add-ons increase price"],
      benefits: ["Fire & flood cover", "Theft protection", "Liability cover", "Assistance services"],
      requirements: ["Property in Poland", "Ownership or tenancy", "Valid ID"],
      popularity: 82,
      featured: true,
      rating: { overall: 4.3, fees: 4.0, usability: 4.2, support: 4.4, benefits: 4.6, reviewCount: 920 },
      features: [
        { group: "Cover", label: "Fire & flood", value: "Included" },
        { group: "Cover", label: "Theft", value: "Optional" },
        { group: "Cover", label: "Liability", value: "Included" },
      ],
      faqs: [
        { question: "Does it cover renters?", answer: "Yes, PZU Dom offers cover for both owners and tenants, with options tailored to each." },
      ],
      affiliate: { partner: "PZU Affiliate", url: "https://pzu.pl/dom?ref=finport" },
    },
    {
      slug: "warta-zycie",
      name: "Warta Życie",
      tagline: "Flexible life insurance for your family's security",
      summary: "A modular life insurance policy that lets you adjust cover and riders to match your situation.",
      type: "LIFE_INSURANCE",
      categorySlug: "life-insurance",
      provider: "warta",
      monthlyFee: 60,
      flags: { onlineOpening: true },
      pros: ["Flexible cover levels", "Optional riders", "Stable insurer"],
      cons: ["Medical questionnaire required", "Price rises with age"],
      benefits: ["Death benefit", "Critical illness rider", "Accident cover", "Family protection"],
      requirements: ["18–65 years old", "Health declaration", "Polish residence"],
      popularity: 70,
      rating: { overall: 4.2, fees: 4.1, usability: 4.0, support: 4.3, benefits: 4.4, reviewCount: 320 },
      features: [
        { group: "Cover", label: "Death benefit", value: "Customisable" },
        { group: "Cover", label: "Critical illness", value: "Optional rider" },
      ],
      faqs: [
        { question: "Do I need a medical exam?", answer: "Most policies require a health questionnaire; higher cover amounts may require a medical exam." },
      ],
      affiliate: { partner: "Warta Affiliate", url: "https://warta.pl/zycie?ref=finport" },
    },
    {
      slug: "allianz-zdrowie",
      name: "Allianz Zdrowie",
      tagline: "Private healthcare with fast specialist access",
      summary: "Skip the queues with a private health package covering specialist visits, diagnostics and telemedicine.",
      type: "HEALTH_INSURANCE",
      categorySlug: "health-insurance",
      provider: "allianz",
      monthlyFee: 120,
      flags: { onlineOpening: true },
      pros: ["Fast specialist access", "Telemedicine included", "Nationwide clinics"],
      cons: ["Higher monthly cost", "Waiting periods on some services"],
      benefits: ["Specialist consultations", "Diagnostics", "Telemedicine 24/7", "Preventive checkups"],
      requirements: ["18+ years old", "Health declaration", "Polish residence"],
      popularity: 68,
      rating: { overall: 4.3, fees: 3.9, usability: 4.4, support: 4.4, benefits: 4.6, reviewCount: 410 },
      features: [
        { group: "Cover", label: "Specialists", value: "Included" },
        { group: "Cover", label: "Telemedicine", value: "24/7" },
      ],
      faqs: [
        { question: "How fast can I see a specialist?", answer: "Allianz guarantees appointment times for many specialties, typically within a few business days." },
      ],
      affiliate: { partner: "Allianz Affiliate", url: "https://allianz.pl/zdrowie?ref=finport" },
    },
    {
      slug: "ergo-hestia-podroze",
      name: "ERGO Hestia Podróże",
      tagline: "Travel insurance with strong medical cover",
      summary: "Comprehensive travel insurance with high medical cover limits, baggage protection and assistance worldwide.",
      type: "TRAVEL_INSURANCE",
      categorySlug: "travel-insurance",
      provider: "ergo-hestia",
      monthlyFee: 12,
      flags: { onlineOpening: true },
      pros: ["High medical limits", "Worldwide assistance", "Baggage cover", "Buy online instantly"],
      cons: ["Extreme sports cost extra", "Per-trip pricing"],
      benefits: ["Medical cover abroad", "Baggage protection", "Trip cancellation", "24/7 assistance"],
      requirements: ["Valid travel dates", "Destination details", "Valid ID"],
      popularity: 66,
      rating: { overall: 4.4, fees: 4.5, usability: 4.6, support: 4.3, benefits: 4.4, reviewCount: 280 },
      features: [
        { group: "Cover", label: "Medical limit", value: "High" },
        { group: "Cover", label: "Baggage", value: "Included" },
      ],
      faqs: [
        { question: "Does it cover COVID-19?", answer: "Yes, most ERGO Hestia travel plans include medical cover related to COVID-19 abroad." },
      ],
      affiliate: { partner: "ERGO Hestia Affiliate", url: "https://ergohestia.pl/podroze?ref=finport" },
    },
  ];

  for (const p of products) {
    const created = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug,
        name: p.name,
        tagline: p.tagline,
        summary: p.summary,
        body: p.summary,
        type: p.type,
        categoryId: categoryMap[p.categorySlug]!,
        bankId: p.bank ? bankMap[p.bank] : null,
        insuranceProviderId: p.provider ? providerMap[p.provider] : null,
        // Bundled official brand icon keyed off the bank / insurer slug.
        logoUrl: p.logoUrl ?? brandLogo[p.bank ?? p.provider ?? ""] ?? null,
        currency: p.currency ?? "PLN",
        monthlyFee: p.monthlyFee ?? null,
        cardFee: p.cardFee ?? null,
        cashbackPercent: p.cashbackPercent ?? null,
        promoAmount: p.promoAmount ?? null,
        onlineOpening: p.flags?.onlineOpening ?? false,
        applePay: p.flags?.applePay ?? false,
        googlePay: p.flags?.googlePay ?? false,
        blik: p.flags?.blik ?? false,
        foreignersFriendly: p.flags?.foreignersFriendly ?? false,
        businessFriendly: p.flags?.businessFriendly ?? false,
        freeMaintenance: p.flags?.freeMaintenance ?? false,
        eurAccount: p.flags?.eurAccount ?? false,
        noPeselRequired: p.flags?.noPeselRequired ?? false,
        pros: p.pros,
        cons: p.cons,
        benefits: p.benefits,
        requirements: p.requirements,
        badges: p.badges ?? [],
        popularity: p.popularity,
        featured: p.featured ?? false,
        metaTitle: `${p.name} — review, fees & how to apply`,
        metaDescription: p.summary.slice(0, 155),
        rating: { create: p.rating },
        features: { create: p.features.map((f, i) => ({ ...f, order: i })) },
        faqs: { create: p.faqs.map((f, i) => ({ ...f, order: i })) },
        affiliateLinks: { create: { partner: p.affiliate.partner, url: p.affiliate.url, label: "Apply now" } },
      },
    });

    // Sample reviews
    await prisma.review.createMany({
      data: [
        { productId: created.id, authorName: "Tomasz W.", rating: 5, title: "Great experience", body: "Quick setup and the app is excellent.", verified: true },
        { productId: created.id, authorName: "Kasia M.", rating: 4, title: "Solid choice", body: "Does everything I need, fees are fair.", verified: true },
      ],
    });
  }

  // --- Global FAQs (homepage) ---
  const globalFaqs = [
    { question: "Is FinPort free to use?", answer: "Yes. Comparing products on FinPort is completely free. We earn a commission from partners when you apply, at no extra cost to you." },
    { question: "How do you make money?", answer: "We use affiliate (CPA) partnerships. When you apply for a product through our links, the provider may pay us a commission. This never affects our independent rankings." },
    { question: "Is the data up to date?", answer: "We review offers regularly and update fees, bonuses and conditions. Always confirm final terms on the provider's website before applying." },
    { question: "Do you cover insurance as well as banking?", answer: "Yes. We compare personal and business accounts, cards, and car, home, health, life, travel and business insurance." },
    { question: "Can I open an account without a PESEL?", answer: "Several products on FinPort are foreigner-friendly and don't require a PESEL. Use the 'Accounts for foreigners' category or our recommendation wizard." },
    { question: "How do you rank products?", answer: "Our editorial team scores products on fees, usability, support and benefits, combined with user popularity. Rankings are independent of commissions." },
  ];
  // Clear existing global FAQs to keep idempotent, then recreate
  await prisma.fAQ.deleteMany({ where: { productId: null, blogPostId: null } });
  await prisma.fAQ.createMany({
    data: globalFaqs.map((f, i) => ({ ...f, order: i })),
  });

  // --- Blog posts ---
  const posts = [
    {
      slug: "best-bank-account-poland-2026",
      title: "Best bank accounts in Poland for 2026",
      excerpt: "We compared the leading personal accounts on fees, apps and perks. Here's how they stack up.",
      category: "BANKING",
      authorSlug: "anna-kowalska",
      readingMins: 8,
      coverImage: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=1200&q=80",
    },
    {
      slug: "open-bank-account-without-pesel",
      title: "How to open a bank account in Poland without a PESEL",
      excerpt: "A step-by-step guide for newcomers to Poland on opening an account with just a passport.",
      category: "FOREIGNERS",
      authorSlug: "anna-kowalska",
      readingMins: 6,
      coverImage: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&q=80",
    },
    {
      slug: "oc-vs-ac-car-insurance",
      title: "OC vs AC car insurance: what's the difference?",
      excerpt: "Understand mandatory OC versus optional AC cover and which one you actually need.",
      category: "INSURANCE",
      authorSlug: "marek-nowak",
      readingMins: 7,
      coverImage: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200&q=80",
    },
    {
      slug: "best-business-account-sole-trader",
      title: "The best business accounts for sole traders in Poland",
      excerpt: "Running a JDG? These accounts keep fees low and integrate with your accounting.",
      category: "BUSINESS",
      authorSlug: "anna-kowalska",
      readingMins: 9,
      coverImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80",
    },
  ];

  for (const post of posts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        category: post.category,
        readingMins: post.readingMins,
        coverImage: post.coverImage,
        contentPath: post.slug,
        authorId: authorMap[post.authorSlug],
        metaTitle: post.title,
        metaDescription: post.excerpt,
        faqs: {
          create: [
            { question: "Where can I compare these products?", answer: "Use the FinPort comparison tool to see live fees and benefits side by side.", order: 0 },
          ],
        },
      },
    });
  }

  console.log("✅ Seed complete:");
  console.log(`   ${categories.length} categories, ${banks.length} banks, ${providers.length} insurers`);
  console.log(`   ${products.length} products, ${posts.length} blog posts`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
