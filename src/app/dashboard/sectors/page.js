import { Suspense } from "react";
import SectorsClient from "@/components/dashboard/sectors/SectorsClient";
import api from "@/app/api/api"; // 🔌 Import your configured axios instance

/**
 * 🎯 Server Component for Sectors Page
 */

export default function SectorsPage() {
  return (
    <Suspense fallback={<div className="d-none">Loading sectors...</div>}>
      <SectorsClient />
    </Suspense>
  );
}
