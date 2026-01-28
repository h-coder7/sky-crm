import PageHeader from "@/components/layout/PageHeader";
import DashboardFilters from "@/components/dashboard/overview/DashboardFilters";
import ActivityBreakdownTable from "@/components/dashboard/overview/ActivityBreakdownTable";
import StatsCards from "@/components/dashboard/overview/StatsCards";
import SalesTowardsTargets from "@/components/dashboard/overview/SalesTowardsTargets";
import LeadConversionChart from "@/components/dashboard/overview/LeadConversionChart";
import DealsComparisonChart from "@/components/dashboard/overview/DealsComparisonChart";

export default function DashboardPage() {
    return (
        <div>
            <PageHeader title="Overview" icon="fal fa-chart-simple" titleCol="col-lg-4" actionCol="col-lg-8">
                <DashboardFilters />
            </PageHeader>
            <StatsCards />
            <div className="row mb-5">
                <div className="col-lg-8">
                    <LeadConversionChart />
                </div>
                <div className="col-lg-4">
                    <SalesTowardsTargets />
                </div>
                <div className="col-lg-12">
                    <ActivityBreakdownTable />
                </div>
                <div className="col-lg-12">
                    <DealsComparisonChart />
                </div>
            </div>
        </div>
    );
}
