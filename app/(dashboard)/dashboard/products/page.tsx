import { getDashboardProducts } from "@/lib/dashboard-data";
import { ProductsTable } from "@/components/dashboard/products-table";

export default async function DashboardProductsPage() {
  const products = await getDashboardProducts();
  const rows = products.map((p) => ({
    ...p,
    price: p.price.toString(),
    createdAt: p.createdAt.toISOString(),
  }));

  return <ProductsTable products={rows} />;
}
