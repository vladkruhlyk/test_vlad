import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Mail, MessageSquare } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ContactForm } from "@/components/contact/contact-form";
import { buildMetadata } from "@/lib/seo";
import { siteConfig, type Locale } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Pages" });
  return buildMetadata({ locale, title: t("contactTitle"), description: t("contactLead"), path: "/contact" });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Pages");
  const tNav = await getTranslations("Nav");

  return (
    <>
      <PageHeader
        title={t("contactTitle")}
        lead={t("contactLead")}
        crumbs={[{ name: tNav("contact"), href: "/contact" }]}
      />
      <div className="container py-12 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <Mail className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold">Email</p>
                <a href={`mailto:${siteConfig.contact.email}`} className="text-sm text-accent hover:underline">
                  {siteConfig.contact.email}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <MessageSquare className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold">Support</p>
                <p className="text-sm text-muted-foreground">
                  We typically reply within one business day.
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft lg:p-8">
            <ContactForm />
          </div>
        </div>
      </div>
    </>
  );
}
