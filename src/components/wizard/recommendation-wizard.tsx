"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowLeft, Check, Loader2, RotateCcw, Trophy } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RatingStars } from "@/components/product/rating-stars";
import { ApplyButton } from "@/components/affiliate/apply-button";
import { wizardQuestions, type RecommendedProduct, type WizardAnswers } from "@/lib/recommend";

type Step = number; // 0..questions.length-1
type Phase = "questions" | "loading" | "results";

export function RecommendationWizard() {
  const t = useTranslations("Wizard");
  const [step, setStep] = React.useState<Step>(0);
  const [answers, setAnswers] = React.useState<Partial<WizardAnswers>>({});
  const [phase, setPhase] = React.useState<Phase>("questions");
  const [results, setResults] = React.useState<RecommendedProduct[]>([]);

  const total = wizardQuestions.length;
  const current = wizardQuestions[step]!;
  const progress = Math.round(((step + (phase === "results" ? 1 : 0)) / total) * 100);

  async function submit(finalAnswers: WizardAnswers) {
    setPhase("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: finalAnswers }),
      });
      const data = await res.json();
      setResults(data.recommendations ?? []);
    } catch {
      setResults([]);
    }
    setPhase("results");
  }

  function answer(value: boolean) {
    const next = { ...answers, [current.id]: value };
    setAnswers(next);
    if (step < total - 1) {
      setStep(step + 1);
    } else {
      submit(next as WizardAnswers);
    }
  }

  function restart() {
    setStep(0);
    setAnswers({});
    setResults([]);
    setPhase("questions");
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {phase === "results" ? t("resultTitle") : t("step", { current: step + 1, total })}
          </span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-secondary">
          <motion.div
            className="h-full rounded-full bg-accent"
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 200, damping: 30 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {phase === "questions" && (
          <motion.div
            key={`q-${step}`}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl border border-border bg-card p-8 shadow-card"
          >
            <h2 className="text-center text-xl font-semibold sm:text-2xl">{t(current.key)}</h2>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <Button size="xl" variant="outline" onClick={() => answer(false)}>
                {t("no")}
              </Button>
              <Button size="xl" onClick={() => answer(true)}>
                {t("yes")}
              </Button>
            </div>
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="mx-auto mt-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" /> {t("back")}
              </button>
            )}
          </motion.div>
        )}

        {phase === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-16 shadow-card"
          >
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
            <p className="mt-4 text-muted-foreground">{t("finish")}…</p>
          </motion.div>
        )}

        {phase === "results" && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="mb-6 text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-success/10 text-success">
                <Check className="h-6 w-6" />
              </span>
              <h2 className="mt-4 text-2xl font-semibold">{t("resultTitle")}</h2>
              <p className="mt-2 text-muted-foreground">
                {results.length ? t("resultSubtitle") : t("noMatch")}
              </p>
            </div>

            <ol className="space-y-4">
              {results.map((r, i) => (
                <li
                  key={r.id}
                  className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft sm:flex-row sm:items-center"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/products/${r.slug}`}
                        className="font-semibold hover:text-accent"
                      >
                        {r.name}
                      </Link>
                      {i === 0 && (
                        <Badge variant="accent">
                          <Trophy className="h-3 w-3" /> Top match
                        </Badge>
                      )}
                    </div>
                    {r.tagline && (
                      <p className="line-clamp-1 text-sm text-muted-foreground">{r.tagline}</p>
                    )}
                    {r.rating && (
                      <div className="mt-1">
                        <RatingStars value={r.rating} showValue />
                      </div>
                    )}
                  </div>
                  <ApplyButton
                    linkId={r.affiliateLinkId ?? undefined}
                    url={r.affiliateUrl ?? undefined}
                    productSlug={r.slug}
                    label="Apply"
                    size="sm"
                    className="shrink-0"
                  />
                </li>
              ))}
            </ol>

            <div className="mt-8 text-center">
              <Button variant="outline" onClick={restart}>
                <RotateCcw className="h-4 w-4" /> {t("restart")}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
