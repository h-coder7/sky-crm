import { Suspense } from "react";
import CategoriesClient from "@/components/dashboard/categories/CategoriesClient";

// Mock data
const MOCK_CATEGORIES = [
  { id: 1, title: "A", start_price: "500001.00", end_price: "1000000.00", created_at: "2025-10-01" },
  { id: 2, title: "B", start_price: "100001.00", end_price: "500000.00", created_at: "2025-10-01" },
  { id: 3, title: "C", start_price: "10000.00", end_price: "100000.00", created_at: "2025-10-01" },
];

export default function CategoriesPage() {
  return (
    <Suspense fallback={<div className="d-none">Loading categories...</div>}>
      <CategoriesClient initialCategories={MOCK_CATEGORIES} />
    </Suspense>
  );
}
