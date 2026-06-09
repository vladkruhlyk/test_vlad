import { z } from "zod";
import { products } from "@/data/catalog";

export const wizardSchema = z.object({
  pesel: z.boolean(),
  selfEmployed: z.boolean(),
  cashback: z.boolean(),
  eur: z.boolean(),
  freeMaintenance: z.boolean(),
  online: z.boolean(),
});

export type WizardAnswers = z.infer<typeof wizardSchema>;

export const wizardQuestions = [
  { id: "pesel", key: "q_pesel" },
  { id: "selfEmployed", key: "q_selfEmployed" },
  { id: "cashback", key: "q_cashback" },
  { id: "eur", key: "q_eur" },
  { id: "freeMaintenance", key: "q_freeMaintenance" },
  { id: "online", key: "q_online" },
] as const;

export interface RecommendedProduct {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  brand: string | null;
  logoUrl: string | null;
  monthlyFee: number | null;
  cashbackPercent: number | null;
  rating: number | null;
  reviewCount: number;
  affiliateUrl: string | null;
  affiliateLinkId: string | null;
  matchScore: number;
}

/**
 * Scores account products against the wizard answers and returns the top N.
 * Score weights matched preferences; rating breaks ties.
 */
export async function recommendProducts(
  answers: WizardAnswers,
  limit = 3,
): Promise<RecommendedProduct[]> {
  const accountProducts = products.filter(
    (p) => p.published && (p.type === "PERSONAL_ACCOUNT" || p.type === "BUSINESS_ACCOUNT"),
  );

  const scored = accountProducts.map((p) => {
    let score = 0;
    if (!answers.pesel) {
      if (p.noPeselRequired) score += 5;
      if (p.foreignersFriendly) score += 3;
    }
    if (answers.selfEmployed) {
      if (p.type === "BUSINESS_ACCOUNT") score += 5;
      if (p.businessFriendly) score += 2;
    } else if (p.type === "PERSONAL_ACCOUNT") {
      score += 1;
    }
    if (answers.cashback && (p.cashbackPercent ?? 0) > 0) score += 3;
    if (answers.eur && p.eurAccount) score += 4;
    if (answers.freeMaintenance && (p.freeMaintenance || p.monthlyFee === 0)) score += 2;
    if (answers.online && p.onlineOpening) score += 2;
    score += (p.rating?.overall ?? 0) / 5;
    return { p, score };
  });

  return scored
    .sort((a, b) => b.score - a.score || b.p.popularity - a.p.popularity)
    .slice(0, limit)
    .map(({ p, score }) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      tagline: p.tagline,
      brand: p.bank?.name ?? p.insuranceProvider?.name ?? null,
      logoUrl: p.logoUrl,
      monthlyFee: p.monthlyFee,
      cashbackPercent: p.cashbackPercent,
      rating: p.rating?.overall ?? null,
      reviewCount: p.rating?.reviewCount ?? 0,
      affiliateUrl: p.affiliateLinks[0]?.url ?? null,
      affiliateLinkId: p.affiliateLinks[0]?.id ?? null,
      matchScore: Math.round(score * 10) / 10,
    }));
}
