import { Check, X } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function ProsCons({ pros, cons }: { pros: string[]; cons: string[] }) {
  const t = await getTranslations("Product");
  if (!pros.length && !cons.length) return null;

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <div className="rounded-2xl border border-success/20 bg-success/[0.04] p-6">
        <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-success/15 text-success">
            <Check className="h-4 w-4" />
          </span>
          {t("pros")}
        </h3>
        <ul className="mt-4 space-y-3">
          {pros.map((p) => (
            <li key={p} className="flex items-start gap-2.5 text-sm">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-2xl border border-danger/20 bg-danger/[0.03] p-6">
        <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-danger/15 text-danger">
            <X className="h-4 w-4" />
          </span>
          {t("cons")}
        </h3>
        <ul className="mt-4 space-y-3">
          {cons.map((c) => (
            <li key={c} className="flex items-start gap-2.5 text-sm">
              <X className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
