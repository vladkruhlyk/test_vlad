import { requireAdmin } from "@/lib/admin-guard";
import { products } from "@/data/catalog";
import { AdminShell } from "@/components/admin/admin-shell";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function AdminAffiliateLinksPage() {
  const session = await requireAdmin();
  const links = products.flatMap((p) =>
    p.affiliateLinks.map((l) => ({ ...l, productName: p.name })),
  );

  return (
    <AdminShell title="Affiliate links" user={session.user}>
      <p className="mb-4 text-sm text-muted-foreground">
        Click counts come from your analytics provider once connected.
      </p>
      <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-soft">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-surface text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Partner</th>
              <th className="px-4 py-3 font-medium">URL</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {links.map((l) => (
              <tr key={l.id} className="hover:bg-surface/50">
                <td className="px-4 py-3 font-medium">{l.productName}</td>
                <td className="px-4 py-3 text-muted-foreground">{l.partner}</td>
                <td className="max-w-[320px] truncate px-4 py-3 font-mono text-xs text-muted-foreground">{l.url}</td>
                <td className="px-4 py-3">
                  <Badge variant={l.isActive ? "success" : "muted"}>
                    {l.isActive ? "Active" : "Inactive"}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
