import { Suspense } from "react";
import DealsClient from "@/components/dashboard/deals/DealsClient";

export default function DealsPage() {
  return (
    <Suspense fallback={<div className="d-none">Loading deals...</div>}>
      <DealsClient />
    </Suspense>
  );
}
