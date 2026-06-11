import { brandLogos } from "@/lib/brand-logos";
import type {
  Brand,
  Category,
  ProductWithRelations,
  Vertical,
} from "./types";

// Fixed timestamp so the static content is deterministic across builds.
const STAMP = new Date("2026-05-01T00:00:00.000Z");

// ----------------------------------------------------------------------------
// Categories
// ----------------------------------------------------------------------------

const rawCategories: Array<
  Omit<Category, "id" | "metaTitle" | "metaDescription"> & { featured?: boolean }
> = [
  { slug: "personal-accounts", name: "Personal accounts", vertical: "BANKING", icon: "Wallet", order: 1, featured: true, description: "Everyday checking accounts for individuals." },
  { slug: "business-accounts", name: "Business accounts", vertical: "BANKING", icon: "Briefcase", order: 2, featured: true, description: "Accounts for companies, sole traders and startups." },
  { slug: "cashback-cards", name: "Cards with cashback", vertical: "BANKING", icon: "CreditCard", order: 3, featured: true, description: "Debit and credit cards that pay you back." },
  { slug: "accounts-for-foreigners", name: "Accounts for foreigners", vertical: "BANKING", icon: "Globe", order: 4, featured: false, description: "Open an account in Poland without a PESEL." },
  { slug: "online-account-opening", name: "Online account opening", vertical: "BANKING", icon: "Laptop", order: 5, featured: false, description: "100% online sign-up, no branch visit." },
  { slug: "premium-banking", name: "Premium banking", vertical: "BANKING", icon: "Crown", order: 6, featured: false, description: "Premium accounts with concierge perks." },
  { slug: "student-accounts", name: "Student accounts", vertical: "BANKING", icon: "GraduationCap", order: 7, featured: false, description: "Free accounts for students under 26." },
  { slug: "car-insurance", name: "Car insurance", vertical: "INSURANCE", icon: "Car", order: 8, featured: true, description: "OC and AC car insurance compared." },
  { slug: "home-insurance", name: "Home insurance", vertical: "INSURANCE", icon: "Home", order: 9, featured: true, description: "Protect your flat or house." },
  { slug: "health-insurance", name: "Health insurance", vertical: "INSURANCE", icon: "HeartPulse", order: 10, featured: false, description: "Private healthcare packages." },
  { slug: "life-insurance", name: "Life insurance", vertical: "INSURANCE", icon: "ShieldCheck", order: 11, featured: false, description: "Financial security for your family." },
  { slug: "travel-insurance", name: "Travel insurance", vertical: "INSURANCE", icon: "Plane", order: 12, featured: false, description: "Cover for trips abroad." },
  { slug: "business-insurance", name: "Business insurance", vertical: "INSURANCE", icon: "Building2", order: 13, featured: false, description: "Liability and property cover for firms." },
];

export const categories: Category[] = rawCategories.map((c) => ({
  ...c,
  id: c.slug,
  featured: c.featured ?? false,
  metaTitle: null,
  metaDescription: c.description,
}));

const categoryBySlug = new Map(categories.map((c) => [c.slug, c]));

// ----------------------------------------------------------------------------
// Brands (banks + insurers)
// ----------------------------------------------------------------------------

function brand(slug: string, name: string, website: string, description: string): Brand {
  return { id: slug, slug, name, website, description, country: "PL", logoUrl: brandLogos[slug] ?? null };
}

export const banks: Brand[] = [
  brand("mbank", "mBank", "https://mbank.pl", "Digital-first Polish bank."),
  brand("ing", "ING Bank Śląski", "https://ing.pl", "One of Poland's largest banks."),
  brand("santander", "Santander Bank Polska", "https://santander.pl", "Global banking group in Poland."),
  brand("pko-bp", "PKO Bank Polski", "https://pkobp.pl", "Poland's largest bank."),
  brand("revolut", "Revolut", "https://revolut.com", "Borderless digital banking."),
  brand("millennium", "Bank Millennium", "https://bankmillennium.pl", "Modern retail bank."),
  brand("nest-bank", "Nest Bank", "https://nestbank.pl", "Bank for entrepreneurs."),
];

export const providers: Brand[] = [
  brand("pzu", "PZU", "https://pzu.pl", "Poland's largest insurer."),
  brand("warta", "Warta", "https://warta.pl", "Established Polish insurer."),
  brand("link4", "Link4", "https://link4.pl", "Direct car insurance."),
  brand("allianz", "Allianz", "https://allianz.pl", "Global insurance group."),
  brand("ergo-hestia", "ERGO Hestia", "https://ergohestia.pl", "Premium insurance brand."),
];

