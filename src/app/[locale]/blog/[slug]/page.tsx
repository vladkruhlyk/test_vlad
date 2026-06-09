import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft, CalendarDays, Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getBlogPost, getBlogPosts } from "@/lib/queries";
import { getPostSource, extractToc } from "@/lib/mdx";
import { absoluteUrl } from "@/lib/utils";
import { formatDate } from "@/lib/format";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, articleSchema, faqSchema, breadcrumbSchema } from "@/components/seo/json-ld";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BlogCard } from "@/components/blog/blog-card";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { mdxComponents } from "@/components/blog/mdx-components";
import type { Locale } from "@/lib/site";

export async function generateStaticParams() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    select: { slug: true },
  });
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return buildMetadata({ locale, noIndex: true });
  return buildMetadata({
    locale,
    title: post.metaTitle ?? post.title,
    description: post.metaDescription ?? post.excerpt ?? undefined,
    path: `/blog/${slug}`,
    image: post.ogImage ?? post.coverImage ?? undefined,
    type: "article",
    publishedTime: post.publishedAt.toISOString(),
    authors: post.author ? [post.author.name] : undefined,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = await getBlogPost(slug);
  if (!post) notFound();

  const source = getPostSource(slug);
  const toc = source ? extractToc(source) : [];
  const t = await getTranslations("Blog");
  const lng = (await getLocale()) as Locale;

  const related = (await getBlogPosts({ category: post.category, limit: 4 })).filter(
    (p) => p.slug !== slug,
  ).slice(0, 3);

  const categoryLabel: Record<string, string> = {
    BANKING: t("banking"),
    INSURANCE: t("insuranceCat"),
    BUSINESS: t("business"),
    GUIDES: t("guides"),
    FOREIGNERS: t("foreigners"),
  };

  return (
    <article className="container py-8 lg:py-12">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> {t("backToBlog")}
      </Link>

      {/* Header */}
      <header className="mx-auto mt-6 max-w-3xl text-center">
        <Badge variant="accent">{categoryLabel[post.category] ?? post.category}</Badge>
        <h1 className="mt-4 text-display-sm font-semibold leading-tight sm:text-display-md">
          {post.title}
        </h1>
        {post.excerpt && <p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p>}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
          {post.author && (
            <span className="flex items-center gap-2">
              {post.author.avatarUrl && (
                <Image
                  src={post.author.avatarUrl}
                  alt={post.author.name}
                  width={28}
                  height={28}
                  className="h-7 w-7 rounded-full object-cover"
                />
              )}
              {t("by")} <span className="font-medium text-foreground">{post.author.name}</span>
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4" />
            {formatDate(post.publishedAt, lng)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            {t("readingTime", { mins: post.readingMins })}
          </span>
        </div>
      </header>

      {/* Cover */}
      {post.coverImage && (
        <div className="relative mx-auto mt-10 aspect-[16/9] max-w-4xl overflow-hidden rounded-2xl border border-border">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 896px"
            className="object-cover"
          />
        </div>
      )}

      {/* Body + TOC */}
      <div className="mx-auto mt-12 grid max-w-4xl gap-10 lg:grid-cols-[1fr_220px]">
        <div className="min-w-0 lg:order-1">
          {source ? (
            <MDXRemote source={source} components={mdxComponents} />
          ) : (
            <p className="text-muted-foreground">{post.excerpt}</p>
          )}

          {/* FAQ */}
          {post.faqs.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-semibold">FAQ</h2>
              <Accordion type="single" collapsible className="mt-2">
                {post.faqs.map((f) => (
                  <AccordionItem key={f.id} value={f.id}>
                    <AccordionTrigger>{f.question}</AccordionTrigger>
                    <AccordionContent>{f.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          )}
        </div>

        <aside className="hidden lg:order-2 lg:block">
          <div className="sticky top-24">
            <TableOfContents items={toc} />
          </div>
        </aside>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mx-auto mt-16 max-w-4xl">
          <h2 className="text-xl font-semibold">{t("related")}</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <BlogCard key={p.id} post={p} />
            ))}
          </div>
        </section>
      )}

      <JsonLd
        data={[
          articleSchema({
            title: post.title,
            description: post.excerpt ?? undefined,
            image: post.coverImage ?? undefined,
            url: absoluteUrl(`/blog/${slug}`),
            authorName: post.author?.name,
            datePublished: post.publishedAt.toISOString(),
          }),
          ...(post.faqs.length
            ? [faqSchema(post.faqs.map((f) => ({ question: f.question, answer: f.answer })))]
            : []),
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: t("title"), url: "/blog" },
            { name: post.title, url: `/blog/${slug}` },
          ]),
        ]}
      />
    </article>
  );
}
