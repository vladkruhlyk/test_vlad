import NextLink from "next/link";
import { Link as IntlLink } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";

/**
 * FinPort wordmark with an inline SVG mark — no external asset needed.
 * `localized` (default) uses the locale-aware router; set it false in contexts
 * without a NextIntl provider (e.g. the admin panel).
 */
export function Logo({
  className,
  href = "/",
  localized = true,
}: {
  className?: string;
  href?: string;
  localized?: boolean;
}) {
  const LinkComp = (localized ? IntlLink : NextLink) as typeof NextLink;
  return (
    <LinkComp
      href={href}
      className={cn(
        "group inline-flex items-center gap-2.5 font-semibold tracking-tight text-foreground",
        className,
      )}
      aria-label={`${siteConfig.name} — home`}
    >
      <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-soft transition-transform duration-200 group-hover:scale-105">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M4 19V8.5L12 4l8 4.5V19"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 19v-5h6v5"
            stroke="hsl(var(--accent))"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="text-lg">{siteConfig.name}</span>
    </LinkComp>
  );
}
