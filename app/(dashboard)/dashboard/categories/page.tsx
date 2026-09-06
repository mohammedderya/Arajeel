import { CategoryManager } from "@/components/dashboard/category-manager";
import { getDashboardCategories } from "@/lib/dashboard-data";

export default async function DashboardCategoriesPage() {
  const categories = await getDashboardCategories();
  return <CategoryManager categories={categories} />;
}
