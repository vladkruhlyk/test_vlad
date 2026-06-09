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
    title: t("banks"),
    description:
      "Compare personal accounts, business accounts and cards in Poland by fees, cashback and benefits.",
    path: "/banks",
  });
}

export default async function BanksPage({
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
      title={t("banks")}
      subtitle="Compare accounts and cards from Poland's leading banks."
      crumbs={[{ name: t("banks"), href: "/banks" }]}
      filters={parseFilters(sp, { vertical: "BANKING" })}
      vertical="BANKING"
    />
  );
}
