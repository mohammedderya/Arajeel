import { ProductForm } from "@/components/dashboard/product-form";
import { getDashboardCategories } from "@/lib/dashboard-data";

export default async function NewProductPage() {
  const categories = await getDashboardCategories();
  return <ProductForm categories={categories.map(({ id, name }) => ({ id, name }))} />;
}
