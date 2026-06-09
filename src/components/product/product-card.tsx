import { getLocale, getTranslations } from "next-intl/server";
import { Check } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/brand/brand-mark";
import { RatingStars } from "./rating-stars";
import { ApplyButton } from "@/components/affiliate/apply-button";
import { CompareToggle } from "@/components/compare/compare-toggle";
import { asStringArray, cn } from "@/lib/utils";
import { formatMonthlyFee } from "@/lib/format";
import type { ProductWithRelations } from "@/lib/queries";
import type { Locale } from "@/lib/site";

export async function ProductCard({
  product,
  className,
}: {
  product: ProductWithRelations;
  className?: string;
}) {
  const t = await getTranslations("Listing");
  const tp = await getTranslations("Product");
  const locale = (await getLocale()) as Locale;

  const brand = product.bank?.name ?? product.insuranceProvider?.name;
  const badges = asStringArray(product.badges);
  const benefits = asStringArray(product.benefits).slice(0, 3);
  const primaryLink = product.affiliateLinks[0];

  return (
    <Card
      className={cn(
        "group flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-card",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3 p-5 pb-4">
        <div className="flex items-center gap-3">
          <BrandMark name={product.name} logoUrl={product.logoUrl} size="sm" />
          <div>
            {brand && <p className="text-xs text-muted-foreground">{brand}</p>}
            <h3 className="text-base font-semibold leading-tight">
              <Link
                href={`/products/${product.slug}`}
                className="transition-colors after:absolute hover:text-accent"
              >
                {product.name}
              </Link>
            </h3>
          </div>
        </div>
        {badges[0] && (
          <Badge variant="accent" className="shrink-0">
            {badges[0]}
          </Badge>
        )}
      </div>

      <div className="flex-1 px-5">
        <p className="line-clamp-2 text-sm text-muted-foreground">{product.tagline}</p>

        {product.rating && (
          <div className="mt-3 flex items-center gap-2">
            <RatingStars value={product.rating.overall} showValue />
            <span className="text-xs text-muted-foreground">
              ({product.rating.reviewCount})
            </span>
          </div>
        )}

        <ul className="mt-4 space-y-1.5">
          {benefits.map((b) => (
            <li key={b} className="flex items-start gap-2 text-sm text-foreground">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5 border-t border-border bg-surface/60 p-5">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="text-xs text-muted-foreground">{t("monthlyFee")}</p>
            <p className="text-lg font-semibold text-foreground">
              {formatMonthlyFee(product.monthlyFee, locale, t("free"))}
            </p>
          </div>
          {typeof product.cashbackPercent === "number" && product.cashbackPercent > 0 && (
            <Badge variant="success">{product.cashbackPercent}% cashback</Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <ApplyButton
            linkId={primaryLink?.id}
            url={primaryLink?.url}
            productSlug={product.slug}
            label={tp("apply")}
            size="sm"
            className="flex-1"
          />
          <CompareToggle productId={product.id} />
        </div>
        <Button asChild variant="link" size="sm" className="mt-1 h-auto p-0 text-muted-foreground">
          <Link href={`/products/${product.slug}`}>{t("viewDetails")}</Link>
        </Button>
      </div>
    </Card>
  );
}
