import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const dynamic = "force-dynamic";

async function updateProduct(formData: FormData) {
  "use server";
  await requireAdmin();
  const id = String(formData.get("id"));

  const num = (key: string) => {
    const v = formData.get(key);
    return v === null || v === "" ? null : Number(v);
  };

  await prisma.product.update({
    where: { id },
    data: {
      name: String(formData.get("name")),
      tagline: String(formData.get("tagline") ?? ""),
      summary: String(formData.get("summary") ?? ""),
      monthlyFee: num("monthlyFee"),
      cardFee: num("cardFee"),
      cashbackPercent: num("cashbackPercent"),
      published: formData.get("published") === "on",
      featured: formData.get("featured") === "on",
      metaTitle: String(formData.get("metaTitle") ?? ""),
      metaDescription: String(formData.get("metaDescription") ?? ""),
    },
  });

  revalidatePath("/admin/products");
  revalidatePath(`/products/${formData.get("slug")}`);
  redirect("/admin/products");
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireAdmin();
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();

  return (
    <AdminShell title={`Edit: ${product.name}`} user={session.user}>
      <Link
        href="/admin/products"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to products
      </Link>

      <form action={updateProduct} className="max-w-2xl space-y-6">
        <input type="hidden" name="id" value={product.id} />
        <input type="hidden" name="slug" value={product.slug} />

        <section className="rounded-2xl border border-border bg-background p-6 shadow-soft">
          <h2 className="mb-4 font-semibold">Basics</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" defaultValue={product.name} className="mt-1.5" required />
            </div>
            <div>
              <Label htmlFor="tagline">Tagline</Label>
              <Input id="tagline" name="tagline" defaultValue={product.tagline ?? ""} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="summary">Summary</Label>
              <Textarea id="summary" name="summary" defaultValue={product.summary ?? ""} className="mt-1.5" />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-background p-6 shadow-soft">
          <h2 className="mb-4 font-semibold">Pricing</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label htmlFor="monthlyFee">Monthly fee (PLN)</Label>
              <Input id="monthlyFee" name="monthlyFee" type="number" step="0.01" defaultValue={product.monthlyFee ?? ""} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="cardFee">Card fee (PLN)</Label>
              <Input id="cardFee" name="cardFee" type="number" step="0.01" defaultValue={product.cardFee ?? ""} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="cashbackPercent">Cashback (%)</Label>
              <Input id="cashbackPercent" name="cashbackPercent" type="number" step="0.1" defaultValue={product.cashbackPercent ?? ""} className="mt-1.5" />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-background p-6 shadow-soft">
          <h2 className="mb-4 font-semibold">SEO</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="metaTitle">Meta title</Label>
              <Input id="metaTitle" name="metaTitle" defaultValue={product.metaTitle ?? ""} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="metaDescription">Meta description</Label>
              <Textarea id="metaDescription" name="metaDescription" defaultValue={product.metaDescription ?? ""} className="mt-1.5" />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-background p-6 shadow-soft">
          <h2 className="mb-4 font-semibold">Visibility</h2>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="published" defaultChecked={product.published} className="h-4 w-4 rounded border-border accent-[hsl(var(--accent))]" />
              Published
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="featured" defaultChecked={product.featured} className="h-4 w-4 rounded border-border accent-[hsl(var(--accent))]" />
              Featured
            </label>
          </div>
        </section>

        <div className="flex gap-3">
          <Button type="submit" size="lg">Save changes</Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/admin/products">Cancel</Link>
          </Button>
        </div>
      </form>
    </AdminShell>
  );
}
