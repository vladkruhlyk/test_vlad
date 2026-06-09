import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import type { Locale } from "@/lib/site";
import type { PostWithAuthor } from "@/data/types";

const categoryKey: Record<string, string> = {
  BANKING: "banking",
  INSURANCE: "insuranceCat",
  BUSINESS: "business",
  GUIDES: "guides",
  FOREIGNERS: "foreigners",
};

export async function BlogCard({ post }: { post: PostWithAuthor }) {
  const t = await getTranslations("Blog");
  const locale = (await getLocale()) as Locale;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
      <Link href={`/blog/${post.slug}`} className="relative block aspect-[16/10] overflow-hidden bg-surface">
        {post.coverImage && (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <Badge variant="muted" className="absolute left-3 top-3 bg-background/90 backdrop-blur">
          {t(categoryKey[post.category] ?? "guides")}
        </Badge>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-semibold leading-snug">
          <Link href={`/blog/${post.slug}`} className="transition-colors group-hover:text-accent">
            {post.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted-foreground">{post.excerpt}</p>
        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>{post.author?.name}</span>
          <span>
            {formatDate(post.publishedAt, locale, { month: "short", day: "numeric" })} ·{" "}
            {t("readingTime", { mins: post.readingMins })}
          </span>
        </div>
      </div>
    </article>
  );
}
