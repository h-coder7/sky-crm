import { Suspense } from "react";
import ProductsClient from "@/components/dashboard/products/ProductsClient";
import api from "@/app/api/api"; // 🔌 Import your configured axios instance

/**
 * 🎯 Server Component for Products Page
 */

// Mock data - Replace with API call when backend is ready
const MOCK_PRODUCTS = [
  { id: 1, title: "Content Creation", created_at: "2025-11-04" },
  { id: 2, title: "Exhibitions", created_at: "2025-11-04" },
  { id: 3, title: "Events", created_at: "2025-11-04" },
];

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="d-none">Loading products...</div>}>
      <ProductsClient initialProducts={MOCK_PRODUCTS} />
    </Suspense>
  );
}
