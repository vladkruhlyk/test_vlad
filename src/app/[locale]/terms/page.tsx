import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
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
  return buildMetadata({ locale, title: t("termsTitle"), path: "/terms" });
}

export default async function TermsPage({
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
      <PageHeader title={t("termsTitle")} crumbs={[{ name: tf("terms"), href: "/terms" }]} />
      <div className="container py-12 lg:py-16">
        <Prose>
          <p>
            These Terms of Service govern your use of {siteConfig.name}. By using the website you
            agree to these terms. This is a template and should be reviewed by a qualified lawyer
            before production use.
          </p>
          <h2>1. Our service</h2>
          <p>
            {siteConfig.name} is an independent comparison platform for financial products in
            Poland. We provide information to help you make decisions; we are not a bank, insurer or
            financial adviser.
          </p>
          <h2>2. No financial advice</h2>
          <p>
            The information on this site is for general guidance only and does not constitute
            financial advice. Always read the provider&apos;s terms before applying for any product.
          </p>
          <h2>3. Accuracy of information</h2>
          <p>
            We work hard to keep information accurate and up to date, but product terms change. The
            provider&apos;s website is always the authoritative source.
          </p>
          <h2>4. Affiliate relationships</h2>
          <p>
            We may earn a commission when you apply through our links. See our{" "}
            <Link href="/affiliate-disclosure">Affiliate Disclosure</Link> for details.
          </p>
          <h2>5. Limitation of liability</h2>
          <p>
            To the maximum extent permitted by law, we are not liable for decisions made based on
            information found on this site.
          </p>
        </Prose>
      </div>
    </>
  );
}
