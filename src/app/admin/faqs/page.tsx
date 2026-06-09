import { requireAdmin } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/admin-shell";

export const dynamic = "force-dynamic";

export default async function AdminFaqsPage() {
  const session = await requireAdmin();
  const faqs = await prisma.fAQ.findMany({
    include: { product: { select: { name: true } }, blogPost: { select: { title: true } } },
    orderBy: { order: "asc" },
  });

  return (
    <AdminShell title="FAQ management" user={session.user}>
      <div className="space-y-3">
        {faqs.map((f) => (
          <div key={f.id} className="rounded-2xl border border-border bg-background p-5 shadow-soft">
            <div className="flex items-start justify-between gap-4">
              <p className="font-medium">{f.question}</p>
              <span className="shrink-0 text-xs text-muted-foreground">
                {f.product?.name ?? f.blogPost?.title ?? "Global"}
              </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{f.answer}</p>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
