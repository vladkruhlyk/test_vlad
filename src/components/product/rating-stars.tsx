import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function RatingStars({
  value,
  size = "sm",
  showValue = false,
  className,
}: {
  value: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  className?: string;
}) {
  const sizes = { sm: "h-3.5 w-3.5", md: "h-4 w-4", lg: "h-5 w-5" } as const;
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));

  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span className="relative inline-flex" aria-hidden="true">
        <span className="flex text-border">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={cn(sizes[size], "fill-current")} />
          ))}
        </span>
        <span
          className="absolute inset-0 flex overflow-hidden text-warning"
          style={{ width: `${pct}%` }}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={cn(sizes[size], "shrink-0 fill-current")} />
          ))}
        </span>
      </span>
      {showValue && (
        <span className="text-sm font-semibold text-foreground">{value.toFixed(1)}</span>
      )}
      <span className="sr-only">{value.toFixed(1)} / 5</span>
    </span>
  );
}
