/**
 * Paths to bundled official brand icons in /public/logos.
 * Fetched from each brand's own site / favicon service. Link4 has no fetchable
 * icon, so it falls back to a bundled SVG wordmark.
 */
export const brandLogos: Record<string, string> = {
  mbank: "/logos/mbank-real.png",
  ing: "/logos/ing-real.png",
  santander: "/logos/santander-real.png",
  "pko-bp": "/logos/pko-bp-real.jpg",
  revolut: "/logos/revolut-real.png",
  millennium: "/logos/millennium-real.jpg",
  "nest-bank": "/logos/nest-bank-real.png",
  pzu: "/logos/pzu-real.png",
  warta: "/logos/warta-real.png",
  link4: "/logos/link4.svg",
  allianz: "/logos/allianz-real.png",
  "ergo-hestia": "/logos/ergo-hestia-real.png",
};
