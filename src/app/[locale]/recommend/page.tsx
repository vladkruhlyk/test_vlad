import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Sparkles } from "lucide-react";
import { RecommendationWizard } from "@/components/wizard/recommendation-wizard";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Wizard" });
  return buildMetadata({ locale, title: t("title"), description: t("subtitle"), path: "/recommend" });
}

export default async function RecommendPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Wizard");

  return (
    <div className="container py-12 lg:py-20">
      <div className="mb-10 text-center">
        <span className="eyebrow mb-4">
          <Sparkles className="h-3.5 w-3.5 text-accent" /> AI-free, rules-based matching
        </span>
        <h1 className="text-display-sm font-semibold sm:text-display-md">{t("title")}</h1>
        <p className="mx-auto mt-3 max-w-xl text-lg text-muted-foreground">{t("subtitle")}</p>
      </div>
      <RecommendationWizard />
    </div>
  );
}
