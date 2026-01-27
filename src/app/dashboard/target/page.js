import TargetClient from "@/components/dashboard/target/TargetClient";

// Mock data
const MOCK_TARGETS = [
  { id: 1, employee: "John Doe", year: "2025", product: "Content Creation", target: "50000" },
  { id: 2, employee: "Jane Smith", year: "2025", product: "Exhibitions", target: "100000" },
  { id: 3, employee: "Mike Jones", year: "2024", product: "Events", target: "75000" },
];

export default function TargetPage() {
  return <TargetClient initialTargets={MOCK_TARGETS} />;
}
