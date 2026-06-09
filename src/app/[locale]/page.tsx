import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/home/hero";
import {
  TrustSection,
  CategoriesSection,
  HowItWorks,
  ComparePreview,
  WizardCta,
} from "@/components/home/static-sections";
import {
  FeaturedSection,
  RankingsSection,
  LatestPosts,
  HomeFaq,
} from "@/components/home/data-sections";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Home" });
  return buildMetadata({
    locale,
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "",
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <TrustSection />
      <CategoriesSection />
      <HowItWorks />
      <FeaturedSection />
      <RankingsSection />
      <ComparePreview />
      <LatestPosts />
      <HomeFaq />
      <WizardCta />
    </>
  );
}
