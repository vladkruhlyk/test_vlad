"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { SlidersHorizontal, X, Star } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export interface BrandOption {
  slug: string;
  name: string;
}

const MAX_FEE = 50;

// All boolean filter param keys (used for the active-count + clear logic).
const BOOL_KEYS = [
  "freeMaintenance", "freeCard", "bonus",
  "onlineOpening", "blik", "applePay", "googlePay", "cashback",
  "foreigners", "noPesel", "business", "eur",
] as const;

const GROUPS = {
  fees: ["freeMaintenance", "freeCard", "bonus"],
  features: ["onlineOpening", "blik", "applePay", "googlePay", "cashback"],
  eligibility: ["foreigners", "noPesel", "business", "eur"],
} as const;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-border pt-5 first:border-t-0 first:pt-0">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </p>
      {children}
    </div>
  );
}

function FilterControls({ brands }: { brands: BrandOption[] }) {
  const t = useTranslations("Listing");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentFee = searchParams.get("maxFee");
  const [fee, setFee] = React.useState<number>(currentFee ? Number(currentFee) : MAX_FEE);
  React.useEffect(() => {
    setFee(currentFee ? Number(currentFee) : MAX_FEE);
  }, [currentFee]);

  const update = React.useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(Array.from(searchParams.entries()));
      mutate(params);
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  const toggleBool = (key: string, value: boolean) =>
    update((p) => (value ? p.set(key, "1") : p.delete(key)));

  const commitFee = (v: number) =>
    update((p) => (v >= MAX_FEE ? p.delete("maxFee") : p.set("maxFee", String(v))));

  const setRating = (v: string | null) =>
    update((p) => (v ? p.set("rating", v) : p.delete("rating")));

  const toggleBrand = (slug: string) =>
    update((p) => {
      const set = new Set((p.get("brand") ?? "").split(",").filter(Boolean));
      if (set.has(slug)) set.delete(slug);
      else set.add(slug);
      if (set.size) p.set("brand", [...set].join(","));
      else p.delete("brand");
    });

  const activeBrands = new Set((searchParams.get("brand") ?? "").split(",").filter(Boolean));
  const activeRating = searchParams.get("rating");

  const activeCount =
    BOOL_KEYS.filter((k) => searchParams.get(k)).length +
    (searchParams.get("maxFee") ? 1 : 0) +
    (activeRating ? 1 : 0) +
    activeBrands.size;

  const ToggleRow = ({ keyName }: { keyName: string }) => (
    <div className="flex items-center justify-between py-2">
      <Label htmlFor={`f-${keyName}`} className="cursor-pointer text-sm font-normal">
        {t(keyName === "foreigners" ? "foreigners" : keyName === "noPesel" ? "noPesel" : keyName)}
      </Label>
      <Switch
        id={`f-${keyName}`}
        checked={!!searchParams.get(keyName)}
        onCheckedChange={(v) => toggleBool(keyName, v)}
      />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <SlidersHorizontal className="h-4 w-4" />
          {t("filters")}
          {activeCount > 0 && (
            <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-medium text-accent">
              {activeCount}
            </span>
          )}
        </h3>
        {activeCount > 0 && (
          <button
            onClick={() => router.push(pathname, { scroll: false })}
            className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
            {t("clearAll")}
          </button>
        )}
      </div>

      {/* Fees & pricing */}
      <Section title={t("groupFees")}>
        <div className="mb-2 flex items-center justify-between">
          <Label className="text-sm text-muted-foreground">{t("monthlyFee")}</Label>
          <span className="text-sm font-medium">
            {fee >= MAX_FEE ? `${MAX_FEE}+ PLN` : `≤ ${fee} PLN`}
          </span>
        </div>
        <Slider
          value={[fee]}
          min={0}
          max={MAX_FEE}
          step={5}
          onValueChange={(v) => setFee(v[0] ?? MAX_FEE)}
          onValueCommit={(v) => commitFee(v[0] ?? MAX_FEE)}
          className="mb-2"
        />
        {GROUPS.fees.map((k) => (
          <ToggleRow key={k} keyName={k} />
        ))}
      </Section>

      {/* Rating */}
      <Section title={t("groupRating")}>
        <div className="flex gap-2">
          {[
            { v: null, label: t("anyRating") },
            { v: "4", label: "4.0+" },
            { v: "4.5", label: "4.5+" },
          ].map((opt) => {
            const active = (activeRating ?? null) === opt.v || (opt.v === null && !activeRating);
            return (
              <button
                key={opt.label}
                onClick={() => setRating(opt.v)}
                className={cn(
                  "inline-flex flex-1 items-center justify-center gap-1 rounded-lg border px-2.5 py-2 text-sm font-medium transition-colors",
                  active
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border hover:bg-surface",
                )}
              >
                {opt.v && <Star className="h-3.5 w-3.5 fill-current" />}
                {opt.label}
              </button>
            );
          })}
        </div>
      </Section>

      {/* Features & payments */}
      <Section title={t("groupFeatures")}>
        {GROUPS.features.map((k) => (
          <ToggleRow key={k} keyName={k} />
        ))}
      </Section>

      {/* Eligibility */}
      <Section title={t("groupEligibility")}>
        {GROUPS.eligibility.map((k) => (
          <ToggleRow key={k} keyName={k} />
        ))}
      </Section>

      {/* Provider */}
      {brands.length > 0 && (
        <Section title={t("groupBrands")}>
          <div className="space-y-1">
            {brands.map((b) => {
              const checked = activeBrands.has(b.slug);
              return (
                <label
                  key={b.slug}
                  className="flex cursor-pointer items-center gap-2.5 rounded-lg px-1 py-1.5 text-sm hover:bg-surface"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleBrand(b.slug)}
                    className="h-4 w-4 rounded border-border accent-[hsl(var(--accent))]"
                  />
                  {b.name}
                </label>
              );
            })}
          </div>
        </Section>
      )}
    </div>
  );
}

/** Desktop sticky sidebar + mobile sheet trigger. */
export function FilterSidebar({ brands = [] }: { brands?: BrandOption[] }) {
  const t = useTranslations("Listing");
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <aside className="hidden lg:block">
        <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl border border-border bg-card p-5 shadow-soft">
          <FilterControls brands={brands} />
        </div>
      </aside>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="lg:hidden">
            <SlidersHorizontal className="h-4 w-4" />
            {t("filters")}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[90%] overflow-y-auto sm:max-w-sm">
          <SheetHeader>
            <SheetTitle>{t("filters")}</SheetTitle>
          </SheetHeader>
          <div className="px-6 pb-10">
            <FilterControls brands={brands} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
