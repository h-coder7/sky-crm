import AdminsClient from "@/components/dashboard/admins/AdminsClient";
import api from "@/app/api/api"; // 🔌 Import your configured axios instance

/**
 * 🎯 Server Component for Admins Page
 * 
 * Benefits:
 * - Fast initial page load (no hydration delay)
 * - Server-side rendering for better SEO
 * - Ready for async data fetching from API
 * 
 * 🔌 API READY: Replace MOCK_ADMINS with actual data fetching:
 * 
 * async function getAdmins() {
 *   try {
 *     const res = await api.get('/admins');
 *     return res.data;
 *   } catch (error) {
 *     console.error('Failed to fetch admins:', error);
 *     return [];
 *   }
 * }
 * 
 * export default async function AdminsPage() {
 *   const admins = await getAdmins();
 *   return <AdminsClient initialAdmins={admins} />;
 * }
 */

// Mock data - Replace with API call when backend is ready
const MOCK_ADMINS = [
  { 
    id: 1, 
    name: "John Doe", 
    email: "john@example.com", 
    phone: "+1234567890", 
    role: "Super Admin", 
    created_at: "2025-01-15",
    // image: "/crm-skybridge/images/profile.svg" 
  },
  { 
    id: 2, 
    name: "Jane Smith", 
    email: "jane@example.com", 
    phone: "+1987654321", 
    role: "Admin", 
    created_at: "2025-02-20",
    // image: "/crm-skybridge/images/profile.svg" 
  },
  { 
    id: 3, 
    name: "Mike Johnson", 
    email: "mike@example.com", 
    phone: "+1122334455", 
    role: "Sub Admin", 
    created_at: "2025-03-10",
    // image: "/crm-skybridge/images/profile.svg" 
  },
];

export default function AdminsPage() {
  // 🔌 When API is ready, make this async and fetch data here
  // const admins = await getAdmins();
  
  return <AdminsClient initialAdmins={MOCK_ADMINS} />;
}

