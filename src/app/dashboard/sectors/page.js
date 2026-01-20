import SectorsClient from "@/components/dashboard/sectors/SectorsClient";
import api from "@/app/api/api"; // 🔌 Import your configured axios instance

/**
 * 🎯 Server Component for Sectors Page
 * 
 * Benefits:
 * - Fast initial page load (no hydration delay)
 * - Server-side rendering for better SEO
 * - Ready for async data fetching from API
 * 
 * 🔌 API READY: Replace MOCK_SECTORS with actual data fetching:
 * 
 * async function getSectors() {
 *   try {
 *     const res = await api.get('/sectors');
 *     return res.data;
 *   } catch (error) {
 *     console.error('Failed to fetch sectors:', error);
 *     return [];
 *   }
 * }
 * 
 * export default async function SectorsPage() {
 *   const sectors = await getSectors();
 *   return <SectorsClient initialSectors={sectors} />;
 * }
 */

// Mock data - Replace with API call when backend is ready
const MOCK_SECTORS = [
  { id: 1, title: "Manufacturing", description: "Description", created_at: "2026-01-15" },
  { id: 2, title: "Banking, Insurance & FinTech", description: "Description", created_at: "2026-01-15" },
  { id: 3, title: "Telecomm, Media & Entertainment", description: "Description", created_at: "2026-01-15" },
  { id: 4, title: "Beauty, Cosmetics & BeautyTech", description: "Description", created_at: "2026-01-15" },
  { id: 5, title: "Defense & Security", description: "Description", created_at: "2026-01-15" },
  { id: 6, title: "FMCGs, F&B, Foodtech & Aggregators", description: "Description", created_at: "2026-01-15" },
];

export default function SectorsPage() {
  // 🔌 When API is ready, make this async and fetch data here
  // const sectors = await getSectors();
  
  return <SectorsClient initialSectors={MOCK_SECTORS} />;
}
