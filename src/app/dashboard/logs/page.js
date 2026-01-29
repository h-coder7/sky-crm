import LogsClient from "@/components/dashboard/logs/LogsClient";
import { mockLogs } from "@/components/dashboard/logs/mockData";

export const metadata = {
    title: "Logs | Skybridge CRM",
    description: "Activity logs for Skybridge CRM",
};

export default function LogsPage() {
    return (
        <div className="">
            <LogsClient initialLogs={mockLogs} />
        </div>
    );
}
