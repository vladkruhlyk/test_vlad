import Link from "next/link";
import { Package, FileText, FolderTree, Building2, ArrowUpRight } from "lucide-react";
import { requireAdmin } from "@/lib/admin-guard";
import { products, categories, banks, providers } from "@/data/catalog";
import { posts } from "@/data/blog";
import { AdminShell } from "@/components/admin/admin-shell";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const session = await requireAdmin();

  const stats = [
    { label: "Products", value: products.length, icon: Package, href: "/admin/products" },
    { label: "Blog posts", value: posts.length, icon: FileText, href: "/admin/blog" },
    { label: "Categories", value: categories.length, icon: FolderTree, href: "/admin/categories" },
    { label: "Brands", value: banks.length + providers.length, icon: Building2, href: "/admin/affiliate-links" },
  ];

  const topProducts = [...products].sort((a, b) => b.popularity - a.popularity).slice(0, 5);

  return (
    <AdminShell title="Dashboard" user={session.user}>
      <p className="mb-6 rounded-xl border border-border bg-background p-4 text-sm text-muted-foreground">
        Content is served from static data and will be managed in the CMS (Sanity). This panel is
        read-only — live click & lead analytics come from your analytics provider once connected.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="group rounded-2xl border border-border bg-background p-5 shadow-soft transition-all hover:shadow-card"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <s.icon className="h-5 w-5" />
              </span>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <p className="mt-4 text-3xl font-semibold">{s.value.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-background p-6 shadow-soft">
        <h2 className="font-semibold">Most popular products</h2>
        <div className="mt-4 space-y-3">
          {topProducts.map((p) => (
            <div key={p.id} className="flex items-center justify-between text-sm">
              <span className="truncate">{p.name}</span>
              <span className="ml-3 shrink-0 font-semibold text-muted-foreground">
                {p.rating?.overall.toFixed(1) ?? "—"} ★
              </span>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
