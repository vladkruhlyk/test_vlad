import { getTranslations } from "next-intl/server";
import { ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { JsonLd, breadcrumbSchema } from "@/components/seo/json-ld";
import { cn } from "@/lib/utils";

export interface Crumb {
  name: string;
  href: string;
}

export async function Breadcrumbs({
  items,
  className,
}: {
  items: Crumb[];
  className?: string;
}) {
  const t = await getTranslations("Common");
  const all: Crumb[] = [{ name: t("breadcrumbHome"), href: "/" }, ...items];

  return (
    <>
      <nav aria-label="Breadcrumb" className={cn("flex items-center", className)}>
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
          {all.map((crumb, i) => {
            const last = i === all.length - 1;
            return (
              <li key={crumb.href} className="flex items-center gap-1.5">
                {last ? (
                  <span className="font-medium text-foreground" aria-current="page">
                    {crumb.name}
                  </span>
                ) : (
                  <Link href={crumb.href} className="transition-colors hover:text-foreground">
                    {crumb.name}
                  </Link>
                )}
                {!last && <ChevronRight className="h-3.5 w-3.5 shrink-0" />}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={breadcrumbSchema(all.map((c) => ({ name: c.name, url: c.href })))} />
    </>
  );
}
