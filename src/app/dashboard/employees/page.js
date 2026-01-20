import EmployeesClient from "@/components/dashboard/employees/EmployeesClient";
import api from "@/app/api/api"; // 🔌 Import your configured axios instance

/**
 * 🎯 Server Component for Employees Page
 * 
 * Benefits:
 * - Fast initial page load (no hydration delay)
 * - Server-side rendering for better SEO
 * - Ready for async data fetching from API
 * 
 * 🔌 API READY: Replace MOCK_EMPLOYEES with actual data fetching:
 * 
 * async function getEmployees() {
 *   try {
 *     const res = await api.get('/employees');
 *     return res.data;
 *   } catch (error) {
 *     console.error('Failed to fetch employees:', error);
 *     return [];
 *   }
 * }
 * 
 * export default async function EmployeesPage() {
 *   const employees = await getEmployees();
 *   return <EmployeesClient initialEmployees={employees} />;
 * }
 */

// Mock data - Replace with API call when backend is ready
const MOCK_EMPLOYEES = [
  { 
    id: 1, 
    name: "Sedra Quraid", 
    email: "s.quraid@skybridgeworld.com", 
    phone: "506011612", 
    role: "Business Development Executive", 
    sector: "Real estate & Construction , Government & Public Services",
    created_at: "2025-12-03",
  },
  { 
    id: 2, 
    name: "Christina Skentos", 
    email: "c.skentos@skybridgeworld.com", 
    phone: "569239235", 
    role: "Business Development Manager", 
    sector: "Logistics, Travel & Leisure , Oil & Gas, & Energy",
    created_at: "2025-11-18",
  },
];

export default function EmployeesPage() {
  // 🔌 When API is ready, make this async and fetch data here
  // const employees = await getEmployees();
  
  return <EmployeesClient initialEmployees={MOCK_EMPLOYEES} />;
}

