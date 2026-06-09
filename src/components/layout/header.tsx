"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import {
  Wallet,
  Briefcase,
  CreditCard,
  Globe,
  Laptop,
  Crown,
  GraduationCap,
  ArrowRight,
  Car,
  Home,
  HeartPulse,
  ShieldCheck,
  Plane,
  Building2,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { LanguageSwitcher } from "./language-switcher";
import { MobileNav } from "./mobile-nav";
import { banksMenu, insuranceMenu, mainNav } from "@/lib/site";
import { cn } from "@/lib/utils";

const icons: Record<string, LucideIcon> = {
  personalAccounts: Wallet,
  businessAccounts: Briefcase,
  cashbackCards: CreditCard,
  foreignersAccounts: Globe,
  onlineOpening: Laptop,
  premiumBanking: Crown,
  studentAccounts: GraduationCap,
  carInsurance: Car,
  homeInsurance: Home,
  healthInsurance: HeartPulse,
  lifeInsurance: ShieldCheck,
  travelInsurance: Plane,
  businessInsurance: Building2,
};

function useScrolled() {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return scrolled;
}

function MegaMenu({
  items,
  ns,
}: {
  items: readonly { key: string; href: string; featured?: boolean }[];
  ns: "BanksMenu" | "InsuranceMenu";
}) {
  const t = useTranslations(ns);
  const regular = items.filter((i) => !i.featured);
  const featured = items.find((i) => i.featured);

  return (
    <div className="grid w-[680px] grid-cols-[1fr_240px] gap-6 p-6">
      <div>
        <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t("heading")}
        </p>
        <ul className="grid grid-cols-2 gap-1">
          {regular.map((item) => {
            const Icon = icons[item.key] ?? Sparkles;
            return (
              <li key={item.key}>
                <NavigationMenuLink asChild>
                  <Link
                    href={item.href}
                    className="group flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-surface"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface text-accent transition-colors group-hover:bg-accent/10">
                      <Icon className="h-4.5 w-4.5" />
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {t(item.key)}
                    </span>
                  </Link>
                </NavigationMenuLink>
              </li>
            );
          })}
        </ul>
      </div>
      {featured && (
        <NavigationMenuLink asChild>
          <Link
            href={featured.href}
            className="group relative flex flex-col justify-between overflow-hidden rounded-xl bg-primary p-5 text-primary-foreground"
          >
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-accent/30 blur-2xl" />
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-primary-foreground/70">
                {t("subheading")}
              </p>
              <p className="mt-2 text-base font-semibold">{t("compareAll")}</p>
            </div>
            <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent-foreground/90">
              {t("compareAll")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        </NavigationMenuLink>
      )}
    </div>
  );
}

export function Header() {
  const t = useTranslations("Nav");
  const scrolled = useScrolled();

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300",
        scrolled
          ? "border-border bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70"
          : "border-transparent bg-background",
      )}
    >
      <div className="container flex h-16 items-center justify-between gap-4 lg:h-[72px]">
        <div className="flex items-center gap-1">
          <Logo />
        </div>

        {/* Desktop nav */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-center">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>{t("banks")}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <MegaMenu items={banksMenu} ns="BanksMenu" />
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>{t("insurance")}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <MegaMenu items={insuranceMenu} ns="InsuranceMenu" />
                </NavigationMenuContent>
              </NavigationMenuItem>
              {mainNav.map((item) => (
                <NavigationMenuItem key={item.key}>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                    <Link href={item.href}>{t(item.key)}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>
          <Button asChild variant="default" className="hidden sm:inline-flex">
            <Link href="/compare">{t("cta")}</Link>
          </Button>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
