import { requireAdmin } from "@/lib/admin-guard";
import { posts } from "@/data/blog";
import { AdminShell } from "@/components/admin/admin-shell";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const session = await requireAdmin();
  const list = [...posts].sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

  return (
    <AdminShell title="Blog" user={session.user}>
      <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-soft">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-surface text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Author</th>
              <th className="px-4 py-3 font-medium">Published</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {list.map((p) => (
              <tr key={p.id} className="hover:bg-surface/50">
                <td className="px-4 py-3 font-medium">{p.title}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.category}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.author?.name ?? "—"}</td>
                <td className="px-4 py-3 text-muted-foreground">{formatDate(p.publishedAt, "en", { month: "short", day: "numeric", year: "numeric" })}</td>
                <td className="px-4 py-3">
                  <Badge variant={p.published ? "success" : "muted"}>
                    {p.published ? "Published" : "Draft"}
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
