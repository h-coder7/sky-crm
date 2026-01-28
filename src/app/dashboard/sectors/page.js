import { Suspense } from "react";
import SectorsClient from "@/components/dashboard/sectors/SectorsClient";
import api from "@/app/api/api"; // 🔌 Import your configured axios instance

/**
 * 🎯 Server Component for Sectors Page
 */

// Mock data - Replace with API call when backend is ready
const MOCK_SECTORS = [
  { id: 1, title: "Manufacturing", description: "Description", created_at: "2026-01-15" },
  { id: 2, title: "Banking, Insurance & FinTech", description: "Description", created_at: "2026-01-15" },
  { id: 3, title: "Telecomm, Media & Entertainment", description: "Description", created_at: "2026-01-15" },
  { id: 4, title: "Beauty, Cosmetics & BeautyTech", description: "Description", created_at: "2026-01-15" },
  { id: 5, title: "Defense & Security", description: "Description", created_at: "2026-01-15" },
  { id: 6, title: "FMCGs, F&B, Foodtech & Aggregators", description: "Description", created_at: "2026-01-15" },
];

export default function SectorsPage() {
  return (
    <Suspense fallback={<div className="d-none">Loading sectors...</div>}>
      <SectorsClient initialSectors={MOCK_SECTORS} />
    </Suspense>
  );
}
