import { notFound } from "next/navigation";
import { ProductForm } from "@/components/dashboard/product-form";
import { getDashboardCategories, getDashboardProduct } from "@/lib/dashboard-data";
import { entityIdSchema } from "@/lib/dashboard-schemas";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const parsedId = entityIdSchema.safeParse(params.id);
  if (!parsedId.success) notFound();
  const [product, categories] = await Promise.all([getDashboardProduct(parsedId.data), getDashboardCategories()]);
  if (!product) notFound();

  return (
    <ProductForm
      product={{
        ...product,
        price: product.price.toString(),
        images: product.images.map((img) => ({ url: img.url, isPrimary: img.isPrimary, sortOrder: img.sortOrder })),
      }}
      categories={categories.map(({ id, name }) => ({ id, name }))}
    />
  );
}
