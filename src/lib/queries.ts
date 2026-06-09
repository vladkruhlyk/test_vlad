import { products, categories, brandsFor } from "@/data/catalog";
import { posts } from "@/data/blog";
import { globalFaqs } from "@/data/faqs";
import type { ProductWithRelations, Vertical } from "@/data/types";

export type { ProductWithRelations } from "@/data/types";

export interface ProductFilters {
  type?: string | string[];
  categorySlug?: string;
  vertical?: Vertical;
  search?: string;
  maxMonthlyFee?: number;
  onlineOpening?: boolean;
  applePay?: boolean;
  googlePay?: boolean;
  blik?: boolean;
  foreignersFriendly?: boolean;
  businessFriendly?: boolean;
  freeMaintenance?: boolean;
  cashback?: boolean;
  freeCard?: boolean;
  hasBonus?: boolean;
  noPeselRequired?: boolean;
  eurAccount?: boolean;
  minRating?: number;
  brands?: string[];
  sort?: "popular" | "rating" | "feeAsc" | "feeDesc";
  page?: number;
  perPage?: number;
}

function matches(p: ProductWithRelations, f: ProductFilters): boolean {
  if (!p.published) return false;
  if (f.type) {
    const types = Array.isArray(f.type) ? f.type : [f.type];
    if (!types.includes(p.type)) return false;
  }
  if (f.categorySlug && p.category.slug !== f.categorySlug) return false;
  if (!f.categorySlug && f.vertical && p.category.vertical !== f.vertical) return false;

  if (f.search) {
    const q = f.search.toLowerCase();
    const hay = [p.name, p.tagline, p.bank?.name, p.insuranceProvider?.name]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    if (!hay.includes(q)) return false;
  }
  if (f.brands?.length) {
    const slug = p.bank?.slug ?? p.insuranceProvider?.slug;
    if (!slug || !f.brands.includes(slug)) return false;
  }
  if (typeof f.maxMonthlyFee === "number" && (p.monthlyFee ?? Infinity) > f.maxMonthlyFee) return false;

  const boolChecks: Array<[boolean | undefined, boolean]> = [
    [f.onlineOpening, p.onlineOpening],
    [f.applePay, p.applePay],
    [f.googlePay, p.googlePay],
    [f.blik, p.blik],
    [f.foreignersFriendly, p.foreignersFriendly],
    [f.businessFriendly, p.businessFriendly],
    [f.freeMaintenance, p.freeMaintenance],
    [f.noPeselRequired, p.noPeselRequired],
    [f.eurAccount, p.eurAccount],
  ];
  for (const [want, has] of boolChecks) if (want && !has) return false;

  if (f.cashback && !((p.cashbackPercent ?? 0) > 0)) return false;
  if (f.freeCard && p.cardFee !== 0) return false;
  if (f.hasBonus && !((p.promoAmount ?? 0) > 0)) return false;
  if (typeof f.minRating === "number" && (p.rating?.overall ?? 0) < f.minRating) return false;

  return true;
}

function sortProducts(list: ProductWithRelations[], sort: ProductFilters["sort"]) {
  const arr = [...list];
  switch (sort) {
    case "rating":
      return arr.sort((a, b) => (b.rating?.overall ?? 0) - (a.rating?.overall ?? 0) || b.popularity - a.popularity);
    case "feeAsc":
      return arr.sort((a, b) => (a.monthlyFee ?? Infinity) - (b.monthlyFee ?? Infinity) || b.popularity - a.popularity);
    case "feeDesc":
      return arr.sort((a, b) => (b.monthlyFee ?? -Infinity) - (a.monthlyFee ?? -Infinity) || b.popularity - a.popularity);
    default:
      return arr.sort((a, b) => Number(b.featured) - Number(a.featured) || b.popularity - a.popularity);
  }
}

export async function getProducts(filters: ProductFilters = {}) {
  const page = Math.max(1, filters.page ?? 1);
  const perPage = filters.perPage ?? 9;
  const all = sortProducts(products.filter((p) => matches(p, filters)), filters.sort);
  const total = all.length;
  const items = all.slice((page - 1) * perPage, (page - 1) * perPage + perPage);
  return { items, total, page, perPage, totalPages: Math.max(1, Math.ceil(total / perPage)) };
}

export async function getFeaturedProducts(limit = 6) {
  return products
    .filter((p) => p.published && p.featured)
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit);
}

export async function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug) ?? null;
}

export async function getRelatedProducts(product: { id: string; type: string }, limit = 3) {
  return products
    .filter((p) => p.published && p.type === product.type && p.id !== product.id)
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit);
}

export async function getProductsByIds(ids: string[]) {
  if (!ids.length) return [];
  return ids
    .map((id) => products.find((p) => p.id === id && p.published))
    .filter(Boolean) as ProductWithRelations[];
}

export async function getCategories(vertical?: Vertical) {
  return categories
    .filter((c) => !vertical || c.vertical === vertical)
    .sort((a, b) => a.order - b.order);
}

export async function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug) ?? null;
}

export async function getTopRanked(type: string, limit = 1) {
  return products
    .filter((p) => p.published && p.type === type)
    .sort((a, b) => (b.rating?.overall ?? 0) - (a.rating?.overall ?? 0) || b.popularity - a.popularity)
    .slice(0, limit);
}

export async function getBrands(vertical: Vertical) {
  return brandsFor(vertical);
}

// --- Blog ---

export async function getBlogPosts(opts: { category?: string; limit?: number } = {}) {
  const list = posts
    .filter((p) => p.published && (!opts.category || opts.category === "ALL" || p.category === opts.category))
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  return opts.limit ? list.slice(0, opts.limit) : list;
}

export async function getBlogPost(slug: string) {
  return posts.find((p) => p.slug === slug) ?? null;
}

// --- Global FAQ ---

export async function getGlobalFaqs(limit = 6) {
  return globalFaqs.slice(0, limit);
}
