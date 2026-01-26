import PageHeader from "@/components/layout/PageHeader";
import DashboardFilters from "@/components/dashboard/overview/DashboardFilters";
import ActivityBreakdownTable from "@/components/dashboard/overview/ActivityBreakdownTable";
import StatsCards from "@/components/dashboard/overview/StatsCards";
import SalesTowardsTargets from "@/components/dashboard/overview/SalesTowardsTargets";
import LeadConversionChart from "@/components/dashboard/overview/LeadConversionChart";

export default function DashboardPage() {
    return (
        <div>
            <PageHeader title="Overview" titleCol="col-lg-4" actionCol="col-lg-8">
                <DashboardFilters />
            </PageHeader>
            <StatsCards />
            <div className="row">
                <div className="col-lg-12">
                    <ActivityBreakdownTable />
                </div>
                <div className="col-lg-12">
                    <LeadConversionChart />
                </div>
            </div>
        </div>
    );
}
