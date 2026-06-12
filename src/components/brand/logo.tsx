import NextLink from "next/link";
import { Link as IntlLink } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";

/**
 * BankPilots wordmark logo — no icon, just a styled type lockup.
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
      className={cn("group inline-flex items-end gap-[3px] leading-none", className)}
      aria-label={`${siteConfig.name} — home`}
    >
      <span className="font-sans text-xl font-bold tracking-tight text-foreground">
        Bank<span className="text-accent">Pilots</span>
      </span>
      {/* accent dot mark */}
      <span className="mb-[5px] h-[7px] w-[7px] rounded-full bg-accent transition-transform duration-200 group-hover:scale-125" />
    </LinkComp>
  );
}
