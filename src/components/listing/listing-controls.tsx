"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SORTS = ["popular", "rating", "feeAsc", "feeDesc"] as const;
const SORT_LABEL: Record<string, string> = {
  popular: "sortPopular",
  rating: "sortRating",
  feeAsc: "sortFeeAsc",
  feeDesc: "sortFeeDesc",
};

export function ListingControls() {
  const t = useTranslations("Listing");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [q, setQ] = React.useState(searchParams.get("q") ?? "");

  const setParam = React.useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(Array.from(searchParams.entries()));
      if (value) params.set(key, value);
      else params.delete(key);
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  // Debounced search.
  React.useEffect(() => {
    const current = searchParams.get("q") ?? "";
    if (q === current) return;
    const id = setTimeout(() => setParam("q", q || null), 350);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const sort = searchParams.get("sort") ?? "popular";

  return (
    <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("search")}
          className="pl-9"
          aria-label={t("search")}
        />
      </div>
      <Select value={sort} onValueChange={(v) => setParam("sort", v === "popular" ? null : v)}>
        <SelectTrigger className="w-full sm:w-52">
          <span className="text-muted-foreground">{t("sortBy")}:</span>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SORTS.map((s) => (
            <SelectItem key={s} value={s}>
              {t(SORT_LABEL[s]!)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
