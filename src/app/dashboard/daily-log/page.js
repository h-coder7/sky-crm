import DailyLogClient from "@/components/dashboard/daily-log/DailyLogClient";

const MOCK_LOGS = [
  {
    id: 1,
    contact_list: "Mohammad Al Khatibeh",
    date: "2026-01-01",
    employee: "SKB Test",
    objective: "Product launch",
    type: "Phone call",
    estimated_sale: "1000",
    next_contact: "2026-01-28",
    next_action: "Meeting",
    created_at: "2026-01-27",
  }
];

export default function DailyLogPage() {
  return <DailyLogClient initialLogs={MOCK_LOGS} />;
}
