import { Suspense } from "react";
import DailyLogClient from "@/components/dashboard/daily-log/DailyLogClient";

// Mock data based on requested fields
export default function DailyLogPage() {
  return (
    <Suspense fallback={<div className="d-none">Loading daily logs...</div>}>
      <DailyLogClient />
    </Suspense>
  );
}
