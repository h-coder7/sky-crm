import EmployeesTable from "@/components/dashboard/employees/EmployeesTable";
import StatsCards from "@/components/dashboard/overview/StatsCards";
import SalesTowardsTargets from "@/components/dashboard/overview/SalesTowardsTargets";

export default function DashboardPage() {
  return (
    <div>
      <StatsCards/>
      <EmployeesTable/>
      <SalesTowardsTargets />
    </div>
  );
}
