import { CategoryManager } from "@/components/dashboard/category-manager";
import { getDashboardCategories } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

export default async function DashboardCategoriesPage() {
  const categories = await getDashboardCategories();
  return <CategoryManager categories={categories} />;
}
