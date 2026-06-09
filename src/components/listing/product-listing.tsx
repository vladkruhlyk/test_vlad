import { getTranslations } from "next-intl/server";
import { SearchX } from "lucide-react";
import { Breadcrumbs, type Crumb } from "@/components/breadcrumbs";
import { ProductListItem } from "@/components/product/product-list-item";
import { FilterSidebar } from "./filter-sidebar";
import { ListingControls } from "./listing-controls";
import { Pagination } from "./pagination";
import { getProducts, getBrands, type ProductFilters } from "@/lib/queries";

export async function ProductListing({
  title,
  subtitle,
  crumbs,
  filters,
  vertical,
}: {
  title: string;
  subtitle?: string;
  crumbs: Crumb[];
  filters: ProductFilters;
  vertical?: "BANKING" | "INSURANCE";
}) {
  const t = await getTranslations("Listing");
  const [{ items, total, page, totalPages }, brands] = await Promise.all([
    getProducts({ ...filters, perPage: 9 }),
    vertical ? getBrands(vertical) : Promise.resolve([]),
  ]);

  return (
    <div className="container py-8 lg:py-12">
      <Breadcrumbs items={crumbs} className="mb-6" />

      <header className="max-w-2xl">
        <h1 className="text-display-sm font-semibold sm:text-display-md">{title}</h1>
        {subtitle && <p className="mt-3 text-lg text-muted-foreground">{subtitle}</p>}
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
        <FilterSidebar brands={brands} />

        <div>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
            <ListingControls />
          </div>
          <p className="mb-5 text-sm text-muted-foreground">{t("results", { count: total })}</p>

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface/50 px-6 py-20 text-center">
              <SearchX className="h-10 w-10 text-muted-foreground" />
              <p className="mt-4 text-base font-medium">{t("noResults")}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((product) => (
                <ProductListItem key={product.id} product={product} />
              ))}
            </div>
          )}

          <Pagination page={page} totalPages={totalPages} />
        </div>
      </div>
    </div>
  );
}
