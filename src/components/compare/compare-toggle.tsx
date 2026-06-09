"use client";

import { useTranslations } from "next-intl";
import { Check, GitCompareArrows } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCompare } from "@/components/providers/compare-provider";
import { cn } from "@/lib/utils";

export function CompareToggle({
  productId,
  className,
}: {
  productId: string;
  className?: string;
}) {
  const { has, toggle, isFull } = useCompare();
  const t = useTranslations("Listing");
  const active = has(productId);

  return (
    <Button
      type="button"
      variant={active ? "secondary" : "outline"}
      size="sm"
      onClick={() => toggle(productId)}
      disabled={!active && isFull}
      aria-pressed={active}
      className={cn("gap-1.5", className)}
    >
      {active ? (
        <>
          <Check className="h-4 w-4 text-success" /> {t("added")}
        </>
      ) : (
        <>
          <GitCompareArrows className="h-4 w-4" /> {t("compare")}
        </>
      )}
    </Button>
  );
}
