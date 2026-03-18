import { Suspense } from "react";
import EmployeesClient from "@/components/dashboard/employees/EmployeesClient";

/**
 * 🎯 Server Component for Employees Page
 */
export default function EmployeesPage() {
  return (
    <Suspense fallback={<div className="text-center py-5">Loading employees...</div>}>
      <EmployeesClient />
    </Suspense>
  );
}
