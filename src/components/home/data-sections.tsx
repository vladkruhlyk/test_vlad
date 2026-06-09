import { getTranslations } from "next-intl/server";
import { ArrowRight, Trophy } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeading } from "@/components/section-heading";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { ProductCard } from "@/components/product/product-card";
import { BlogCard } from "@/components/blog/blog-card";
import { RatingStars } from "@/components/product/rating-stars";
import { JsonLd, faqSchema } from "@/components/seo/json-ld";
import {
  getFeaturedProducts,
  getBlogPosts,
  getGlobalFaqs,
  getTopRanked,
} from "@/lib/queries";

/* --------------------------- Featured --------------------------- */

export async function FeaturedSection() {
  const t = await getTranslations("Home.featured");
  const products = await getFeaturedProducts(6);
  if (!products.length) return null;

  return (
    <section className="section">
      <div className="container">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeading align="left" title={t("title")} subtitle={t("subtitle")} className="mx-0" />
          <Button asChild variant="outline" className="hidden shrink-0 sm:inline-flex">
            <Link href="/banks">
              {t("viewAll")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <RevealGroup className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <RevealItem key={p.id}>
              <ProductCard product={p} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

/* --------------------------- Rankings --------------------------- */

export async function RankingsSection() {
  const t = await getTranslations("Home.rankings");

  const groups = [
    { title: t("foreigners"), type: "PERSONAL_ACCOUNT", filterSlug: "accounts-for-foreigners" },
    { title: t("business"), type: "BUSINESS_ACCOUNT" },
    { title: t("cashback"), type: "PERSONAL_ACCOUNT" },
    { title: t("insurance"), type: "CAR_INSURANCE" },
  ];

  const ranked = await Promise.all(
    groups.map(async (g) => ({ ...g, product: (await getTopRanked(g.type, 1))[0] })),
  );

  return (
    <section className="section bg-surface/50">
      <div className="container">
        <SectionHeading eyebrow="Rankings" title={t("title")} subtitle={t("subtitle")} />
        <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2">
          {ranked
            .filter((g) => g.product)
            .map((g) => {
              const p = g.product!;
              const brand = p.bank?.name ?? p.insuranceProvider?.name;
              return (
                <RevealItem key={g.title}>
                  <Link
                    href={`/products/${p.slug}`}
                    className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card"
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-warning/15 text-amber-600">
                      <Trophy className="h-6 w-6" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {g.title}
                      </p>
                      <p className="truncate text-base font-semibold">{p.name}</p>
                      <div className="mt-1 flex items-center gap-2">
                        {p.rating && <RatingStars value={p.rating.overall} showValue />}
                        {brand && <span className="text-xs text-muted-foreground">· {brand}</span>}
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
                  </Link>
                </RevealItem>
              );
            })}
        </RevealGroup>
      </div>
    </section>
  );
}

/* --------------------------- Latest posts --------------------------- */

export async function LatestPosts() {
  const t = await getTranslations("Home.blog");
  const posts = await getBlogPosts({ limit: 3 });
  if (!posts.length) return null;

  return (
    <section className="section">
      <div className="container">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeading align="left" title={t("title")} subtitle={t("subtitle")} className="mx-0" />
          <Button asChild variant="outline" className="hidden shrink-0 sm:inline-flex">
            <Link href="/blog">
              {t("viewAll")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <RevealGroup className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <RevealItem key={p.id}>
              <BlogCard post={p} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

/* --------------------------- FAQ --------------------------- */

export async function HomeFaq() {
  const t = await getTranslations("Home.faq");
  const faqs = await getGlobalFaqs(6);
  if (!faqs.length) return null;

  return (
    <section className="section bg-surface/50">
      <div className="container max-w-3xl">
        <SectionHeading title={t("title")} subtitle={t("subtitle")} />
        <Reveal className="mt-10">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f) => (
              <AccordionItem key={f.id} value={f.id}>
                <AccordionTrigger>{f.question}</AccordionTrigger>
                <AccordionContent>{f.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
      <JsonLd data={faqSchema(faqs.map((f) => ({ question: f.question, answer: f.answer })))} />
    </section>
  );
}
