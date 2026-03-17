import { Suspense } from "react";
import AdminsClient from "@/components/dashboard/admins/AdminsClient.jsx";

/**
 * 🎯 Server Component for Admins Page
 */

// Mock data - Replace with API call when backend is ready
export default function AdminsPage() {
  return (
    <Suspense fallback={<div className="d-none">Loading admins...</div>}>
      <AdminsClient />
    </Suspense>
  );
}

