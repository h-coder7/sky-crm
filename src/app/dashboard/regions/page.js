import { Suspense } from "react";
import RegionsClient from "@/components/dashboard/regions/RegionsClient";

export default function RegionsPage() {
  return (
    <Suspense fallback={<div className="d-none">Loading regions...</div>}>
      <RegionsClient />
    </Suspense>
  );
}
