import Link from "next/link";
import { Package, FileText, MousePointerClick, Users, ArrowUpRight } from "lucide-react";
import { requireAdmin } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/admin-shell";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const session = await requireAdmin();

  const [products, posts, leads, subscribers, clickAgg, topLinks] = await Promise.all([
    prisma.product.count(),
    prisma.blogPost.count(),
    prisma.lead.count(),
    prisma.newsletterSubscriber.count(),
    prisma.affiliateLink.aggregate({ _sum: { clicks: true } }),
    prisma.affiliateLink.findMany({
      orderBy: { clicks: "desc" },
      take: 5,
      include: { product: { select: { name: true, slug: true } } },
    }),
  ]);

  const stats = [
    { label: "Products", value: products, icon: Package, href: "/admin/products" },
    { label: "Blog posts", value: posts, icon: FileText, href: "/admin/blog" },
    { label: "Affiliate clicks", value: clickAgg._sum.clicks ?? 0, icon: MousePointerClick, href: "/admin/analytics" },
    { label: "Leads", value: leads, icon: Users, href: "/admin/analytics" },
  ];

  return (
    <AdminShell title="Dashboard" user={session.user}>
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

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-background p-6 shadow-soft">
          <h2 className="font-semibold">Top affiliate links</h2>
          <div className="mt-4 space-y-3">
            {topLinks.map((l) => (
              <div key={l.id} className="flex items-center justify-between text-sm">
                <span className="truncate">{l.product.name}</span>
                <span className="ml-3 shrink-0 font-semibold">{l.clicks} clicks</span>
              </div>
            ))}
            {topLinks.length === 0 && (
              <p className="text-sm text-muted-foreground">No clicks recorded yet.</p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-background p-6 shadow-soft">
          <h2 className="font-semibold">Newsletter</h2>
          <p className="mt-4 text-3xl font-semibold">{subscribers.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Total subscribers</p>
        </div>
      </div>
    </AdminShell>
  );
}
