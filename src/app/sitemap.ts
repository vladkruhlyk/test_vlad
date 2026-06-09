import type { MetadataRoute } from "next";
import { products, categories } from "@/data/catalog";
import { posts } from "@/data/blog";
import { siteConfig } from "@/lib/site";

const LOCALES = siteConfig.locales;
const DEFAULT = siteConfig.defaultLocale;

function localized(path: string): MetadataRoute.Sitemap[number]["alternates"] {
  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    languages[l] = l === DEFAULT ? `${siteConfig.url}${path}` : `${siteConfig.url}/${l}${path}`;
  }
  return { languages };
}

function entry(path: string, priority = 0.7): MetadataRoute.Sitemap[number] {
  return {
    url: `${siteConfig.url}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority,
    alternates: localized(path),
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    "",
    "/banks",
    "/insurance",
    "/compare",
    "/recommend",
    "/blog",
    "/guides",
    "/about",
    "/contact",
    "/privacy-policy",
    "/terms",
    "/cookie-policy",
    "/affiliate-disclosure",
  ];

  return [
    ...staticPaths.map((p) => entry(p, p === "" ? 1 : 0.8)),
    ...categories.map((c) =>
      entry(`/${c.vertical === "BANKING" ? "banks" : "insurance"}/${c.slug}`, 0.7),
    ),
    ...products.map((p) => entry(`/products/${p.slug}`, 0.8)),
    ...posts.map((p) => entry(`/blog/${p.slug}`, 0.6)),
  ];
}
