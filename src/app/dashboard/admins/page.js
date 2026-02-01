import { Suspense } from "react";
import AdminsClient from "@/components/dashboard/admins/AdminsClient.jsx";
import api from "@/app/api/api"; // 🔌 Import your configured axios instance

/**
 * 🎯 Server Component for Admins Page
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
  },
  { 
    id: 2, 
    name: "Jane Smith", 
    email: "jane@example.com", 
    phone: "+1987654321", 
    role: "Admin", 
    created_at: "2025-02-20",
  },
  { 
    id: 3, 
    name: "Mike Johnson", 
    email: "mike@example.com", 
    phone: "+1122334455", 
    role: "Sub Admin", 
    created_at: "2025-03-10",
  },
];

export default function AdminsPage() {
  return (
    <Suspense fallback={<div className="d-none">Loading admins...</div>}>
      <AdminsClient initialAdmins={MOCK_ADMINS} />
    </Suspense>
  );
}

