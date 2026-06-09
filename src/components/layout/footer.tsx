import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/brand/logo";
import { NewsletterForm } from "./newsletter-form";
import { footerNav, siteConfig } from "@/lib/site";

export async function Footer() {
  const t = await getTranslations("Footer");
  const year = 2026;

  const columns = [
    { title: t("product"), links: footerNav.product },
    { title: t("resources"), links: footerNav.resources },
    { title: t("legal"), links: footerNav.legal },
  ];

  return (
    <footer className="border-t border-border bg-surface">
      <div className="container py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          {/* Brand + newsletter */}
          <div className="max-w-sm">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {t("tagline")}
            </p>
            <div className="mt-6">
              <p className="text-sm font-semibold text-foreground">{t("newsletterTitle")}</p>
              <p className="mb-3 mt-1 text-sm text-muted-foreground">{t("newsletterText")}</p>
              <NewsletterForm />
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="text-sm font-semibold text-foreground">{col.title}</p>
                <ul className="mt-4 space-y-3">
                  {col.links.map((link) => (
                    <li key={link.key}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {t(link.key)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Affiliate disclosure */}
        <p className="mt-12 rounded-xl border border-border bg-background p-4 text-xs leading-relaxed text-muted-foreground">
          {t("disclaimer")}
        </p>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {year} {siteConfig.legalName}. {t("rights")}
          </p>
          <p>{siteConfig.domain}</p>
        </div>
      </div>
    </footer>
  );
}
