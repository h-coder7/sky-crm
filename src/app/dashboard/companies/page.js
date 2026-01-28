import { Suspense } from "react";
import CompaniesClient from "@/components/dashboard/companies/CompaniesClient";
import api from "@/app/api/api"; // 🔌 Import your configured axios instance

/**
 * 🎯 Server Component for Companies Page
 */

// Mock data - Provided by user
const MOCK_COMPANIES = [
  {
    id: 1,
    title: "Ministry of Defense",
    address: "Abu dhabi",
    description: "They are Defense and Military",
    domain: "https://mod.gov.ae/",
    sector: "Defense & Security",
    country: "United Arab Emirates",
    created_at: "2026-01-26"
  },
  {
    id: 2,
    title: "Tawazun",
    address: "Abu dhabi",
    description: "Military and defense entity",
    domain: "",
    sector: "Defense & Security",
    country: "United Arab Emirates",
    created_at: "2026-01-26"
  },
  {
    id: 3,
    title: "L3 Harris",
    address: "Marina Park AD",
    description: "U.S. defense firm building secure comms and tech.",
    domain: "https://www.l3harris.com/en-ae/uae?regional_redire...",
    sector: "Defense & Security",
    country: "United Arab Emirates",
    created_at: "2026-01-26"
  },
];

export default function CompaniesPage() {
  return (
    <Suspense fallback={<div>Loading companies...</div>}>
      <CompaniesClient initialCompanies={MOCK_COMPANIES} />
    </Suspense>
  );
}
