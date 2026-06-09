import { requireAdmin } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/admin-shell";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  const session = await requireAdmin();

  const [leads, links, leadCount, clickAgg] = await Promise.all([
    prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      include: { recommended: { include: { product: { select: { name: true } } } } },
    }),
    prisma.affiliateLink.findMany({
      orderBy: { clicks: "desc" },
      include: { product: { select: { name: true } } },
    }),
    prisma.lead.count(),
    prisma.affiliateLink.aggregate({ _sum: { clicks: true } }),
  ]);

  return (
    <AdminShell title="Analytics" user={session.user}>
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Total leads" value={leadCount} />
        <Stat label="Total clicks" value={clickAgg._sum.clicks ?? 0} />
        <Stat label="Tracked links" value={links.length} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title="Clicks by product">
          <div className="space-y-2">
            {links.map((l) => (
              <div key={l.id} className="flex items-center justify-between text-sm">
                <span className="truncate">{l.product.name}</span>
                <span className="font-semibold">{l.clicks}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Recent leads">
          <div className="space-y-3">
            {leads.map((lead) => (
              <div key={lead.id} className="text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">{lead.email ?? "Anonymous"}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(lead.createdAt, "en", { month: "short", day: "numeric" })} · {lead.source}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {lead.recommended.map((r) => r.product.name).join(", ") || "—"}
                </p>
              </div>
            ))}
            {leads.length === 0 && <p className="text-sm text-muted-foreground">No leads yet.</p>}
          </div>
        </Panel>
      </div>
    </AdminShell>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5 shadow-soft">
      <p className="text-3xl font-semibold">{value.toLocaleString()}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-6 shadow-soft">
      <h2 className="mb-4 font-semibold">{title}</h2>
      {children}
    </div>
  );
}
