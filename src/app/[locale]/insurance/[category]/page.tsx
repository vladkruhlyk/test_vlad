import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ProductListing } from "@/components/listing/product-listing";
import { parseFilters, type RawSearchParams } from "@/lib/parse-filters";
import { getCategoryBySlug } from "@/lib/queries";
import { categoryI18n } from "@/lib/category-i18n";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/site";

async function resolveTitle(slug: string, locale: Locale, fallback: string) {
  const map = categoryI18n[slug];
  if (!map) return fallback;
  const t = await getTranslations({ locale, namespace: map.ns });
  return t(map.key);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; category: string }>;
}): Promise<Metadata> {
  const { locale, category } = await params;
  const cat = await getCategoryBySlug(category);
  if (!cat || cat.vertical !== "INSURANCE") return buildMetadata({ locale, noIndex: true });
  const title = await resolveTitle(category, locale, cat.name);
  return buildMetadata({
    locale,
    title,
    description: cat.metaDescription ?? cat.description ?? undefined,
    path: `/insurance/${category}`,
  });
}

export default async function InsuranceCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; category: string }>;
  searchParams: Promise<RawSearchParams>;
}) {
  const { locale, category } = await params;
  setRequestLocale(locale);
  const cat = await getCategoryBySlug(category);
  if (!cat || cat.vertical !== "INSURANCE") notFound();

  const sp = await searchParams;
  const t = await getTranslations("Nav");
  const title = await resolveTitle(category, locale as Locale, cat.name);

  return (
    <ProductListing
      title={title}
      subtitle={cat.description ?? undefined}
      crumbs={[
        { name: t("insurance"), href: "/insurance" },
        { name: title, href: `/insurance/${category}` },
      ]}
      filters={parseFilters(sp, { categorySlug: category })}
      vertical="INSURANCE"
    />
  );
}
