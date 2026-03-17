import { Suspense } from "react";
import CategoriesClient from "@/components/dashboard/categories/CategoriesClient";

export default function CategoriesPage() {
  return (
    <Suspense fallback={<div className="d-none">Loading categories...</div>}>
      <CategoriesClient />
    </Suspense>
  );
}
