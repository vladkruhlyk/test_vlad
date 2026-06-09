import { siteConfig } from "@/lib/site";

/** Renders a JSON-LD <script> block. Use one per structured-data graph. */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // Structured data is trusted, server-generated content.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: siteConfig.url,
    logo: `${siteConfig.url}/icon.svg`,
    sameAs: [siteConfig.social.linkedin, `https://twitter.com/${siteConfig.social.twitter.replace("@", "")}`],
    contactPoint: {
      "@type": "ContactPoint",
      email: siteConfig.contact.email,
      contactType: "customer support",
      areaServed: "PL",
      availableLanguage: ["Polish", "English", "Ukrainian"],
    },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/banks?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${siteConfig.url}${item.url}`,
    })),
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

interface ProductSchemaArgs {
  name: string;
  description?: string;
  image?: string;
  brand?: string;
  url: string;
  rating?: { value: number; count: number } | null;
}

export function productSchema({ name, description, image, brand, url, rating }: ProductSchemaArgs) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image: image ? (image.startsWith("http") ? image : `${siteConfig.url}${image}`) : undefined,
    brand: brand ? { "@type": "Brand", name: brand } : undefined,
    url: url.startsWith("http") ? url : `${siteConfig.url}${url}`,
    ...(rating && rating.count > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: rating.value.toFixed(1),
            reviewCount: rating.count,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
  };
}

interface ArticleSchemaArgs {
  title: string;
  description?: string;
  image?: string;
  url: string;
  authorName?: string;
  datePublished: string;
}

export function articleSchema({ title, description, image, url, authorName, datePublished }: ArticleSchemaArgs) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image: image ? (image.startsWith("http") ? image : `${siteConfig.url}${image}`) : undefined,
    author: { "@type": "Person", name: authorName ?? siteConfig.name },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: { "@type": "ImageObject", url: `${siteConfig.url}/icon.svg` },
    },
    datePublished,
    mainEntityOfPage: url.startsWith("http") ? url : `${siteConfig.url}${url}`,
  };
}
