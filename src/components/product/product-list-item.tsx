import { getLocale, getTranslations } from "next-intl/server";
import { Check, Smartphone, Globe, Zap, Wallet } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/brand/brand-mark";
import { RatingStars } from "./rating-stars";
import { ApplyButton } from "@/components/affiliate/apply-button";
import { CompareToggle } from "@/components/compare/compare-toggle";
import { asStringArray } from "@/lib/utils";
import { formatMonthlyFee } from "@/lib/format";
import type { ProductWithRelations } from "@/lib/queries";
import type { Locale } from "@/lib/site";

/** Horizontal, information-dense product row used on listing pages. */
export async function ProductListItem({ product }: { product: ProductWithRelations }) {
  const t = await getTranslations("Listing");
  const tp = await getTranslations("Product");
  const locale = (await getLocale()) as Locale;

  const brand = product.bank?.name ?? product.insuranceProvider?.name;
  const badges = asStringArray(product.badges);
  const benefits = asStringArray(product.benefits).slice(0, 4);
  const primaryLink = product.affiliateLinks[0];

  const chips = [
    product.onlineOpening && { icon: Globe, label: t("onlineOpening") },
    typeof product.cashbackPercent === "number" && product.cashbackPercent > 0 && {
      icon: Wallet,
      label: `${product.cashbackPercent}% ${t("cashback").toLowerCase()}`,
    },
    product.blik && { icon: Zap, label: "BLIK" },
    (product.applePay || product.googlePay) && { icon: Smartphone, label: "Apple / Google Pay" },
  ].filter(Boolean) as { icon: typeof Globe; label: string }[];

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-card">
      <div className="grid gap-5 p-5 lg:grid-cols-[1fr_auto] lg:gap-8 lg:p-6">
        {/* Left: identity + details */}
        <div className="min-w-0">
          <div className="flex items-start gap-4">
            <BrandMark name={product.name} logoUrl={product.logoUrl} size="md" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                {brand && <span className="text-xs text-muted-foreground">{brand}</span>}
                {badges.map((b) => (
                  <Badge key={b} variant="accent" className="text-[11px]">
                    {b}
                  </Badge>
                ))}
              </div>
              <h3 className="mt-0.5 text-lg font-semibold leading-tight">
                <Link href={`/products/${product.slug}`} className="hover:text-accent">
                  {product.name}
                </Link>
              </h3>
              {product.rating && (
                <div className="mt-1 flex items-center gap-2">
                  <RatingStars value={product.rating.overall} showValue />
                  <span className="text-xs text-muted-foreground">
                    ({product.rating.reviewCount})
                  </span>
                </div>
              )}
            </div>
          </div>

          {product.tagline && (
            <p className="mt-3 text-sm text-muted-foreground">{product.tagline}</p>
          )}

          {/* Feature chips */}
          {chips.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {chips.map((c) => (
                <span
                  key={c.label}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-surface px-2.5 py-1 text-xs font-medium text-secondary-foreground"
                >
                  <c.icon className="h-3.5 w-3.5 text-accent" />
                  {c.label}
                </span>
              ))}
            </div>
          )}

          {/* Benefits — two columns of ticks */}
          {benefits.length > 0 && (
            <ul className="mt-4 grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm text-foreground">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Right rail: price + CTAs */}
        <div className="flex flex-col justify-between gap-4 border-t border-border pt-4 lg:w-56 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <div>
            <p className="text-xs text-muted-foreground">{t("monthlyFee")}</p>
            <p className="text-2xl font-semibold">
              {formatMonthlyFee(product.monthlyFee, locale, t("free"))}
            </p>
            {typeof product.promoAmount === "number" && product.promoAmount > 0 && (
              <Badge variant="success" className="mt-2">
                +{product.promoAmount} PLN bonus
              </Badge>
            )}
          </div>
          <div className="space-y-2">
            <ApplyButton
              linkId={primaryLink?.id}
              url={primaryLink?.url}
              productSlug={product.slug}
              label={tp("apply")}
              className="w-full"
            />
            <div className="flex gap-2">
              <CompareToggle productId={product.id} className="flex-1" />
              <Button asChild variant="ghost" size="sm" className="flex-1">
                <Link href={`/products/${product.slug}`}>{t("viewDetails")}</Link>
              </Button>
            </div>
            <p className="text-center text-[11px] text-muted-foreground">{tp("disclosureShort")}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
