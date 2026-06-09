import { requireAdmin } from "@/lib/admin-guard";
import { categories, products } from "@/data/catalog";
import { AdminShell } from "@/components/admin/admin-shell";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const session = await requireAdmin();
  const list = [...categories].sort((a, b) => a.order - b.order);
  const countFor = (slug: string) => products.filter((p) => p.category.slug === slug).length;

  return (
    <AdminShell title="Categories" user={session.user}>
      <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-soft">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-surface text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Vertical</th>
              <th className="px-4 py-3 font-medium">Products</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {list.map((c) => (
              <tr key={c.id} className="hover:bg-surface/50">
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{c.slug}</td>
                <td className="px-4 py-3">
                  <Badge variant={c.vertical === "BANKING" ? "accent" : "success"}>{c.vertical}</Badge>
                </td>
                <td className="px-4 py-3">{countFor(c.slug)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
