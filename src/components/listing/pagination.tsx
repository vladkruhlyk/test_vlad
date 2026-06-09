"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Pagination({ page, totalPages }: { page: number; totalPages: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  function go(p: number) {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (p <= 1) params.delete("page");
    else params.set("page", String(p));
    router.push(`${pathname}?${params.toString()}`, { scroll: true });
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
  );

  return (
    <nav className="mt-10 flex items-center justify-center gap-1.5" aria-label="Pagination">
      <Button variant="outline" size="icon" disabled={page <= 1} onClick={() => go(page - 1)}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      {pages.map((p, i) => {
        const prev = pages[i - 1];
        const gap = prev && p - prev > 1;
        return (
          <span key={p} className="flex items-center gap-1.5">
            {gap && <span className="px-1 text-muted-foreground">…</span>}
            <button
              onClick={() => go(p)}
              aria-current={p === page ? "page" : undefined}
              className={cn(
                "inline-flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-colors",
                p === page
                  ? "bg-primary text-primary-foreground"
                  : "border border-border hover:bg-surface",
              )}
            >
              {p}
            </button>
          </span>
        );
      })}
      <Button
        variant="outline"
        size="icon"
        disabled={page >= totalPages}
        onClick={() => go(page + 1)}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
}
