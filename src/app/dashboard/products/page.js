import ProductsClient from "@/components/dashboard/products/ProductsClient";
import api from "@/app/api/api"; // 🔌 Import your configured axios instance

/**
 * 🎯 Server Component for Products Page
 * 
 * Benefits:
 * - Fast initial page load (no hydration delay)
 * - Server-side rendering for better SEO
 * - Ready for async data fetching from API
 * 
 * 🔌 API READY: Replace MOCK_PRODUCTS with actual data fetching:
 * 
 * async function getProducts() {
 *   try {
 *     const res = await api.get('/products');
 *     return res.data;
 *   } catch (error) {
 *     console.error('Failed to fetch products:', error);
 *     return [];
 *   }
 * }
 * 
 * export default async function ProductsPage() {
 *   const products = await getProducts();
 *   return <ProductsClient initialProducts={products} />;
 * }
 */

// Mock data - Replace with API call when backend is ready
const MOCK_PRODUCTS = [
  { id: 1, title: "Content Creation", created_at: "2025-11-04" },
  { id: 2, title: "Exhibitions", created_at: "2025-11-04" },
  { id: 3, title: "Events", created_at: "2025-11-04" },
];

export default function ProductsPage() {
  // 🔌 When API is ready, make this async and fetch data here
  // const products = await getProducts();
  
  return <ProductsClient initialProducts={MOCK_PRODUCTS} />;
}
