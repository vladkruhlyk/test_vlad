import { cn } from "@/lib/utils";

const sizeMap = {
  sm: "h-11 w-11 p-1.5",
  md: "h-14 w-14 p-2",
  lg: "h-16 w-16 p-2.5",
} as const;

/**
 * Renders a product/brand logo inside a white rounded tile (logos are bundled
 * first-party SVGs in /public/logos). Falls back to a brand-initials badge when
 * no logo is available.
 */
export function BrandMark({
  name,
  logoUrl,
  size = "sm",
  className,
}: {
  name: string;
  logoUrl?: string | null;
  size?: keyof typeof sizeMap;
  className?: string;
}) {
  const base = cn(
    "flex shrink-0 items-center justify-center rounded-xl border border-border bg-white",
    sizeMap[size],
    className,
  );

  if (logoUrl) {
    return (
      <span className={base}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoUrl}
          alt={`${name} logo`}
          loading="lazy"
          className="h-full w-full object-contain"
        />
      </span>
    );
  }

  return (
    <span className={cn(base, "text-sm font-semibold text-muted-foreground")}>
      {name.slice(0, 2)}
    </span>
  );
}
