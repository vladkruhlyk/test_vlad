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
  return buildMetadata({ locale, title: t("disclosureTitle"), path: "/affiliate-disclosure" });
}

export default async function AffiliateDisclosurePage({
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
      <PageHeader
        title={t("disclosureTitle")}
        crumbs={[{ name: tf("affiliateDisclosure"), href: "/affiliate-disclosure" }]}
      />
      <div className="container py-12 lg:py-16">
        <Prose>
          <p>
            {siteConfig.name} is supported by affiliate (CPA) partnerships. We want to be completely
            transparent about how this works.
          </p>
          <h2>How we make money</h2>
          <p>
            When you click an &quot;Apply&quot; button and sign up for a product, the provider may
            pay us a commission. This comes at no extra cost to you — the price you pay is the same
            whether you go through {siteConfig.name} or directly to the provider.
          </p>
          <h2>How this affects our rankings</h2>
          <p>
            It doesn&apos;t. Our editorial team scores products on fees, usability, support and
            benefits, combined with user popularity. Commercial relationships never influence how we
            rank or describe a product. When a product is genuinely the best fit, we say so —
            regardless of commission.
          </p>
          <h2>Where you&apos;ll see disclosures</h2>
          <ul>
            <li>On every product page that contains affiliate links</li>
            <li>In the footer of every page</li>
            <li>On this dedicated disclosure page</li>
          </ul>
          <h2>Questions?</h2>
          <p>
            If you have any questions about our affiliate relationships, email us at{" "}
            {siteConfig.contact.email}.
          </p>
        </Prose>
      </div>
    </>
  );
}
