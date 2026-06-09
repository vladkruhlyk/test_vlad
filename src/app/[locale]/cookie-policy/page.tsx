import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/page-header";
import { Prose } from "@/components/prose";
import { buildMetadata } from "@/lib/seo";
import { siteConfig, type Locale } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Pages" });
  return buildMetadata({ locale, title: t("cookieTitle"), path: "/cookie-policy" });
}

export default async function CookiePolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Pages");
  const tf = await getTranslations("Footer");

  return (
    <>
      <PageHeader title={t("cookieTitle")} crumbs={[{ name: tf("cookiePolicy"), href: "/cookie-policy" }]} />
      <div className="container py-12 lg:py-16">
        <Prose>
          <p>
            This Cookie Policy explains how {siteConfig.name} uses cookies and similar
            technologies. This is a template and should be reviewed by a qualified lawyer before
            production use.
          </p>
          <h2>What are cookies?</h2>
          <p>
            Cookies are small text files stored on your device that help a website function and
            remember your preferences.
          </p>
          <h2>How we use cookies</h2>
          <ul>
            <li>
              <strong>Essential cookies</strong> — required for the site to work (e.g. remembering
              your cookie choices and language). These are always on.
            </li>
            <li>
              <strong>Analytics cookies</strong> — help us understand how the site is used so we can
              improve it. Set only with your consent.
            </li>
            <li>
              <strong>Affiliate / attribution cookies</strong> — used to attribute an application to
              a referral so partners can pay the correct commission. Set only with your consent.
            </li>
          </ul>
          <h2>Managing cookies</h2>
          <p>
            You can accept or decline non-essential cookies using the consent banner shown on your
            first visit, and you can change your browser settings at any time to block or delete
            cookies. Declining non-essential cookies will not stop you from using the site.
          </p>
          <h2>Contact</h2>
          <p>For questions about this policy, email {siteConfig.contact.email}.</p>
        </Prose>
      </div>
    </>
  );
}
