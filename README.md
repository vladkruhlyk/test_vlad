# BankPilots — Fintech Affiliate Comparison Platform (Poland)

A production-ready, SEO-first comparison platform for the Polish market: bank
accounts, cards and insurance. Users compare products and click **Apply**, which
opens tracked affiliate (CPA) links. Built to a modern fintech design bar
(Stripe / Linear / Mercury) — light, minimal, trustworthy.

> Status: this repository is a complete, runnable **vertical slice** of the full
> product. Every major surface is implemented end-to-end (home, listings,
> product detail, comparison, recommendation wizard, MDX blog, legal pages,
> admin panel, full SEO). The seed ships realistic Polish-market sample data so
> the app runs immediately with zero external services.

---

## Tech stack

| Area        | Choice                                             |
| ----------- | -------------------------------------------------- |
| Framework   | Next.js 15 (App Router) · React 19 · TypeScript    |
| Styling     | Tailwind CSS · shadcn/ui-style primitives          |
| Animation   | Framer Motion (subtle, reduced-motion aware)       |
| Data        | PostgreSQL + Prisma ORM (SQLite for local dev)     |
| Auth        | NextAuth (credentials, JWT) — protects `/admin`    |
| Forms       | React Hook Form + Zod                              |
| i18n        | next-intl — Polish (default), English, Ukrainian   |
| Content     | MDX blog (`next-mdx-remote`)                       |
| SEO         | Metadata API, JSON-LD, sitemap, robots, hreflang   |

---

## Quick start

```bash
# 1. Install
npm install

# 2. Environment (defaults work out of the box for local SQLite)
cp .env.example .env

# 3. Create the database schema + seed sample data
npm run db:push
npm run db:seed

# 4. Run
npm run dev          # http://localhost:3000
```

Admin panel: <http://localhost:3000/admin> — demo login `admin@example.com` /
`admin123`.

---

## Database: SQLite locally, Postgres in production

Local development uses **SQLite** (`prisma/dev.db`) for zero-config setup. The
schema is written to be portable (enums modelled as documented string unions,
lists/objects as `Json`).

To switch to **PostgreSQL** for production:

1. In `prisma/schema.prisma`, change the datasource provider:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. Set `DATABASE_URL` to your Postgres connection string.
3. Run `npm run db:push` (or generate a migration with `prisma migrate`).

---

## Scripts

| Script             | Description                                |
| ------------------ | ------------------------------------------ |
| `npm run dev`      | Start the dev server                       |
| `npm run build`    | `prisma generate` + production build       |
| `npm run start`    | Start the production server                |
| `npm run lint`     | ESLint                                     |
| `npm run typecheck`| `tsc --noEmit`                             |
| `npm run db:push`  | Push schema to the database                |
| `npm run db:seed`  | Seed sample data (idempotent)              |
| `npm run db:studio`| Open Prisma Studio                         |
| `npm run db:reset` | Reset + reseed the database                |

---

## Project structure

```
src/
├─ app/
│  ├─ [locale]/                 # Localized public site (pl | en | uk)
│  │  ├─ layout.tsx             # Root layout: fonts, providers, header, footer
│  │  ├─ page.tsx               # Homepage (10 sections)
│  │  ├─ banks/                 # Listing + [category] pages
│  │  ├─ insurance/             # Listing + [category] pages
│  │  ├─ products/[slug]/       # Rich product detail page
│  │  ├─ compare/               # Up-to-4 comparison table
│  │  ├─ recommend/             # Recommendation wizard (lead gen)
│  │  ├─ blog/                  # MDX blog list + [slug]
│  │  ├─ guides, about, contact, privacy-policy, terms, affiliate-disclosure
│  │  └─ opengraph-image.tsx    # Dynamic default social card
│  ├─ admin/                    # Protected admin (own root layout, not localized)
│  ├─ api/                      # newsletter, leads, contact, affiliate/click, auth
│  ├─ sitemap.ts · robots.ts · icon.svg
├─ components/
│  ├─ ui/                       # Design-system primitives (button, card, …)
│  ├─ layout/ home/ product/ listing/ compare/ blog/ wizard/ admin/ seo/ …
├─ content/blog/               # MDX article bodies
├─ i18n/                       # next-intl routing, navigation, request config
├─ lib/                        # prisma, queries, seo, recommend, format, utils …
messages/                      # pl.json · en.json · uk.json
prisma/                        # schema.prisma · seed.ts
```

---

## Key features

- **Design system** — exact brand palette wired as HSL CSS variables; light,
  minimal, generous spacing, rounded corners, soft shadows.
- **Sticky header with mega menus** for Banks and Insurance; mobile sheet nav.
- **Homepage** — hero, trust stats, categories, how-it-works, featured products,
  data-driven rankings, comparison preview, latest posts, FAQ (+FAQ schema),
  wizard CTA.
- **Listings** — URL-synced filters (fee slider, feature switches), search,
  sort, pagination, sticky sidebar, mobile filter sheet.
- **Product detail** — pros/cons, fees table, requirements, benefits, how-to-apply,
  FAQ, related products, author block, affiliate disclosure, Product + FAQ +
  Breadcrumb JSON-LD.
- **Comparison** — up to 4 products, highlights for best value / lowest fees /
  most popular. Selection persists via a floating compare bar (localStorage).
- **Recommendation wizard** — 6-question flow → top-3 rule-based matches, stored
  as leads for the affiliate funnel.
- **Affiliate tracking** — outbound clicks recorded via `sendBeacon`;
  `rel="sponsored nofollow"`; clicks surfaced in the admin analytics view.
- **MDX blog** — reading time, author, table of contents, related posts,
  category filter, Article + FAQ schema.
- **Admin panel** — NextAuth-protected dashboard, products list + working edit
  (server actions), categories / blog / affiliate-links / FAQ views, analytics.
- **SEO** — per-page metadata, canonical + hreflang alternates, Open Graph &
  Twitter cards, dynamic OG image, sitemap with alternates, robots, and a full
  JSON-LD graph (Organization, WebSite, Product, Article, FAQ, Breadcrumb).
- **i18n** — Polish default, English and Ukrainian; language switcher preserves
  the current route.

---

## Deploying to Vercel

1. Push to a Git repo and import into Vercel.
2. Set environment variables (`DATABASE_URL` → Postgres, `NEXTAUTH_SECRET`,
   `NEXTAUTH_URL`, `NEXT_PUBLIC_SITE_URL`, admin credentials).
3. Switch the Prisma datasource provider to `postgresql` (see above).
4. Build command `npm run build` runs `prisma generate` automatically.

---

## Notes & next steps

- Legal pages (privacy, terms, disclosure) are sensible templates — have them
  reviewed by a lawyer before launch.
- The demo admin uses SHA-256 password hashing for portability; swap for
  `bcrypt`/`argon2` and a proper user-management flow in production.
- Admin CRUD is fully wired for **Products** (create the same `server action`
  pattern for the remaining entities — the read views already exist).
- Add real partner affiliate URLs and OG/illustration assets before launch.
```
