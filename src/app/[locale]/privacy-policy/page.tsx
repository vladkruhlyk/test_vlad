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
  return buildMetadata({ locale, title: t("privacyTitle"), path: "/privacy-policy" });
}

export default async function PrivacyPage({
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
      <PageHeader title={t("privacyTitle")} crumbs={[{ name: tf("privacy"), href: "/privacy-policy" }]} />
      <div className="container py-12 lg:py-16">
        <Prose>
          <p>
            This Privacy Policy explains how {siteConfig.legalName} (&quot;{siteConfig.name}&quot;,
            &quot;we&quot;) collects, uses and protects your personal data when you use our website.
            This is a template and should be reviewed by a qualified lawyer before production use.
          </p>
          <h2>1. Data we collect</h2>
          <p>
            We collect data you provide directly (such as your email when you subscribe to our
            newsletter or submit the contact form) and data collected automatically (such as
            anonymised analytics about how you use the site).
          </p>
          <h2>2. How we use your data</h2>
          <ul>
            <li>To provide and improve our comparison service</li>
            <li>To send you the newsletter you subscribed to</li>
            <li>To respond to your enquiries</li>
            <li>To measure the performance of affiliate links</li>
          </ul>
          <h2>3. Affiliate links</h2>
          <p>
            When you click an &quot;Apply&quot; button we may record an anonymised click event for
            commission attribution. We do not sell your personal data to partners.
          </p>
          <h2>4. Your rights</h2>
          <p>
            Under the GDPR you have the right to access, rectify, erase and port your data, and to
            object to processing. To exercise these rights, contact us at {siteConfig.contact.email}.
          </p>
          <h2>5. Contact</h2>
          <p>For any privacy questions, email {siteConfig.contact.email}.</p>
        </Prose>
      </div>
    </>
  );
}
