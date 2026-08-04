import { DashboardProvider } from "./_components/DashboardProvider";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { FiltersBar } from "./_components/FiltersBar";
import { KpiCards } from "./_components/KpiCards";
import { PipelineFunnel } from "./_components/PipelineFunnel";
import { LeadTrendChart } from "./_components/LeadTrendChart";
import { PropertyPerformance } from "./_components/PropertyPerformance";
import { BuilderPerformance } from "./_components/BuilderPerformance";
import { LocalityPerformance } from "./_components/LocalityPerformance";
import { LeadSourceChart } from "./_components/LeadSourceChart";
import { BusinessInsights } from "./_components/BusinessInsights";
import { RecentActivity } from "./_components/RecentActivity";

export const metadata = {
  title: "CRM Analytics Dashboard",
};

export default function CRMDashboardPage() {
  return (
    <DashboardProvider>
      <div className="flex flex-col gap-6 pb-12 max-w-[1600px] mx-auto w-full">
        <PageHeader 
          title="CRM Analytics Dashboard" 
          description="Actionable business intelligence for lead generation and sales performance."
          action={
            <Button variant="outline" asChild>
              <Link href="/admin/leads">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Leads
              </Link>
            </Button>
          }
        />
        
        {/* Filters */}
        <FiltersBar />
        
        {/* KPIs */}
        <KpiCards />

        {/* Primary Analytics (Trends & Pipeline) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <LeadTrendChart />
          <PipelineFunnel />
        </div>

        {/* Secondary Analytics (Sources & Insights) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <LeadSourceChart />
            <BusinessInsights />
          </div>
          <RecentActivity />
        </div>

        {/* Performance Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <PropertyPerformance />
          <BuilderPerformance />
          <LocalityPerformance />
        </div>
      </div>
    </DashboardProvider>
  );
}
