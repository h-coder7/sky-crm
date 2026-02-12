import { Suspense } from "react";
import CountriesClient from "@/components/dashboard/countries/CountriesClient";
import api from "@/app/api/api"; // 🔌 Import your configured axios instance

/**
 * 🎯 Server Component for Countries Page
 */

// Mock data - Replace with API call when backend is ready
const MOCK_COUNTRIES = [
    { id: 1, title: "United Arab Emirates", country_key: "971", created_at: "2025-08-31" },
    { id: 2, title: "saudia arabia", country_key: "966", created_at: "2021-08-07" },
    { id: 3, title: "Afghanistan", country_key: "93", created_at: "2025-08-31" },
    { id: 4, title: "Aland Islands", country_key: "358", created_at: "2025-08-31" },
    { id: 5, title: "Albania", country_key: "355", created_at: "2025-08-31" },
    { id: 6, title: "Algeria", country_key: "213", created_at: "2025-08-31" },
    { id: 7, title: "American Samoa", country_key: "1684", created_at: "2025-08-31" },
    { id: 8, title: "Andorra", country_key: "376", created_at: "2025-08-31" },
    { id: 9, title: "Angola", country_key: "244", created_at: "2025-08-31" },
    { id: 10, title: "Anguilla", country_key: "1264", created_at: "2025-08-31" },
    { id: 11, title: "Antarctica", country_key: "672", created_at: "2025-08-31" },
    { id: 12, title: "Antigua and Barbuda", country_key: "1268", created_at: "2025-08-31" },
    { id: 13, title: "Argentina", country_key: "54", created_at: "2025-08-31" },
    { id: 14, title: "Armenia", country_key: "374", created_at: "2025-08-31" },
    { id: 15, title: "Aruba", country_key: "297", created_at: "2025-08-31" },
    { id: 16, title: "Australia", country_key: "61", created_at: "2025-08-31" },
    { id: 17, title: "Austria", country_key: "43", created_at: "2025-08-31" },
    { id: 18, title: "Azerbaijan", country_key: "994", created_at: "2025-08-31" },
];

export default function CountriesPage() {
  return (
    <Suspense fallback={<div className="d-none">Loading countries...</div>}>
      <CountriesClient initialCountries={MOCK_COUNTRIES} />
    </Suspense>
  );
}
