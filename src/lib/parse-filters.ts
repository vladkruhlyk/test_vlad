import type { ProductFilters } from "./queries";

export type RawSearchParams = Record<string, string | string[] | undefined>;

function flag(params: RawSearchParams, key: string): boolean | undefined {
  return params[key] ? true : undefined;
}

/** Parse URL search params into typed ProductFilters. */
export function parseFilters(
  params: RawSearchParams,
  base: Partial<ProductFilters> = {},
): ProductFilters {
  const sortRaw = typeof params.sort === "string" ? params.sort : undefined;
  const sort = (["popular", "rating", "feeAsc", "feeDesc"] as const).includes(
    sortRaw as never,
  )
    ? (sortRaw as ProductFilters["sort"])
    : undefined;

  const maxFee = typeof params.maxFee === "string" ? Number(params.maxFee) : undefined;
  const rating = typeof params.rating === "string" ? Number(params.rating) : undefined;
  const page = typeof params.page === "string" ? Math.max(1, Number(params.page) || 1) : 1;

  const brandRaw = params.brand;
  const brands =
    typeof brandRaw === "string"
      ? brandRaw.split(",").map((s) => s.trim()).filter(Boolean)
      : Array.isArray(brandRaw)
        ? brandRaw
        : undefined;

  return {
    ...base,
    search: typeof params.q === "string" ? params.q : undefined,
    maxMonthlyFee: maxFee !== undefined && !Number.isNaN(maxFee) ? maxFee : undefined,
    onlineOpening: flag(params, "onlineOpening"),
    applePay: flag(params, "applePay"),
    googlePay: flag(params, "googlePay"),
    blik: flag(params, "blik"),
    foreignersFriendly: flag(params, "foreigners"),
    businessFriendly: flag(params, "business"),
    freeMaintenance: flag(params, "freeMaintenance"),
    cashback: flag(params, "cashback"),
    freeCard: flag(params, "freeCard"),
    hasBonus: flag(params, "bonus"),
    noPeselRequired: flag(params, "noPesel"),
    eurAccount: flag(params, "eur"),
    minRating: rating !== undefined && !Number.isNaN(rating) ? rating : undefined,
    brands: brands?.length ? brands : undefined,
    sort,
    page,
  };
}
