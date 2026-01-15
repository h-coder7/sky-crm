import ActivityBreakdownTable from "@/components/dashboard/employees/ActivityBreakdownTable";
import StatsCards from "@/components/dashboard/overview/StatsCards";
import SalesTowardsTargets from "@/components/dashboard/overview/SalesTowardsTargets";

export default function DashboardPage() {
  return (
    <div>
      <StatsCards/>
      <ActivityBreakdownTable/>
      <SalesTowardsTargets />
    </div>
  );
}
