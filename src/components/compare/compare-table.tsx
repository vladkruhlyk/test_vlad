import { getLocale, getTranslations } from "next-intl/server";
import { Check, Minus, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { BrandMark } from "@/components/brand/brand-mark";
import { RatingStars } from "@/components/product/rating-stars";
import { ApplyButton } from "@/components/affiliate/apply-button";
import { formatCurrency, formatMonthlyFee } from "@/lib/format";
import type { ProductWithRelations } from "@/lib/queries";
import type { Locale } from "@/lib/site";

function Bool({ value }: { value: boolean }) {
  return value ? (
    <Check className="mx-auto h-5 w-5 text-success" />
  ) : (
    <X className="mx-auto h-5 w-5 text-muted-foreground/40" />
  );
}

export async function CompareTable({ products }: { products: ProductWithRelations[] }) {
  const t = await getTranslations("Listing");
  const tc = await getTranslations("Compare");
  const tp = await getTranslations("Product");
  const lng = (await getLocale()) as Locale;

  // Highlights
  const fees = products.map((p) => p.monthlyFee ?? Infinity);
  const lowestFeeId = products[fees.indexOf(Math.min(...fees))]?.id;
  const mostPopularId = [...products].sort((a, b) => b.popularity - a.popularity)[0]?.id;
  const bestValueId = [...products].sort(
    (a, b) => (b.rating?.overall ?? 0) - (a.rating?.overall ?? 0),
  )[0]?.id;

  const rows: { label: string; render: (p: ProductWithRelations) => React.ReactNode }[] = [
    { label: t("monthlyFee"), render: (p) => formatMonthlyFee(p.monthlyFee, lng, t("free")) },
    {
      label: t("cardFee"),
      render: (p) =>
        p.cardFee == null ? <Minus className="mx-auto h-4 w-4 text-muted-foreground/40" /> : p.cardFee === 0 ? t("free") : formatCurrency(p.cardFee, lng),
    },
    {
      label: t("cashback"),
      render: (p) => (p.cashbackPercent ? `${p.cashbackPercent}%` : <Minus className="mx-auto h-4 w-4 text-muted-foreground/40" />),
    },
    { label: t("onlineOpening"), render: (p) => <Bool value={p.onlineOpening} /> },
    { label: t("applePay"), render: (p) => <Bool value={p.applePay} /> },
    { label: t("googlePay"), render: (p) => <Bool value={p.googlePay} /> },
    { label: t("blik"), render: (p) => <Bool value={p.blik} /> },
    { label: t("foreigners"), render: (p) => <Bool value={p.foreignersFriendly} /> },
    { label: t("business"), render: (p) => <Bool value={p.businessFriendly} /> },
    {
      label: tp("rating"),
      render: (p) => (p.rating ? <RatingStars value={p.rating.overall} showValue className="justify-center" /> : "—"),
    },
  ];

  function highlight(p: ProductWithRelations) {
    if (p.id === bestValueId) return <Badge variant="accent">{tc("bestValue")}</Badge>;
    if (p.id === lowestFeeId) return <Badge variant="success">{tc("lowestFees")}</Badge>;
    if (p.id === mostPopularId) return <Badge variant="warning">{tc("mostPopular")}</Badge>;
    return null;
  }

  return (
    <div className="overflow-x-auto no-scrollbar">
      <table className="w-full min-w-[640px] border-separate border-spacing-0">
        <thead>
          <tr>
            <th className="sticky left-0 z-10 w-40 bg-background" />
            {products.map((p) => {
              return (
                <th key={p.id} className="p-3 align-top">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <BrandMark name={p.name} logoUrl={p.logoUrl} size="sm" />
                    <Link href={`/products/${p.slug}`} className="text-sm font-semibold leading-tight hover:text-accent">
                      {p.name}
                    </Link>
                    <div className="min-h-[1.5rem]">{highlight(p)}</div>
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.label} className={i % 2 ? "bg-surface/40" : ""}>
              <td className="sticky left-0 z-10 bg-inherit px-3 py-3.5 text-sm font-medium text-muted-foreground">
                {row.label}
              </td>
              {products.map((p) => (
                <td key={p.id} className="px-3 py-3.5 text-center text-sm font-medium">
                  {row.render(p)}
                </td>
              ))}
            </tr>
          ))}
          <tr>
            <td className="sticky left-0 z-10 bg-background" />
            {products.map((p) => (
              <td key={p.id} className="px-3 py-4 text-center">
                <ApplyButton
                  linkId={p.affiliateLinks[0]?.id}
                  url={p.affiliateLinks[0]?.url}
                  productSlug={p.slug}
                  label={tc("apply")}
                  size="sm"
                  className="w-full"
                />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
