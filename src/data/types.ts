/**
 * Static content types. These mirror the shapes the UI consumes. When you wire
 * up Sanity later, map your CMS documents into these same interfaces and the
 * rest of the app keeps working unchanged.
 */

export type Vertical = "BANKING" | "INSURANCE";

export interface Category {
  id: string;
  slug: string;
  name: string;
  vertical: Vertical;
  description: string | null;
  icon: string | null;
  order: number;
  featured: boolean;
  metaTitle: string | null;
  metaDescription: string | null;
}

/** Bank or insurance provider. */
export interface Brand {
  id: string;
  slug: string;
  name: string;
  logoUrl: string | null;
  description: string | null;
  country: string;
  website: string | null;
}

export interface ProductRating {
  overall: number;
  fees: number;
  usability: number;
  support: number;
  benefits: number;
  reviewCount: number;
}

export interface ProductFeature {
  id: string;
  group: string | null;
  label: string;
  value: string;
  icon: string | null;
  order: number;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
}

export interface AffiliateLink {
  id: string;
  partner: string;
  url: string;
  label: string;
  isActive: boolean;
  clicks: number;
}

export interface Review {
  id: string;
  authorName: string;
  rating: number;
  title: string | null;
  body: string;
  verified: boolean;
  createdAt: Date;
}

export interface ProductWithRelations {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  summary: string | null;
  body: string | null;
  logoUrl: string | null;
  type: string;
  currency: string;
  monthlyFee: number | null;
  cardFee: number | null;
  cashbackPercent: number | null;
  promoAmount: number | null;
  onlineOpening: boolean;
  applePay: boolean;
  googlePay: boolean;
  blik: boolean;
  foreignersFriendly: boolean;
  businessFriendly: boolean;
  freeMaintenance: boolean;
  eurAccount: boolean;
  noPeselRequired: boolean;
  pros: string[];
  cons: string[];
  benefits: string[];
  requirements: string[];
  badges: string[];
  popularity: number;
  featured: boolean;
  published: boolean;
  metaTitle: string | null;
  metaDescription: string | null;
  ogImage: string | null;
  createdAt: Date;
  updatedAt: Date;
  categoryId: string;
  category: Category;
  bank: Brand | null;
  insuranceProvider: Brand | null;
  rating: ProductRating | null;
  features: ProductFeature[];
  faqs: FAQ[];
  affiliateLinks: AffiliateLink[];
  reviews: Review[];
}

export interface Author {
  id: string;
  slug: string;
  name: string;
  role: string | null;
  bio: string | null;
  avatarUrl: string | null;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  coverImage: string | null;
  category: string;
  contentPath: string | null;
  readingMins: number;
  authorId: string | null;
  author: Author | null;
  published: boolean;
  publishedAt: Date;
  metaTitle: string | null;
  metaDescription: string | null;
  ogImage: string | null;
  faqs: FAQ[];
}

export type PostWithAuthor = BlogPost;
