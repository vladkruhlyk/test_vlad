import { getTranslations } from "next-intl/server";
import {
  Wallet,
  ShieldCheck,
  Briefcase,
  BookOpen,
  Search,
  MousePointerClick,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/section-heading";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { BrandMark } from "@/components/brand/brand-mark";
import { brandLogos } from "@/lib/brand-logos";

/* ----------------------------- Trust ----------------------------- */

export async function TrustSection() {
  const t = await getTranslations("Home.trust");
  const stats = [
    { value: "120+", label: t("stat1") },
    { value: "250k", label: t("stat2") },
    { value: "4.8/5", label: t("stat3") },
    { value: "30+", label: t("stat4") },
  ];
  const partners = [
    { name: "mBank", slug: "mbank" },
    { name: "ING", slug: "ing" },
    { name: "Santander", slug: "santander" },
    { name: "PKO BP", slug: "pko-bp" },
    { name: "Revolut", slug: "revolut" },
    { name: "PZU", slug: "pzu" },
  ];

  return (
    <section className="border-y border-border bg-surface/50">
      <div className="container py-12 lg:py-16">
        <Reveal className="text-center">
          <p className="text-sm font-medium text-muted-foreground">{t("title")}</p>
        </Reveal>
        <RevealGroup className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {stats.map((s) => (
            <RevealItem key={s.label} className="text-center">
              <p className="text-display-sm font-semibold text-foreground">{s.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
            </RevealItem>
          ))}
        </RevealGroup>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          {partners.map((p) => (
            <div key={p.slug} className="flex items-center gap-2.5">
              <BrandMark name={p.name} logoUrl={brandLogos[p.slug]} size="sm" />
              <span className="text-sm font-semibold text-muted-foreground">{p.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------- Categories --------------------------- */

export async function CategoriesSection() {
  const t = await getTranslations("Home.categories");
  const cards = [
    { icon: Wallet, title: t("banksTitle"), text: t("banksText"), href: "/banks/personal-accounts", accent: "bg-accent/10 text-accent" },
    { icon: ShieldCheck, title: t("insuranceTitle"), text: t("insuranceText"), href: "/insurance", accent: "bg-success/10 text-success" },
    { icon: Briefcase, title: t("businessTitle"), text: t("businessText"), href: "/banks/business-accounts", accent: "bg-warning/15 text-amber-600" },
    { icon: BookOpen, title: t("guidesTitle"), text: t("guidesText"), href: "/guides", accent: "bg-primary/10 text-primary" },
  ];

  return (
    <section className="section">
      <div className="container">
        <SectionHeading title={t("title")} subtitle={t("subtitle")} />
        <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <RevealItem key={c.title}>
              <Link
                href={c.href}
                className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
              >
                <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${c.accent}`}>
                  <c.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-lg font-semibold">{c.title}</h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{c.text}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                  {t("explore")}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

/* --------------------------- How it works --------------------------- */

export async function HowItWorks() {
  const t = await getTranslations("Home.how");
  const steps = [
    { icon: Search, title: t("step1Title"), text: t("step1Text") },
    { icon: MousePointerClick, title: t("step2Title"), text: t("step2Text") },
    { icon: CheckCircle2, title: t("step3Title"), text: t("step3Text") },
  ];

  return (
    <section className="section bg-surface/50">
      <div className="container">
        <SectionHeading eyebrow="3 steps" title={t("title")} subtitle={t("subtitle")} />
        <div className="relative mt-14 grid gap-8 md:grid-cols-3">
          <div className="absolute left-0 right-0 top-7 hidden h-px bg-border md:block" aria-hidden />
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.1} className="relative text-center md:text-left">
              <div className="relative z-10 mb-5 flex justify-center md:justify-start">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-background text-accent shadow-soft">
                  <s.icon className="h-6 w-6" />
                </span>
              </div>
              <div className="flex items-center justify-center gap-2 md:justify-start">
                <Badge variant="muted">0{i + 1}</Badge>
                <h3 className="text-lg font-semibold">{s.title}</h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------- Compare preview --------------------------- */

export async function ComparePreview() {
  const t = await getTranslations("Home.comparePreview");
  const rows = [
    { label: "Monthly fee", a: "0 PLN", b: "5 PLN", c: "0 PLN" },
    { label: "Card fee", a: "0 PLN", b: "0 PLN", c: "4 PLN" },
    { label: "Cashback", a: "2%", b: "1%", c: "—" },
    { label: "Online opening", a: "Yes", b: "Yes", c: "No" },
  ];
  const tags = [
    { label: t("bestValue"), variant: "accent" as const },
    { label: t("lowestFees"), variant: "success" as const },
    { label: t("mostPopular"), variant: "warning" as const },
  ];

  return (
    <section className="section">
      <div className="container grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <span className="eyebrow mb-4">
            <Sparkles className="h-3.5 w-3.5 text-accent" /> Comparison tool
          </span>
          <h2 className="text-display-sm font-semibold sm:text-display-md">{t("title")}</h2>
          <p className="mt-4 text-lg text-muted-foreground">{t("subtitle")}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag.label} variant={tag.variant}>
                {tag.label}
              </Badge>
            ))}
          </div>
          <Button asChild size="lg" className="mt-8">
            <Link href="/compare">
              {t("cta")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
            <div className="grid grid-cols-[1.2fr_repeat(3,1fr)] border-b border-border bg-surface text-xs font-medium text-muted-foreground">
              <div className="p-3" />
              {["mBank", "ING", "PKO"].map((b, i) => (
                <div key={b} className="p-3 text-center">
                  <p className="font-semibold text-foreground">{b}</p>
                  {i === 0 && (
                    <Badge variant="accent" className="mt-1">
                      {t("bestValue")}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
            {rows.map((r, idx) => (
              <div
                key={r.label}
                className={`grid grid-cols-[1.2fr_repeat(3,1fr)] text-sm ${idx % 2 ? "bg-surface/40" : ""}`}
              >
                <div className="p-3 font-medium text-muted-foreground">{r.label}</div>
                <div className="p-3 text-center font-semibold text-accent">{r.a}</div>
                <div className="p-3 text-center">{r.b}</div>
                <div className="p-3 text-center">{r.c}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* --------------------------- Wizard CTA --------------------------- */

export async function WizardCta() {
  const t = await getTranslations("Home.wizardCta");
  return (
    <section className="section-tight">
      <div className="container">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-12 text-center text-primary-foreground sm:px-12 lg:py-16">
            <div className="pointer-events-none absolute -left-10 top-0 h-48 w-48 rounded-full bg-accent/30 blur-3xl" />
            <div className="pointer-events-none absolute -right-10 bottom-0 h-48 w-48 rounded-full bg-accent/20 blur-3xl" />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="text-display-sm font-semibold sm:text-display-md">{t("title")}</h2>
              <p className="mt-4 text-lg text-primary-foreground/80">{t("subtitle")}</p>
              <Button asChild size="xl" variant="accent" className="mt-8">
                <Link href="/recommend">
                  {t("cta")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
