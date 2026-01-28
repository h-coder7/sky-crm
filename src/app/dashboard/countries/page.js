import { Suspense } from "react";
import CountriesClient from "@/components/dashboard/countries/CountriesClient";
import api from "@/app/api/api"; // 🔌 Import your configured axios instance

/**
 * 🎯 Server Component for Countries Page
 */

// Mock data - Replace with API call when backend is ready
const MOCK_COUNTRIES = [
  { id: 1, title: "United Arab Emirates", created_at: "2025-08-31" },
  { id: 2, title: "saudia arabia", created_at: "2021-08-07" },
  { id: 3, title: "Afghanistan", created_at: "2025-08-31" },
  { id: 4, title: "Aland Islands", created_at: "2025-08-31" },
  { id: 5, title: "Albania", created_at: "2025-08-31" },
  { id: 6, title: "Algeria", created_at: "2025-08-31" },
  { id: 7, title: "American Samoa", created_at: "2025-08-31" },
  { id: 8, title: "Andorra", created_at: "2025-08-31" },
  { id: 9, title: "Angola", created_at: "2025-08-31" },
  { id: 10, title: "Anguilla", created_at: "2025-08-31" },
  { id: 11, title: "Antarctica", created_at: "2025-08-31" },
  { id: 12, title: "Antigua and Barbuda", created_at: "2025-08-31" },
  { id: 13, title: "Argentina", created_at: "2025-08-31" },
  { id: 14, title: "Armenia", created_at: "2025-08-31" },
  { id: 15, title: "Aruba", created_at: "2025-08-31" },
  { id: 16, title: "Australia", created_at: "2025-08-31" },
  { id: 17, title: "Austria", created_at: "2025-08-31" },
  { id: 18, title: "Azerbaijan", created_at: "2025-08-31" },
];

export default function CountriesPage() {
  return (
    <Suspense fallback={<div className="d-none">Loading countries...</div>}>
      <CountriesClient initialCountries={MOCK_COUNTRIES} />
    </Suspense>
  );
}
