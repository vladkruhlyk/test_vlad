/**
 * Central site configuration. Single source of truth for brand metadata,
 * navigation structure (incl. mega menus) and social links.
 */

export const siteConfig = {
  name: "BankPilots",
  legalName: "BankPilots Sp. z o.o.",
  domain: "bankpilots.pl",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  description:
    "Compare bank accounts, cards and insurance offers in Poland based on fees, benefits and your personal needs.",
  locales: ["pl", "en", "uk"] as const,
  defaultLocale: "pl" as const,
  social: {
    twitter: "@bankpilots",
    linkedin: "https://linkedin.com/company/bankpilots",
  },
  contact: {
    email: "hello@bankpilots.pl",
  },
} as const;

export type Locale = (typeof siteConfig.locales)[number];

/** Mega-menu definitions. `href` values are locale-prefixed at render time. */
export const banksMenu = [
  { key: "personalAccounts", href: "/banks/personal-accounts" },
  { key: "businessAccounts", href: "/banks/business-accounts" },
  { key: "cashbackCards", href: "/banks/cashback-cards" },
  { key: "foreignersAccounts", href: "/banks/accounts-for-foreigners" },
  { key: "onlineOpening", href: "/banks/online-account-opening" },
  { key: "premiumBanking", href: "/banks/premium-banking" },
  { key: "studentAccounts", href: "/banks/student-accounts" },
  { key: "compareAll", href: "/banks", featured: true },
] as const;

export const insuranceMenu = [
  { key: "carInsurance", href: "/insurance/car-insurance" },
  { key: "homeInsurance", href: "/insurance/home-insurance" },
  { key: "healthInsurance", href: "/insurance/health-insurance" },
  { key: "lifeInsurance", href: "/insurance/life-insurance" },
  { key: "travelInsurance", href: "/insurance/travel-insurance" },
  { key: "businessInsurance", href: "/insurance/business-insurance" },
  { key: "compareAll", href: "/insurance", featured: true },
] as const;

export const mainNav = [
  { key: "guides", href: "/guides" },
  { key: "blog", href: "/blog" },
  { key: "about", href: "/about" },
] as const;

export const footerNav = {
  product: [
    { key: "banks", href: "/banks" },
    { key: "insurance", href: "/insurance" },
    { key: "compare", href: "/compare" },
    { key: "wizard", href: "/recommend" },
  ],
  resources: [
    { key: "blog", href: "/blog" },
    { key: "guides", href: "/guides" },
    { key: "about", href: "/about" },
    { key: "contact", href: "/contact" },
  ],
  legal: [
    { key: "privacy", href: "/privacy-policy" },
    { key: "terms", href: "/terms" },
    { key: "cookiePolicy", href: "/cookie-policy" },
    { key: "affiliateDisclosure", href: "/affiliate-disclosure" },
  ],
} as const;
