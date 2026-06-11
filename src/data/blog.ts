import type { Author, BlogPost } from "./types";

const STAMP = new Date("2026-05-01T00:00:00.000Z");

export const authors: Author[] = [
  { id: "anna-kowalska", slug: "anna-kowalska", name: "Anna Kowalska", role: "Senior finance editor", bio: "Anna has 10 years of experience covering retail banking and personal finance in Poland.", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80" },
  { id: "marek-nowak", slug: "marek-nowak", name: "Marek Nowak", role: "Insurance analyst", bio: "Marek specialises in insurance products and consumer protection.", avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80" },
];

const authorBySlug = new Map(authors.map((a) => [a.slug, a]));

type RawPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  authorSlug: string;
  readingMins: number;
  coverImage: string;
};

const rawPosts: RawPost[] = [
  { slug: "best-bank-account-poland-2026", title: "Best bank accounts in Poland for 2026", excerpt: "We compared the leading personal accounts on fees, apps and perks. Here's how they stack up.", category: "BANKING", authorSlug: "anna-kowalska", readingMins: 8, coverImage: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=1200&q=80" },
  { slug: "open-bank-account-without-pesel", title: "How to open a bank account in Poland without a PESEL", excerpt: "A step-by-step guide for newcomers to Poland on opening an account with just a passport.", category: "FOREIGNERS", authorSlug: "anna-kowalska", readingMins: 6, coverImage: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&q=80" },
  { slug: "oc-vs-ac-car-insurance", title: "OC vs AC car insurance: what's the difference?", excerpt: "Understand mandatory OC versus optional AC cover and which one you actually need.", category: "INSURANCE", authorSlug: "marek-nowak", readingMins: 7, coverImage: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200&q=80" },
  { slug: "best-business-account-sole-trader", title: "The best business accounts for sole traders in Poland", excerpt: "Running a JDG? These accounts keep fees low and integrate with your accounting.", category: "BUSINESS", authorSlug: "anna-kowalska", readingMins: 9, coverImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80" },
];

export const posts: BlogPost[] = rawPosts.map((p) => ({
  id: p.slug,
  slug: p.slug,
  title: p.title,
  excerpt: p.excerpt,
  coverImage: p.coverImage,
  category: p.category,
  contentPath: p.slug,
  readingMins: p.readingMins,
  authorId: p.authorSlug,
  author: authorBySlug.get(p.authorSlug) ?? null,
  published: true,
  publishedAt: STAMP,
  metaTitle: p.title,
  metaDescription: p.excerpt,
  ogImage: null,
  faqs: [
    { id: `${p.slug}-q0`, question: "Where can I compare these products?", answer: "Use the BankPilots comparison tool to see live fees and benefits side by side.", order: 0 },
  ],
}));
