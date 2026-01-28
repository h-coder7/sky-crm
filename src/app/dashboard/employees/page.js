import { Suspense } from "react";
import EmployeesClient from "@/components/dashboard/employees/EmployeesClient";
import api from "@/app/api/api"; // 🔌 Import your configured axios instance

/**
 * 🎯 Server Component for Employees Page
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
  return (
    <Suspense fallback={<div className="d-none">Loading employees...</div>}>
      <EmployeesClient initialEmployees={MOCK_EMPLOYEES} />
    </Suspense>
  );
}

