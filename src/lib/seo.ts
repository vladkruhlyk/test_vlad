import type { Metadata } from "next";
import { siteConfig, type Locale } from "./site";

interface BuildMetadataArgs {
  title?: string;
  description?: string;
  path?: string;
  locale?: Locale;
  image?: string;
  type?: "website" | "article";
  noIndex?: boolean;
  publishedTime?: string;
  authors?: string[];
}

const localeOg: Record<Locale, string> = {
  pl: "pl_PL",
  en: "en_GB",
  uk: "uk_UA",
};

/**
 * Central metadata factory. Produces title, description, canonical, hreflang
 * alternates, Open Graph and Twitter cards for any page.
 */
export function buildMetadata({
  title,
  description = siteConfig.description,
  path = "",
  locale = "pl",
  image,
  type = "website",
  noIndex = false,
  publishedTime,
  authors,
}: BuildMetadataArgs = {}): Metadata {
  const fullTitle = title ? `${title} · ${siteConfig.name}` : `${siteConfig.name} — ${siteConfig.description}`;
  const url = `${siteConfig.url}${localePath(locale, path)}`;
  // When no explicit image is given, fall back to the file-based
  // opengraph-image convention (handled automatically by Next).
  const ogImage = image ? (image.startsWith("http") ? image : `${siteConfig.url}${image}`) : undefined;

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: url,
      languages: {
        pl: `${siteConfig.url}${path}`,
        en: `${siteConfig.url}/en${path}`,
        uk: `${siteConfig.url}/uk${path}`,
        "x-default": `${siteConfig.url}${path}`,
      },
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, "max-image-preview": "large" },
    openGraph: {
      type,
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.name,
      locale: localeOg[locale],
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630, alt: fullTitle }] } : {}),
      ...(publishedTime ? { publishedTime } : {}),
      ...(authors ? { authors } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
      site: siteConfig.social.twitter,
    },
  };
}

function localePath(locale: Locale, path: string): string {
  return locale === siteConfig.defaultLocale ? path : `/${locale}${path}`;
}
