import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export default async function NotFound() {
  const t = await getTranslations("Common");
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="text-display-lg font-semibold text-accent">404</p>
      <h1 className="mt-4 text-display-sm font-semibold">{t("notFoundTitle")}</h1>
      <p className="mt-3 max-w-md text-muted-foreground">{t("notFoundText")}</p>
      <Button asChild className="mt-8" size="lg">
        <Link href="/">{t("backHome")}</Link>
      </Button>
    </div>
  );
}
