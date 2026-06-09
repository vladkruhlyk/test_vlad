import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { GitCompareArrows } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CompareTable } from "@/components/compare/compare-table";
import { getProductsByIds } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Compare" });
  return buildMetadata({ locale, title: t("title"), description: t("subtitle"), path: "/compare", noIndex: true });
}

export default async function ComparePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ ids?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { ids } = await searchParams;
  const t = await getTranslations("Compare");

  const idList = (ids ?? "").split(",").map((s) => s.trim()).filter(Boolean).slice(0, 4);
  const products = idList.length ? await getProductsByIds(idList) : [];

  return (
    <div className="container py-8 lg:py-12">
      <Breadcrumbs items={[{ name: t("title"), href: "/compare" }]} className="mb-6" />

      <header className="max-w-2xl">
        <h1 className="text-display-sm font-semibold sm:text-display-md">{t("title")}</h1>
        <p className="mt-3 text-lg text-muted-foreground">{t("subtitle")}</p>
      </header>

      {products.length < 2 ? (
        <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface/50 px-6 py-20 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface text-muted-foreground">
            <GitCompareArrows className="h-6 w-6" />
          </span>
          <p className="mt-4 max-w-sm text-muted-foreground">{t("empty")}</p>
          <Button asChild className="mt-6">
            <Link href="/banks">{t("addProduct")}</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-border bg-card p-4 shadow-soft sm:p-6">
          <CompareTable products={products} />
        </div>
      )}
    </div>
  );
}
