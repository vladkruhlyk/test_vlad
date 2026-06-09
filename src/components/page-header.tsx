import { Breadcrumbs, type Crumb } from "@/components/breadcrumbs";

export function PageHeader({
  title,
  lead,
  crumbs,
}: {
  title: string;
  lead?: string;
  crumbs: Crumb[];
}) {
  return (
    <div className="border-b border-border bg-surface/50">
      <div className="container py-12 lg:py-16">
        <Breadcrumbs items={crumbs} className="mb-6" />
        <h1 className="max-w-3xl text-display-sm font-semibold sm:text-display-md">{title}</h1>
        {lead && <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{lead}</p>}
      </div>
    </div>
  );
}
