import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { BlogCard } from "@/components/blog/blog-card";
import { getBlogPosts } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/site";

const CATEGORIES = [
  { value: "ALL", key: "all" },
  { value: "BANKING", key: "banking" },
  { value: "INSURANCE", key: "insuranceCat" },
  { value: "BUSINESS", key: "business" },
  { value: "GUIDES", key: "guides" },
  { value: "FOREIGNERS", key: "foreigners" },
] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Blog" });
  return buildMetadata({ locale, title: t("title"), description: t("subtitle"), path: "/blog" });
}

export default async function BlogPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { category } = await searchParams;
  const active = category ?? "ALL";
  const t = await getTranslations("Blog");

  const posts = await getBlogPosts({ category: active });

  return (
    <div className="container py-8 lg:py-12">
      <Breadcrumbs items={[{ name: t("title"), href: "/blog" }]} className="mb-6" />

      <header className="max-w-2xl">
        <h1 className="text-display-sm font-semibold sm:text-display-md">{t("title")}</h1>
        <p className="mt-3 text-lg text-muted-foreground">{t("subtitle")}</p>
      </header>

      {/* Category filter */}
      <div className="mt-8 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <Link
            key={c.value}
            href={c.value === "ALL" ? "/blog" : `/blog?category=${c.value}`}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              active === c.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:bg-surface",
            )}
          >
            {t(c.key)}
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
