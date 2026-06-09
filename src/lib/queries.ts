import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";

/** Shared include used everywhere a "full" product is rendered. */
export const productInclude = {
  rating: true,
  bank: true,
  insuranceProvider: true,
  features: { orderBy: { order: "asc" } },
  faqs: { orderBy: { order: "asc" } },
  affiliateLinks: { where: { isActive: true } },
  category: true,
} satisfies Prisma.ProductInclude;

export type ProductWithRelations = Prisma.ProductGetPayload<{
  include: typeof productInclude;
}>;

export interface ProductFilters {
  type?: string | string[];
  categorySlug?: string;
  vertical?: "BANKING" | "INSURANCE";
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
  // Extended filters
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

function buildWhere(filters: ProductFilters): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = { published: true };
  const and: Prisma.ProductWhereInput[] = [];

  if (filters.type) {
    where.type = Array.isArray(filters.type) ? { in: filters.type } : filters.type;
  }
  if (filters.categorySlug) {
    where.category = { slug: filters.categorySlug };
  } else if (filters.vertical) {
    where.category = { vertical: filters.vertical };
  }
  if (filters.search) {
    and.push({
      OR: [
        { name: { contains: filters.search } },
        { tagline: { contains: filters.search } },
        { bank: { name: { contains: filters.search } } },
        { insuranceProvider: { name: { contains: filters.search } } },
      ],
    });
  }
  if (filters.brands?.length) {
    and.push({
      OR: [
        { bank: { slug: { in: filters.brands } } },
        { insuranceProvider: { slug: { in: filters.brands } } },
      ],
    });
  }
  if (typeof filters.maxMonthlyFee === "number") {
    where.monthlyFee = { lte: filters.maxMonthlyFee };
  }
  for (const flag of [
    "onlineOpening",
    "applePay",
    "googlePay",
    "blik",
    "foreignersFriendly",
    "businessFriendly",
    "freeMaintenance",
    "noPeselRequired",
    "eurAccount",
  ] as const) {
    if (filters[flag]) where[flag] = true;
  }
  if (filters.cashback) where.cashbackPercent = { gt: 0 };
  if (filters.freeCard) where.cardFee = 0;
  if (filters.hasBonus) where.promoAmount = { gt: 0 };
  if (typeof filters.minRating === "number") {
    where.rating = { overall: { gte: filters.minRating } };
  }

  if (and.length) where.AND = and;
  return where;
}

/** Distinct brands available within a vertical, for the brand filter. */
export async function getBrands(vertical: "BANKING" | "INSURANCE") {
  if (vertical === "BANKING") {
    return prisma.bank.findMany({
      where: { products: { some: { published: true } } },
      select: { slug: true, name: true },
      orderBy: { name: "asc" },
    });
  }
  return prisma.insuranceProvider.findMany({
    where: { products: { some: { published: true } } },
    select: { slug: true, name: true },
    orderBy: { name: "asc" },
  });
}

function buildOrderBy(
  sort: ProductFilters["sort"],
): Prisma.ProductOrderByWithRelationInput[] {
  switch (sort) {
    case "rating":
      return [{ rating: { overall: "desc" } }, { popularity: "desc" }];
    case "feeAsc":
      return [{ monthlyFee: "asc" }, { popularity: "desc" }];
    case "feeDesc":
      return [{ monthlyFee: "desc" }, { popularity: "desc" }];
    default:
      return [{ featured: "desc" }, { popularity: "desc" }];
  }
}

export async function getProducts(filters: ProductFilters = {}) {
  const page = Math.max(1, filters.page ?? 1);
  const perPage = filters.perPage ?? 9;
  const where = buildWhere(filters);

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: productInclude,
      orderBy: buildOrderBy(filters.sort),
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    items,
    total,
    page,
    perPage,
    totalPages: Math.max(1, Math.ceil(total / perPage)),
  };
}

export async function getFeaturedProducts(limit = 6) {
  return prisma.product.findMany({
    where: { published: true, featured: true },
    include: productInclude,
    orderBy: { popularity: "desc" },
    take: limit,
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: { ...productInclude, reviews: { orderBy: { createdAt: "desc" }, take: 6 } },
  });
}

export async function getRelatedProducts(
  product: { id: string; type: string },
  limit = 3,
) {
  return prisma.product.findMany({
    where: { published: true, type: product.type, id: { not: product.id } },
    include: productInclude,
    orderBy: { popularity: "desc" },
    take: limit,
  });
}

export async function getProductsByIds(ids: string[]) {
  if (!ids.length) return [];
  const products = await prisma.product.findMany({
    where: { id: { in: ids }, published: true },
    include: productInclude,
  });
  // Preserve requested order
  return ids.map((id) => products.find((p) => p.id === id)).filter(Boolean) as typeof products;
}

export async function getCategories(vertical?: "BANKING" | "INSURANCE") {
  return prisma.category.findMany({
    where: vertical ? { vertical } : undefined,
    orderBy: { order: "asc" },
  });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({ where: { slug } });
}

export async function getTopRanked(type: string, limit = 1) {
  return prisma.product.findMany({
    where: { published: true, type },
    include: productInclude,
    orderBy: [{ rating: { overall: "desc" } }, { popularity: "desc" }],
    take: limit,
  });
}

// --- Blog ---

export async function getBlogPosts(opts: { category?: string; limit?: number } = {}) {
  return prisma.blogPost.findMany({
    where: {
      published: true,
      ...(opts.category && opts.category !== "ALL" ? { category: opts.category } : {}),
    },
    include: { author: true },
    orderBy: { publishedAt: "desc" },
    take: opts.limit,
  });
}

export async function getBlogPost(slug: string) {
  return prisma.blogPost.findUnique({
    where: { slug },
    include: { author: true, faqs: { orderBy: { order: "asc" } } },
  });
}

// --- Global FAQ (for homepage) ---

export async function getGlobalFaqs(limit = 6) {
  return prisma.fAQ.findMany({
    where: { productId: null, blogPostId: null },
    orderBy: { order: "asc" },
    take: limit,
  });
}
