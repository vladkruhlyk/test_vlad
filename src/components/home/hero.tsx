"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowRight, ShieldCheck, Sparkles, TrendingUp, Star } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { RatingStars } from "@/components/product/rating-stars";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export function Hero() {
  const t = useTranslations("Home.hero");

  return (
    <section className="relative overflow-hidden">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-60 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_60%,transparent_100%)]" />
      <div className="pointer-events-none absolute -top-24 left-1/2 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />

      <div className="container relative grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
        {/* Copy */}
        <div className="max-w-xl">
          <motion.span
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="eyebrow"
          >
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            {t("badge")}
          </motion.span>

          <motion.h1
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mt-5 text-display-md font-semibold leading-[1.05] tracking-tight text-foreground sm:text-display-lg lg:text-display-xl"
          >
            {t("title")}
          </motion.h1>

          <motion.p
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mt-6 text-lg leading-relaxed text-muted-foreground"
          >
            {t("subtitle")}
          </motion.p>

          <motion.div
            custom={3}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <Button asChild size="xl">
              <Link href="/banks">
                {t("ctaBanks")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="xl" variant="outline">
              <Link href="/insurance">{t("ctaInsurance")}</Link>
            </Button>
          </motion.div>

          <motion.p
            custom={4}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mt-5 flex items-center gap-2 text-sm text-muted-foreground"
          >
            <ShieldCheck className="h-4 w-4 text-success" />
            {t("note")}
          </motion.p>
        </div>

        {/* Illustration — composed product cards */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-md lg:max-w-none"
        >
          <HeroIllustration />
        </motion.div>
      </div>
    </section>
  );
}

function HeroIllustration() {
  return (
    <div className="relative">
      {/* Colourful backdrop so the glass layers have something to refract */}
      <div className="pointer-events-none absolute -inset-10 -z-10">
        <div className="absolute left-1/4 top-0 h-48 w-48 rounded-full bg-accent/30 blur-3xl" />
        <div className="absolute bottom-4 right-6 h-44 w-44 rounded-full bg-success/25 blur-3xl" />
        <div className="absolute bottom-12 left-0 h-40 w-40 rounded-full bg-warning/20 blur-3xl" />
      </div>

      {/* Liquid-glass panel behind the product card */}
      <div className="absolute -right-4 -top-5 h-full w-full rotate-[3deg] rounded-[1.75rem] border border-white/60 bg-white/40 shadow-[0_8px_40px_-8px_rgba(15,23,42,0.25)] ring-1 ring-white/50 backdrop-blur-xl" />

      {/* Main card */}
      <div className="relative rounded-2xl border border-border bg-card/95 p-5 shadow-elevated backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-white p-1.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logos/mbank-real.png"
                alt="mBank logo"
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <p className="text-sm font-semibold">mBank eKonto</p>
              <p className="text-xs text-muted-foreground">Personal account</p>
            </div>
          </div>
          <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
            Editor&apos;s pick
          </span>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <RatingStars value={4.8} showValue />
          <span className="text-xs text-muted-foreground">1,240 reviews</span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {[
            { label: "Monthly fee", value: "Free" },
            { label: "Card fee", value: "Free" },
            { label: "Cashback", value: "Up to 2%" },
            { label: "Online opening", value: "Yes" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-surface p-3">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-sm font-semibold">{s.value}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 h-10 rounded-lg bg-accent text-center text-sm font-medium leading-10 text-accent-foreground">
          Apply now
        </div>
      </div>

      {/* Floating mini cards */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-5 -top-9 hidden rounded-xl border border-white/60 bg-white/60 p-3 shadow-card ring-1 ring-white/40 backdrop-blur-xl sm:block"
      >
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/15 text-success">
            <TrendingUp className="h-4 w-4" />
          </span>
          <div>
            <p className="text-xs text-muted-foreground">Top rated</p>
            <p className="text-sm font-semibold">0 PLN / mo</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute -bottom-5 -right-4 hidden rounded-xl border border-white/60 bg-white/60 p-3 shadow-card ring-1 ring-white/40 backdrop-blur-xl sm:block"
      >
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-warning/15 text-amber-600">
            <Star className="h-4 w-4 fill-current" />
          </span>
          <div>
            <p className="text-xs text-muted-foreground">Average rating</p>
            <p className="text-sm font-semibold">4.8 / 5</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
