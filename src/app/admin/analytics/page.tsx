import { requireAdmin } from "@/lib/admin-guard";
import { products } from "@/data/catalog";
import { posts } from "@/data/blog";
import { AdminShell } from "@/components/admin/admin-shell";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  const session = await requireAdmin();

  const stats = [
    { label: "Products", value: products.length },
    { label: "Affiliate links", value: products.reduce((n, p) => n + p.affiliateLinks.length, 0) },
    { label: "Blog posts", value: posts.length },
  ];

  const byPopularity = [...products].sort((a, b) => b.popularity - a.popularity);

  return (
    <AdminShell title="Analytics" user={session.user}>
      <p className="mb-6 rounded-xl border border-border bg-background p-4 text-sm text-muted-foreground">
        Connect an analytics provider (GA4, PostHog, Plausible) to see live clicks, conversions and
        leads here. The figures below are catalog metadata only.
      </p>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-background p-5 shadow-soft">
            <p className="text-3xl font-semibold">{s.value.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-background p-6 shadow-soft">
        <h2 className="mb-4 font-semibold">Products by popularity</h2>
        <div className="space-y-2">
          {byPopularity.map((p) => (
            <div key={p.id} className="flex items-center justify-between text-sm">
              <span className="truncate">{p.name}</span>
              <span className="font-semibold text-muted-foreground">{p.popularity}</span>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
