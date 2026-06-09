import Link from "next/link";
import { Pencil } from "lucide-react";
import { requireAdmin } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/admin-shell";
import { Badge } from "@/components/ui/badge";
import { formatMonthlyFee } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const session = await requireAdmin();
  const products = await prisma.product.findMany({
    include: {
      rating: true,
      affiliateLinks: { select: { clicks: true } },
      category: { select: { name: true } },
    },
    orderBy: { popularity: "desc" },
  });

  return (
    <AdminShell title="Products" user={session.user}>
      <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-soft">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-surface text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Monthly fee</th>
              <th className="px-4 py-3 font-medium">Rating</th>
              <th className="px-4 py-3 font-medium">Clicks</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-surface/50">
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.category.name}</td>
                <td className="px-4 py-3">{formatMonthlyFee(p.monthlyFee, "en", "Free")}</td>
                <td className="px-4 py-3">{p.rating?.overall.toFixed(1) ?? "—"}</td>
                <td className="px-4 py-3">
                  {p.affiliateLinks.reduce((sum, l) => sum + l.clicks, 0)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1.5">
                    <Badge variant={p.published ? "success" : "muted"}>
                      {p.published ? "Published" : "Draft"}
                    </Badge>
                    {p.featured && <Badge variant="accent">Featured</Badge>}
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="inline-flex items-center gap-1 text-accent hover:underline"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
