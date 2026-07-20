import { Users, Building2, MapPin, CalendarCheck } from "lucide-react";
import { DashboardCard } from "@/components/layout/admin/DashboardCard";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground">
          Welcome back to the CRM Admin Portal. Here&apos;s what&apos;s happening today.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard 
          title="Total Leads" 
          value="1,248" 
          icon={<Users className="h-4 w-4" />}
          description="from last month"
          trend={{ value: 12.5, isPositive: true }}
        />
        <DashboardCard 
          title="Active Projects" 
          value="45" 
          icon={<Building2 className="h-4 w-4" />}
          description="currently selling"
        />
        <DashboardCard 
          title="Properties Listed" 
          value="892" 
          icon={<MapPin className="h-4 w-4" />}
          description="from last month"
          trend={{ value: 4.1, isPositive: true }}
        />
        <DashboardCard 
          title="Site Visits Today" 
          value="24" 
          icon={<CalendarCheck className="h-4 w-4" />}
          description="scheduled for today"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
        <div className="col-span-4 rounded-xl border bg-card text-card-foreground shadow h-[400px] flex items-center justify-center bg-gray-50 dark:bg-gray-900/50">
          <p className="text-muted-foreground">Revenue Chart Placeholder</p>
        </div>
        <div className="col-span-3 rounded-xl border bg-card text-card-foreground shadow h-[400px] flex items-center justify-center bg-gray-50 dark:bg-gray-900/50">
          <p className="text-muted-foreground">Recent Activity Placeholder</p>
        </div>
      </div>
    </div>
  );
}
