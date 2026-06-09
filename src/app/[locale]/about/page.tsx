import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ShieldCheck, Scale, Users, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Pages" });
  return buildMetadata({ locale, title: t("aboutTitle"), description: t("aboutLead"), path: "/about" });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Pages");
  const tNav = await getTranslations("Nav");

  const values = [
    { icon: Scale, title: "Independent", text: "Our rankings are based on data and editorial analysis — never on who pays us the most." },
    { icon: ShieldCheck, title: "Transparent", text: "We clearly disclose affiliate relationships and never hide fees from you." },
    { icon: Users, title: "User-first", text: "We design every comparison around real decisions people make about their money." },
    { icon: Sparkles, title: "Always current", text: "We review offers regularly so the information you see reflects today's market." },
  ];

  return (
    <>
      <PageHeader
        title={t("aboutTitle")}
        lead={t("aboutLead")}
        crumbs={[{ name: tNav("about"), href: "/about" }]}
      />
      <div className="container py-12 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-5 text-muted-foreground">
            <p className="text-lg leading-relaxed">
              FinPort started with a simple frustration: comparing financial products in Poland was
              confusing, slow and full of hidden costs. We set out to build a comparison platform
              that feels like a modern fintech product — fast, clear and genuinely helpful.
            </p>
            <p className="leading-relaxed">
              Today we help hundreds of thousands of people compare bank accounts, cards and
              insurance, and choose with confidence. We earn a commission when you apply through our
              partners, which keeps the service free for you and never influences our rankings.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {values.map((v) => (
              <div key={v.title} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <v.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-semibold">{v.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
