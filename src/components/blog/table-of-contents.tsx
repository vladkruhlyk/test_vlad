import { getTranslations } from "next-intl/server";
import { cn } from "@/lib/utils";
import type { TocItem } from "@/lib/mdx";

export async function TableOfContents({ items }: { items: TocItem[] }) {
  const t = await getTranslations("Blog");
  if (items.length < 2) return null;

  return (
    <nav aria-label={t("toc")} className="text-sm">
      <p className="mb-3 font-semibold text-foreground">{t("toc")}</p>
      <ul className="space-y-2 border-l border-border">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={cn(
                "-ml-px block border-l-2 border-transparent py-0.5 pl-4 text-muted-foreground transition-colors hover:border-accent hover:text-foreground",
                item.level === 3 && "pl-7 text-xs",
              )}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