const brandBySlug = new Map([...banks, ...providers].map((b) => [b.slug, b]));

// ----------------------------------------------------------------------------
// Products
// ----------------------------------------------------------------------------

type RawProduct = {
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  type: string;
  categorySlug: string;
  bank?: string;
  provider?: string;
  monthlyFee?: number;
  cardFee?: number;
  cashbackPercent?: number;
  promoAmount?: number;
  flags?: Partial<
    Record<
      | "onlineOpening" | "applePay" | "googlePay" | "blik" | "foreignersFriendly"
      | "businessFriendly" | "freeMaintenance" | "eurAccount" | "noPeselRequired",
      boolean
    >
  >;
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

const rawProducts: RawProduct[] = [
  {
    slug: "mbank-ekonto", name: "mBank eKonto", tagline: "The all-rounder current account, free for active users",
    summary: "eKonto is mBank's flagship personal account: no monthly fee when you pay by card, a slick mobile app, BLIK, Apple Pay and Google Pay out of the box.",
    type: "PERSONAL_ACCOUNT", categorySlug: "personal-accounts", bank: "mbank",
    monthlyFee: 0, cardFee: 0, promoAmount: 200,
    flags: { onlineOpening: true, applePay: true, googlePay: true, blik: true, freeMaintenance: true, foreignersFriendly: true },
    pros: ["No monthly fee with card activity", "Excellent mobile app", "Welcome bonus up to 200 PLN", "Free ATM withdrawals in Poland"],
    cons: ["Fee applies without monthly card payment", "Currency exchange spread on card"],
    benefits: ["Apple Pay & Google Pay", "BLIK payments", "Free virtual card", "Real-time spend notifications"],
    requirements: ["18+ years old", "Polish address or residence permit", "Valid ID document"],
    badges: ["Editor's pick", "Popular choice"], popularity: 98, featured: true,
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
    affiliate: { partner: "mBank Affiliate", url: "https://mbank.pl/ekonto?ref=bankpilots" },
  },
  {
    slug: "ing-konto-direct", name: "ING Konto Direct", tagline: "Simple, transparent and genuinely free",
    summary: "Konto Direct from ING is a no-frills current account with zero monthly fee, free domestic transfers and a well-rated mobile app.",
    type: "PERSONAL_ACCOUNT", categorySlug: "personal-accounts", bank: "ing",
    monthlyFee: 0, cardFee: 0,
    flags: { onlineOpening: true, applePay: true, googlePay: true, blik: true, freeMaintenance: true },
    pros: ["Always 0 PLN monthly fee", "Free card with conditions", "Great savings integration"],
    cons: ["ATM fees outside ING network", "Card fee if low activity"],
    benefits: ["Apple Pay & Google Pay", "BLIK", "Smart saving goals", "24/7 support"],
    requirements: ["18+ years old", "Polish residence", "Valid ID"],
    badges: ["Low fees"], popularity: 90, featured: true,
    rating: { overall: 4.6, fees: 4.7, usability: 4.7, support: 4.5, benefits: 4.4, reviewCount: 980 },
    features: [
      { group: "Fees", label: "Monthly fee", value: "0 PLN" },
      { group: "Fees", label: "Card fee", value: "0 PLN (with activity)" },
      { group: "Digital", label: "BLIK", value: "Yes" },
    ],
    faqs: [{ question: "Is the account really free?", answer: "Yes, the monthly account fee is always 0 PLN. A small card fee may apply if you don't use the card." }],
    affiliate: { partner: "ING Affiliate", url: "https://ing.pl/konto-direct?ref=bankpilots" },
  },
  {
    slug: "revolut-standard", name: "Revolut Standard", tagline: "Borderless banking for foreigners and travellers",
    summary: "Revolut Standard is ideal if you don't have a PESEL yet: open in minutes, hold EUR and 25+ currencies, and spend abroad at great rates.",
    type: "PERSONAL_ACCOUNT", categorySlug: "accounts-for-foreigners", bank: "revolut",
    monthlyFee: 0, cardFee: 0,
    flags: { onlineOpening: true, applePay: true, googlePay: true, foreignersFriendly: true, eurAccount: true, noPeselRequired: true, freeMaintenance: true },
    pros: ["No PESEL required", "Multi-currency EUR account", "Open in 5 minutes", "Great FX rates"],
    cons: ["Limited cash deposits", "Weekend FX markup", "Support mainly in-app"],
    benefits: ["EUR & 25+ currencies", "Apple Pay & Google Pay", "Instant virtual cards", "Budgeting tools"],
    requirements: ["Valid passport or EU ID", "Smartphone", "No PESEL needed"],
    badges: ["Popular with newcomers"], popularity: 95, featured: true,
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
    affiliate: { partner: "Revolut Affiliate", url: "https://revolut.com/pl?ref=bankpilots" },
  },
  {
    slug: "santander-konto-jakie-chce", name: "Santander Konto Jakie Chcę", tagline: "Flexible account with strong cashback",
    summary: "A customisable account with up to 2% cashback on selected categories and a polished app experience.",
    type: "PERSONAL_ACCOUNT", categorySlug: "cashback-cards", bank: "santander",
    monthlyFee: 0, cardFee: 0, cashbackPercent: 2,
    flags: { onlineOpening: true, applePay: true, googlePay: true, blik: true, freeMaintenance: true },
    pros: ["Up to 2% cashback", "Free with conditions", "Wide branch network"],
    cons: ["Cashback capped monthly", "Conditions for free maintenance"],
    benefits: ["2% cashback categories", "Apple Pay & Google Pay", "BLIK", "Multicurrency card option"],
    requirements: ["18+ years old", "Polish residence", "Valid ID"],
    badges: ["Cashback"], popularity: 88, featured: true,
    rating: { overall: 4.5, fees: 4.4, usability: 4.5, support: 4.3, benefits: 4.7, reviewCount: 760 },
    features: [
      { group: "Rewards", label: "Cashback", value: "Up to 2%" },
      { group: "Fees", label: "Monthly fee", value: "0 PLN (with conditions)" },
      { group: "Digital", label: "BLIK", value: "Yes" },
    ],
    faqs: [{ question: "How much cashback can I earn?", answer: "Up to 2% on selected categories, subject to a monthly cap defined in the current promotion." }],
    affiliate: { partner: "Santander Affiliate", url: "https://santander.pl/konto?ref=bankpilots" },
  },
  {
    slug: "nest-konto-biznes", name: "Nest Konto Biznes", tagline: "Built for sole traders and small companies",
    summary: "A business account with free maintenance, free domestic transfers and accounting integrations — ideal for JDG and small firms.",
    type: "BUSINESS_ACCOUNT", categorySlug: "business-accounts", bank: "nest-bank",
    monthlyFee: 0, cardFee: 0,
    flags: { onlineOpening: true, businessFriendly: true, freeMaintenance: true, blik: true },
    pros: ["Free business maintenance", "Free domestic transfers", "Accounting integrations", "Fast online setup"],
    cons: ["Cash deposit fees", "Fewer branches"],
    benefits: ["Free ZUS & US transfers", "Invoicing tools", "Business card included", "Multi-user access"],
    requirements: ["Registered business (JDG/sp. z o.o.)", "NIP number", "Valid ID"],
    badges: ["For business"], popularity: 84, featured: true,
    rating: { overall: 4.5, fees: 4.7, usability: 4.4, support: 4.2, benefits: 4.5, reviewCount: 540 },
    features: [
      { group: "Fees", label: "Monthly fee", value: "0 PLN" },
      { group: "Business", label: "ZUS/US transfers", value: "Free" },
      { group: "Business", label: "Multi-user", value: "Yes" },
    ],
    faqs: [{ question: "Is it suitable for a JDG?", answer: "Yes, Nest Konto Biznes is designed for sole traders and small companies, with free maintenance and tax transfers." }],
    affiliate: { partner: "Nest Bank Affiliate", url: "https://nestbank.pl/biznes?ref=bankpilots" },
  },
  {
    slug: "millennium-konto-360", name: "Millennium Konto 360°", tagline: "A complete everyday account with cashback",
    summary: "Konto 360° bundles a free account, free card and cashback offers in a modern, well-rated app.",
    type: "PERSONAL_ACCOUNT", categorySlug: "personal-accounts", bank: "millennium",
    monthlyFee: 0, cardFee: 0, cashbackPercent: 1.5,
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
    faqs: [{ question: "How do I get cashback?", answer: "Activate the cashback program in the app and pay with your card at participating merchants." }],
    affiliate: { partner: "Millennium Affiliate", url: "https://bankmillennium.pl/konto-360?ref=bankpilots" },
  },
  {
    slug: "pko-konto-dla-mlodych", name: "PKO Konto dla Młodych", tagline: "Free student account from Poland's biggest bank",
    summary: "A free account for people under 26 with no monthly fee, free card and full mobile banking via IKO.",
    type: "PERSONAL_ACCOUNT", categorySlug: "student-accounts", bank: "pko-bp",
    monthlyFee: 0, cardFee: 0,
    flags: { onlineOpening: true, applePay: true, googlePay: true, blik: true, freeMaintenance: true },
    pros: ["Free for under-26s", "Largest ATM network", "IKO app"],
    cons: ["Fees apply after turning 26", "FX spreads"],
    benefits: ["Free account & card", "BLIK", "Apple Pay & Google Pay", "Student discounts"],
    requirements: ["Under 26 years old", "Polish residence", "Valid ID"],
    badges: ["For students"], popularity: 78,
    rating: { overall: 4.3, fees: 4.6, usability: 4.3, support: 4.1, benefits: 4.2, reviewCount: 430 },
    features: [
      { group: "Fees", label: "Monthly fee", value: "0 PLN (under 26)" },
      { group: "Digital", label: "App", value: "IKO" },
    ],
    faqs: [{ question: "What happens after I turn 26?", answer: "The account converts to a standard plan; you can switch to another free account before then." }],
    affiliate: { partner: "PKO Affiliate", url: "https://pkobp.pl/mlodzi?ref=bankpilots" },
  },
  {
    slug: "link4-oc", name: "Link4 OC", tagline: "Affordable mandatory car insurance, fully online",
    summary: "Link4 offers competitively priced OC (third-party liability) car insurance with a quick online quote and 24/7 assistance.",
    type: "CAR_INSURANCE", categorySlug: "car-insurance", provider: "link4",
    monthlyFee: 89,
    flags: { onlineOpening: true },
    pros: ["Competitive OC pricing", "Instant online quote", "24/7 assistance", "Direct claims handling"],
    cons: ["AC sold separately", "Pricing varies by region"],
    benefits: ["Mandatory OC cover", "Assistance add-on", "Online policy management"],
    requirements: ["Valid driving licence", "Vehicle registration", "Polish address"],
    badges: ["Popular choice"], popularity: 86, featured: true,
    rating: { overall: 4.4, fees: 4.5, usability: 4.5, support: 4.2, benefits: 4.2, reviewCount: 1500 },
    features: [
      { group: "Cover", label: "Type", value: "OC (liability)" },
      { group: "Cover", label: "Assistance", value: "Optional" },
      { group: "Service", label: "Quote", value: "Online, instant" },
    ],
    faqs: [{ question: "Is OC insurance mandatory?", answer: "Yes, third-party liability (OC) is legally required for every registered vehicle in Poland." }],
    affiliate: { partner: "Link4 Affiliate", url: "https://link4.pl/oc?ref=bankpilots" },
  },
  {
    slug: "pzu-dom", name: "PZU Dom", tagline: "Comprehensive home insurance from a leading insurer",
    summary: "PZU Dom protects your flat or house against fire, flood, theft and third-party liability, with flexible add-ons.",
    type: "HOME_INSURANCE", categorySlug: "home-insurance", provider: "pzu",
    monthlyFee: 45,
    flags: { onlineOpening: true },
    pros: ["Broad cover options", "Trusted brand", "Nationwide claims network"],
    cons: ["Premiums higher than direct insurers", "Add-ons increase price"],
    benefits: ["Fire & flood cover", "Theft protection", "Liability cover", "Assistance services"],
    requirements: ["Property in Poland", "Ownership or tenancy", "Valid ID"],
    badges: ["Popular choice"], popularity: 82, featured: true,
    rating: { overall: 4.3, fees: 4.0, usability: 4.2, support: 4.4, benefits: 4.6, reviewCount: 920 },
    features: [
      { group: "Cover", label: "Fire & flood", value: "Included" },
      { group: "Cover", label: "Theft", value: "Optional" },
      { group: "Cover", label: "Liability", value: "Included" },
    ],
    faqs: [{ question: "Does it cover renters?", answer: "Yes, PZU Dom offers cover for both owners and tenants, with options tailored to each." }],
    affiliate: { partner: "PZU Affiliate", url: "https://pzu.pl/dom?ref=bankpilots" },
  },
  {
    slug: "warta-zycie", name: "Warta Życie", tagline: "Flexible life insurance for your family's security",
    summary: "A modular life insurance policy that lets you adjust cover and riders to match your situation.",
    type: "LIFE_INSURANCE", categorySlug: "life-insurance", provider: "warta",
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
    faqs: [{ question: "Do I need a medical exam?", answer: "Most policies require a health questionnaire; higher cover amounts may require a medical exam." }],
    affiliate: { partner: "Warta Affiliate", url: "https://warta.pl/zycie?ref=bankpilots" },
  },
  {
    slug: "allianz-zdrowie", name: "Allianz Zdrowie", tagline: "Private healthcare with fast specialist access",
    summary: "Skip the queues with a private health package covering specialist visits, diagnostics and telemedicine.",
    type: "HEALTH_INSURANCE", categorySlug: "health-insurance", provider: "allianz",
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
    faqs: [{ question: "How fast can I see a specialist?", answer: "Allianz guarantees appointment times for many specialties, typically within a few business days." }],
    affiliate: { partner: "Allianz Affiliate", url: "https://allianz.pl/zdrowie?ref=bankpilots" },
  },
  {
    slug: "ergo-hestia-podroze", name: "ERGO Hestia Podróże", tagline: "Travel insurance with strong medical cover",
    summary: "Comprehensive travel insurance with high medical cover limits, baggage protection and assistance worldwide.",
    type: "TRAVEL_INSURANCE", categorySlug: "travel-insurance", provider: "ergo-hestia",
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
    faqs: [{ question: "Does it cover COVID-19?", answer: "Yes, most ERGO Hestia travel plans include medical cover related to COVID-19 abroad." }],
    affiliate: { partner: "ERGO Hestia Affiliate", url: "https://ergohestia.pl/podroze?ref=bankpilots" },
  },
];

function buildProduct(p: RawProduct): ProductWithRelations {
  const category = categoryBySlug.get(p.categorySlug)!;
  const bank = p.bank ? brandBySlug.get(p.bank) ?? null : null;
  const insuranceProvider = p.provider ? brandBySlug.get(p.provider) ?? null : null;
  const f = p.flags ?? {};
  return {
    id: p.slug,
    slug: p.slug,
    name: p.name,
    tagline: p.tagline,
    summary: p.summary,
    body: p.summary,
    logoUrl: brandLogos[p.bank ?? p.provider ?? ""] ?? null,
    type: p.type,
    currency: "PLN",
    monthlyFee: p.monthlyFee ?? null,
    cardFee: p.cardFee ?? null,
    cashbackPercent: p.cashbackPercent ?? null,
    promoAmount: p.promoAmount ?? null,
    onlineOpening: !!f.onlineOpening,
    applePay: !!f.applePay,
    googlePay: !!f.googlePay,
    blik: !!f.blik,
    foreignersFriendly: !!f.foreignersFriendly,
    businessFriendly: !!f.businessFriendly,
    freeMaintenance: !!f.freeMaintenance,
    eurAccount: !!f.eurAccount,
    noPeselRequired: !!f.noPeselRequired,
    pros: p.pros,
    cons: p.cons,
    benefits: p.benefits,
    requirements: p.requirements,
    badges: p.badges ?? [],
    popularity: p.popularity,
    featured: p.featured ?? false,
    published: true,
    metaTitle: `${p.name} — review, fees & how to apply`,
    metaDescription: p.summary.slice(0, 155),
    ogImage: null,
    createdAt: STAMP,
    updatedAt: STAMP,
    categoryId: category.id,
    category,
    bank,
    insuranceProvider,
    rating: { ...p.rating },
    features: p.features.map((feat, i) => ({ id: `${p.slug}-f${i}`, group: feat.group, label: feat.label, value: feat.value, icon: null, order: i })),
    faqs: p.faqs.map((q, i) => ({ id: `${p.slug}-q${i}`, question: q.question, answer: q.answer, order: i })),
    affiliateLinks: [{ id: `${p.slug}-aff`, partner: p.affiliate.partner, url: p.affiliate.url, label: "Apply now", isActive: true, clicks: 0 }],
    reviews: [
      { id: `${p.slug}-r0`, authorName: "Tomasz W.", rating: 5, title: "Great experience", body: "Quick setup and the app is excellent.", verified: true, createdAt: STAMP },
      { id: `${p.slug}-r1`, authorName: "Kasia M.", rating: 4, title: "Solid choice", body: "Does everything I need, fees are fair.", verified: true, createdAt: STAMP },
    ],
  };
}

export const products: ProductWithRelations[] = rawProducts.map(buildProduct);

export function brandsFor(vertical: Vertical): Brand[] {
  const set = new Set(
    products
      .filter((p) => p.category.vertical === vertical)
      .map((p) => (vertical === "BANKING" ? p.bank?.slug : p.insuranceProvider?.slug))
      .filter(Boolean) as string[],
  );
  return (vertical === "BANKING" ? banks : providers)
    .filter((b) => set.has(b.slug))
    .sort((a, b) => a.name.localeCompare(b.name));
}
