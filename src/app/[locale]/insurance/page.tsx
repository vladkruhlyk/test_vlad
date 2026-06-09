import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ProductListing } from "@/components/listing/product-listing";
import { parseFilters, type RawSearchParams } from "@/lib/parse-filters";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Nav" });
  return buildMetadata({
    locale,
    title: t("insurance"),
    description: "Compare car, home, health, life and travel insurance in Poland.",
    path: "/insurance",
  });
}

export default async function InsurancePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<RawSearchParams>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;
  const t = await getTranslations("Nav");

  return (
    <ProductListing
      title={t("insurance")}
      subtitle="Compare insurance offers from Poland's leading providers."
      crumbs={[{ name: t("insurance"), href: "/insurance" }]}
      filters={parseFilters(sp, { vertical: "INSURANCE" })}
      vertical="INSURANCE"
    />
  );
}
