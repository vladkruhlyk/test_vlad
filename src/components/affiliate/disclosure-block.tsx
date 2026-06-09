import { Info } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function DisclosureBlock({ ns = "Product" }: { ns?: "Product" }) {
  const t = await getTranslations(ns);
  return (
    <div className="flex gap-3 rounded-xl border border-border bg-surface/60 p-4 text-xs leading-relaxed text-muted-foreground">
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <p>{t("disclosure")}</p>
    </div>
  );
}
