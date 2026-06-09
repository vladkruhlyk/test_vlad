"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Menu } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Logo } from "@/components/brand/logo";
import { LanguageSwitcher } from "./language-switcher";
import { banksMenu, insuranceMenu, mainNav } from "@/lib/site";

export function MobileNav() {
  const t = useTranslations("Nav");
  const tBanks = useTranslations("BanksMenu");
  const tIns = useTranslations("InsuranceMenu");
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="lg:hidden"
          aria-label={t("openMenu")}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex w-full flex-col p-0 sm:max-w-sm">
        <SheetHeader className="border-b border-border">
          <SheetTitle asChild>
            <div className="flex items-center">
              <Logo />
            </div>
          </SheetTitle>
        </SheetHeader>

        <nav className="flex-1 overflow-y-auto px-4 py-2">
          <Accordion type="multiple" className="w-full">
            <AccordionItem value="banks">
              <AccordionTrigger>{t("banks")}</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-1">
                  {banksMenu.map((item) => (
                    <li key={item.key}>
                      <SheetClose asChild>
                        <Link
                          href={item.href}
                          className="block rounded-lg px-3 py-2 text-sm text-foreground hover:bg-surface"
                        >
                          {tBanks(item.key)}
                        </Link>
                      </SheetClose>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="insurance">
              <AccordionTrigger>{t("insurance")}</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-1">
                  {insuranceMenu.map((item) => (
                    <li key={item.key}>
                      <SheetClose asChild>
                        <Link
                          href={item.href}
                          className="block rounded-lg px-3 py-2 text-sm text-foreground hover:bg-surface"
                        >
                          {tIns(item.key)}
                        </Link>
                      </SheetClose>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <ul className="mt-2 space-y-1 border-t border-border pt-2">
            {mainNav.map((item) => (
              <li key={item.key}>
                <SheetClose asChild>
                  <Link
                    href={item.href}
                    className="block rounded-lg px-3 py-3 text-base font-medium text-foreground hover:bg-surface"
                  >
                    {t(item.key)}
                  </Link>
                </SheetClose>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-3 border-t border-border p-4">
          <SheetClose asChild>
            <Button asChild className="w-full" size="lg">
              <Link href="/compare">{t("cta")}</Link>
            </Button>
          </SheetClose>
          <LanguageSwitcher />
        </div>
      </SheetContent>
    </Sheet>
  );
}
