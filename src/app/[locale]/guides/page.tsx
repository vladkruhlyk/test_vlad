import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, BookOpen } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { PageHeader } from "@/components/page-header";
import { BlogCard } from "@/components/blog/blog-card";
import { getBlogPosts } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Pages" });
  return buildMetadata({ locale, title: t("guidesTitle"), description: t("guidesLead"), path: "/guides" });
}

export default async function GuidesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Pages");
  const tNav = await getTranslations("Nav");

  const topics = [
    { title: "Choosing a personal account", href: "/banks/personal-accounts" },
    { title: "Banking for foreigners", href: "/banks/accounts-for-foreigners" },
    { title: "Business accounts explained", href: "/banks/business-accounts" },
    { title: "Car insurance basics", href: "/insurance/car-insurance" },
    { title: "Home insurance guide", href: "/insurance/home-insurance" },
    { title: "Compare products", href: "/compare" },
  ];

  const posts = await getBlogPosts({ limit: 6 });

  return (
    <>
      <PageHeader
        title={t("guidesTitle")}
        lead={t("guidesLead")}
        crumbs={[{ name: tNav("guides"), href: "/guides" }]}
      />
      <div className="container py-12 lg:py-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic) => (
            <Link
              key={topic.href}
              href={topic.href}
              className="group flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <BookOpen className="h-5 w-5" />
                </span>
                <span className="font-medium">{topic.title}</span>
              </span>
              <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </div>

        <h2 className="mt-16 text-xl font-semibold">Latest guides</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <BlogCard key={p.id} post={p} />
          ))}
        </div>
      </div>
    </>
  );
}
