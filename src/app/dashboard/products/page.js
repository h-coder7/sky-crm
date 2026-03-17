import { Suspense } from "react";
import ProductsClient from "@/components/dashboard/products/ProductsClient";

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="d-none">Loading products...</div>}>
      <ProductsClient />
    </Suspense>
  );
}
