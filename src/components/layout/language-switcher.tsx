"use client";

import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useTransition } from "react";
import { Globe, Check } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const localeNames: Record<string, string> = {
  pl: "Polski",
  en: "English",
  uk: "Українська",
};

const localeFlags: Record<string, string> = {
  pl: "🇵🇱",
  en: "🇬🇧",
  uk: "🇺🇦",
};

export function LanguageSwitcher() {
  const t = useTranslations("Nav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isPending, startTransition] = useTransition();

  function onSelect(next: string) {
    startTransition(() => {
      // @ts-expect-error -- params are passed through verbatim for dynamic routes
      router.replace({ pathname, params }, { locale: next });
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          isPending && "opacity-60",
        )}
        aria-label={t("selectLanguage")}
      >
        <Globe className="h-4 w-4 text-muted-foreground" />
        <span className="hidden sm:inline uppercase">{locale}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[12rem]">
        {routing.locales.map((l) => (
          <DropdownMenuItem
            key={l}
            onClick={() => onSelect(l)}
            className="justify-between"
          >
            <span className="flex items-center gap-2">
              <span aria-hidden>{localeFlags[l]}</span>
              {localeNames[l]}
            </span>
            {l === locale && <Check className="h-4 w-4 text-accent" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
