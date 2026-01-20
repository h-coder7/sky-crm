import CategoriesClient from "@/components/dashboard/categories/CategoriesClient";
import api from "@/app/api/api"; // 🔌 Import your configured axios instance

/**
 * 🎯 Server Component for Categories Page
 * 
 * Benefits:
 * - Fast initial page load (no hydration delay)
 * - Server-side rendering for better SEO
 * - Ready for async data fetching from API
 * 
 * 🔌 API READY: Replace MOCK_CATEGORIES with actual data fetching:
 * 
 * async function getCategories() {
 *   try {
 *     const res = await api.get('/categories');
 *     return res.data;
 *   } catch (error) {
 *     console.error('Failed to fetch categories:', error);
 *     return [];
 *   }
 * }
 * 
 * export default async function CategoriesPage() {
 *   const categories = await getCategories();
 *   return <CategoriesClient initialCategories={categories} />;
 * }
 */

// Mock data - Replace with API call when backend is ready
const MOCK_CATEGORIES = [
  { id: 1, title: "Electronics", start_price: 100, created_at: "2025-08-12" },
  { id: 2, title: "Clothing", start_price: 50, created_at: "2025-07-20" },
  { id: 3, title: "Books", start_price: 20, created_at: "2025-06-05" },
];

export default function CategoriesPage() {
  // 🔌 When API is ready, make this async and fetch data here
  // const categories = await getCategories();
  
  return <CategoriesClient initialCategories={MOCK_CATEGORIES} />;
}
