import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import {
  CheckCircle2,
  ClipboardList,
  Gift,
  ListChecks,
  Sparkles,
} from "lucide-react";
import { products } from "@/data/catalog";
import { getProductBySlug, getRelatedProducts } from "@/lib/queries";
import { asStringArray, absoluteUrl } from "@/lib/utils";
import { formatCurrency, formatMonthlyFee, formatDate } from "@/lib/format";
import { buildMetadata } from "@/lib/seo";
import {
  JsonLd,
  productSchema,
  faqSchema,
  breadcrumbSchema,
} from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { BrandMark } from "@/components/brand/brand-mark";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { RatingStars } from "@/components/product/rating-stars";
import { ProsCons } from "@/components/product/pros-cons";
import { ProductCard } from "@/components/product/product-card";
import { ApplyButton } from "@/components/affiliate/apply-button";
import { CompareToggle } from "@/components/compare/compare-toggle";
import { DisclosureBlock } from "@/components/affiliate/disclosure-block";
import type { Locale } from "@/lib/site";

export const dynamicParams = true;

export function generateStaticParams() {
  return products.filter((p) => p.published).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return buildMetadata({ locale, noIndex: true });
  return buildMetadata({
    locale,
    title: product.metaTitle ?? product.name,
    description: product.metaDescription ?? product.summary ?? undefined,
    path: `/products/${slug}`,
    image: product.ogImage ?? undefined,
    type: "article",
  });
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const t = await getTranslations("Product");
  const tNav = await getTranslations("Nav");
  const lng = (await getLocale()) as Locale;

  const brand = product.bank?.name ?? product.insuranceProvider?.name;
  const website = product.bank?.website ?? product.insuranceProvider?.website;
  const pros = asStringArray(product.pros);
  const cons = asStringArray(product.cons);
  const benefits = asStringArray(product.benefits);
  const requirements = asStringArray(product.requirements);
  const badges = asStringArray(product.badges);
  const primaryLink = product.affiliateLinks[0];
  const related = await getRelatedProducts(product, 3);

  // Group features for the fees table.
  const groups = product.features.reduce<Record<string, typeof product.features>>(
    (acc, f) => {
      const key = f.group ?? "General";
      (acc[key] ??= []).push(f);
      return acc;
    },
    {},
  );

  const isBanking = product.category.vertical === "BANKING";
  const crumbs = [
    { name: isBanking ? tNav("banks") : tNav("insurance"), href: isBanking ? "/banks" : "/insurance" },
    { name: product.name, href: `/products/${slug}` },
  ];

  const ctaLabel = brand ? t("applyAt", { brand }) : t("apply");

  return (
    <article className="container py-8 lg:py-12">
      <Breadcrumbs items={crumbs} className="mb-6" />

      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        {/* Main column */}
        <div className="min-w-0 space-y-12">
          {/* Hero */}
          <header>
            <div className="flex flex-wrap items-start gap-5">
              <BrandMark name={product.name} logoUrl={product.logoUrl} size="lg" />
              <div className="min-w-0 flex-1">
                {brand && <p className="text-sm text-muted-foreground">{brand}</p>}
                <h1 className="text-display-sm font-semibold leading-tight">{product.name}</h1>
                {product.tagline && (
                  <p className="mt-2 text-lg text-muted-foreground">{product.tagline}</p>
                )}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              {product.rating && (
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5">
                  <RatingStars value={product.rating.overall} showValue />
                  <span className="text-sm text-muted-foreground">
                    {t("reviews", { count: product.rating.reviewCount })}
                  </span>
                </span>
              )}
              {badges.map((b) => (
                <Badge key={b} variant="accent">
                  <Sparkles className="h-3 w-3" /> {b}
                </Badge>
              ))}
            </div>
          </header>

          {/* Pros / Cons */}
          <ProsCons pros={pros} cons={cons} />

          {/* Summary */}
          {product.summary && (
            <section>
              <h2 className="text-xl font-semibold">{t("summary")}</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">{product.summary}</p>
            </section>
          )}

          {/* Fees / features table */}
          {product.features.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold">{t("fees")}</h2>
              <div className="mt-4 overflow-hidden rounded-2xl border border-border">
                {Object.entries(groups).map(([group, feats]) => (
                  <div key={group}>
                    <div className="bg-surface px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {group}
                    </div>
                    {feats.map((f, i) => (
                      <div
                        key={f.id}
                        className={`flex items-center justify-between gap-4 px-5 py-3.5 text-sm ${i % 2 ? "bg-surface/40" : ""}`}
                      >
                        <span className="text-muted-foreground">{f.label}</span>
                        <span className="text-right font-medium">{f.value}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Requirements + Benefits */}
          <div className="grid gap-8 sm:grid-cols-2">
            {requirements.length > 0 && (
              <section>
                <h2 className="flex items-center gap-2 text-xl font-semibold">
                  <ListChecks className="h-5 w-5 text-accent" /> {t("requirements")}
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {requirements.map((r) => (
                    <li key={r} className="flex items-start gap-2.5 text-sm">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {benefits.length > 0 && (
              <section>
                <h2 className="flex items-center gap-2 text-xl font-semibold">
                  <Gift className="h-5 w-5 text-accent" /> {t("benefits")}
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-sm">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* How to apply */}
          <section>
            <h2 className="flex items-center gap-2 text-xl font-semibold">
              <ClipboardList className="h-5 w-5 text-accent" /> {t("howToApply")}
            </h2>
            <ol className="mt-4 space-y-4">
              {[
                "Click the Apply button to go to the provider's secure site.",
                "Fill in the online application form with your details.",
                "Verify your identity online and confirm the agreement.",
              ].map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {i + 1}
                  </span>
                  <p className="pt-1 text-sm text-muted-foreground">{step}</p>
                </li>
              ))}
            </ol>
          </section>

          {/* FAQ */}
          {product.faqs.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold">{t("faq")}</h2>
              <Accordion type="single" collapsible className="mt-2">
                {product.faqs.map((f) => (
                  <AccordionItem key={f.id} value={f.id}>
                    <AccordionTrigger>{f.question}</AccordionTrigger>
                    <AccordionContent>{f.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          )}

          {/* Author + disclosure */}
          <div className="space-y-5">
            <Separator />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface font-semibold">
                  FP
                </div>
                <div>
                  <p className="font-medium text-foreground">FinPort Editorial</p>
                  <p className="text-xs">{t("author")}</p>
                </div>
              </div>
              <p className="text-xs">
                {t("updated")}: {formatDate(product.updatedAt, lng, { month: "short", year: "numeric" })}
              </p>
            </div>
            <DisclosureBlock />
          </div>
        </div>

        {/* Sticky CTA aside */}
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <p className="text-sm text-muted-foreground">{t("monthlyFee")}</p>
            <p className="text-display-sm font-semibold">
              {formatMonthlyFee(product.monthlyFee, lng, t("free"))}
            </p>

            <dl className="mt-5 space-y-3 text-sm">
              {typeof product.cardFee === "number" && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">{t("cardFee")}</dt>
                  <dd className="font-medium">
                    {product.cardFee === 0 ? t("free") : formatCurrency(product.cardFee, lng)}
                  </dd>
                </div>
              )}
              {typeof product.cashbackPercent === "number" && product.cashbackPercent > 0 && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">{t("cashback")}</dt>
                  <dd className="font-medium text-success">{product.cashbackPercent}%</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-muted-foreground">{t("currency")}</dt>
                <dd className="font-medium">{product.currency}</dd>
              </div>
            </dl>

            <div className="mt-6 space-y-2">
              <ApplyButton
                linkId={primaryLink?.id}
                url={primaryLink?.url ?? website ?? undefined}
                productSlug={product.slug}
                label={ctaLabel}
                size="lg"
                className="w-full"
              />
              <CompareToggle productId={product.id} className="w-full" />
            </div>
          </div>
        </aside>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-semibold">{t("related")}</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Structured data */}
      <JsonLd
        data={[
          productSchema({
            name: product.name,
            description: product.summary ?? undefined,
            image: product.logoUrl ?? undefined,
            brand,
            url: absoluteUrl(`/products/${slug}`),
            rating: product.rating
              ? { value: product.rating.overall, count: product.rating.reviewCount }
              : null,
          }),
          ...(product.faqs.length
            ? [faqSchema(product.faqs.map((f) => ({ question: f.question, answer: f.answer })))]
            : []),
          breadcrumbSchema(
            [{ name: "Home", href: "/" }, ...crumbs].map((c) => ({ name: c.name, url: c.href })),
          ),
        ]}
      />
    </article>
  );
}
