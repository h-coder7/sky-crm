import { Suspense } from "react";
import DailyLogClient from "@/components/dashboard/daily-log/DailyLogClient";

// Mock data based on requested fields
const MOCK_DAILY_LOGS = [
  {
    id: 1,
    employee: "Amira Hassan",
    contact_list: "Real Estate Leads",
    job_title: "Sales Manager",
    company: "Sky Bridge",
    date: "2024-03-20",
    type: "Call",
    objective: "Follow up on proposal",
    estimated_sale: "5000",
    contact_status: "Interested",
    next_action: "Schedule Meeting",
    next_contact: "2024-03-25",
    created_at: "2024-03-20"
  },
  {
    id: 2,
    employee: "Ahmed Farouk",
    contact_list: "Software Solutions",
    job_title: "Technical Consultant",
    company: "Tech Global",
    date: "2024-03-21",
    type: "Email",
    objective: "Product Demo",
    estimated_sale: "12000",
    contact_status: "Neutral",
    next_action: "Send Brochure",
    next_contact: "2024-03-24",
    created_at: "2024-03-21"
  }
];

export default function DailyLogPage() {
  return (
    <Suspense fallback={<div className="d-none">Loading daily logs...</div>}>
      <DailyLogClient initialDailyLogs={MOCK_DAILY_LOGS} />
    </Suspense>
  );
}
