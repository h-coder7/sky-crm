import ActivityBreakdownTable from "@/components/dashboard/employees/ActivityBreakdownTable";
import StatsCards from "@/components/dashboard/overview/StatsCards";
import SalesTowardsTargets from "@/components/dashboard/overview/SalesTowardsTargets";
import LeadConversionChart from "@/components/dashboard/overview/LeadConversionChart";

export default function DashboardPage() {
  return (
    <div>
      <StatsCards/>
      <div className="row">
        <div className="col-lg-12">
          <ActivityBreakdownTable/>
        </div>
        <div className="col-lg-12">
          <LeadConversionChart />
        </div>
      </div>
    </div>
  );
}
