import { Suspense } from "react";
import TargetClient from "@/components/dashboard/target/TargetClient";

// Mock data
const MOCK_TARGETS = [
  { id: 1, employee: "John Doe", product: "Content Creation", year: "2025", length: "12", values: "50000" },
  { id: 2, employee: "Jane Smith", product: "Exhibitions", year: "2025", length: "6", values: "100000" },
  { id: 3, employee: "Mike Jones", product: "Events", year: "2024", length: "8", values: "75000" },
];

export default function TargetPage() {
  return (
    <Suspense fallback={<div className="d-none">Loading targets...</div>}>
      <TargetClient initialTargets={MOCK_TARGETS} />
    </Suspense>
  );
}
