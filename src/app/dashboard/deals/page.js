import DealsClient from "@/components/dashboard/deals/DealsClient";
import api from "@/app/api/api";

/**
 * 🎯 Server Component for Deals Page
 */

// Mock data
const MOCK_DEALS = [
  { 
    id: 1, 
    title: "Project Alpha", 
    description: "Web development project", 
    start_date: "2025-01-01", 
    end_date: "2025-03-01", 
    employee: "Esslam Emad", 
    product: "Next.js App", 
    contact_list: "Tech Leads", 
    company: "Sky Tech", 
    status: "1", // Brief Submitted
    amount: 5000, 
    month: "1", // January
    created_at: "2025-01-10" 
  },
  { 
    id: 2, 
    title: "Project Beta", 
    description: "Marketing campaign", 
    start_date: "2025-02-15", 
    end_date: "2025-04-15", 
    employee: "Sedra Quraid", 
    product: "SEO Bundle", 
    contact_list: "Marketing Managers", 
    company: "InnoSoft", 
    status: "7", // Proposal Submitted
    amount: 3200, 
    month: "2", // February
    created_at: "2025-02-01" 
  },
];

export default function DealsPage() {
  return <DealsClient initialDeals={MOCK_DEALS} />;
}
