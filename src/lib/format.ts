import type { Locale } from "./site";

const localeMap: Record<Locale, string> = {
  pl: "pl-PL",
  en: "en-GB",
  uk: "uk-UA",
};

export function formatCurrency(
  amount: number | null | undefined,
  locale: Locale = "pl",
  currency = "PLN",
): string {
  if (amount === null || amount === undefined) return "—";
  return new Intl.NumberFormat(localeMap[locale], {
    style: "currency",
    currency,
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

export function formatNumber(value: number, locale: Locale = "pl"): string {
  return new Intl.NumberFormat(localeMap[locale]).format(value);
}

export function formatPercent(value: number | null | undefined, locale: Locale = "pl"): string {
  if (value === null || value === undefined) return "—";
  return new Intl.NumberFormat(localeMap[locale], {
    style: "percent",
    maximumFractionDigits: 1,
  }).format(value / 100);
}

export function formatDate(
  date: Date | string,
  locale: Locale = "pl",
  opts: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" },
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(localeMap[locale], opts).format(d);
}

/** Format a monthly fee, treating 0 as "Free". */
export function formatMonthlyFee(
  fee: number | null | undefined,
  locale: Locale = "pl",
  freeLabel = "Free",
): string {
  if (fee === null || fee === undefined) return "—";
  if (fee === 0) return freeLabel;
  return `${formatCurrency(fee, locale)} / mo`;
}
