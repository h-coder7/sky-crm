import { Suspense } from "react";
import RegionsClient from "@/components/dashboard/regions/RegionsClient";

const MOCK_REGIONS = [
  {
    id: 1,
    title: "Middle East",
    country: "United Arab Emirates",
    created_at: "2026-01-20"
  },
  {
    id: 2,
    title: "Europe",
    country: "Germany",
    created_at: "2026-01-21"
  },
  {
    id: 3,
    title: "Asia",
    country: "Singapore",
    created_at: "2026-01-22"
  }
];

export default function RegionsPage() {
  return (
    <Suspense fallback={<div className="d-none">Loading regions...</div>}>
      <RegionsClient initialRegions={MOCK_REGIONS} />
    </Suspense>
  );
}
