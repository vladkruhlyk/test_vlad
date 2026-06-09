"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { GitCompareArrows, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { useCompare } from "@/components/providers/compare-provider";

export function CompareBar() {
  const { ids, clear, max } = useCompare();
  const t = useTranslations("Compare");

  return (
    <AnimatePresence>
      {ids.length > 0 && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
          className="fixed inset-x-0 bottom-4 z-40 mx-auto w-[calc(100%-2rem)] max-w-2xl"
        >
          <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-background/95 p-3 pl-5 shadow-elevated backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <GitCompareArrows className="h-4.5 w-4.5" />
              </span>
              <p className="text-sm font-medium">
                {ids.length}/{max} {t("title").toLowerCase()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={clear} aria-label={t("remove")}>
                <X className="h-4 w-4" />
              </Button>
              <Button asChild size="sm" disabled={ids.length < 2}>
                <Link href={`/compare?ids=${ids.join(",")}`}>{t("title")}</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
