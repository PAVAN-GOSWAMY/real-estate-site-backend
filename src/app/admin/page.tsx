import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Home, Users, Building2, Briefcase } from 'lucide-react';
import { PageHeader } from '@/components/admin/ui/PageHeader';
import { StatsCard } from '@/components/admin/ui/StatsCard';
import { SectionCard } from '@/components/admin/ui/SectionCard';
import { EmptyState } from '@/components/admin/ui/EmptyState';

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Dashboard" 
        description={`Welcome back, ${user.email}. Here's an overview of your platform.`}
      />

      {/* Top Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Properties"
          value="124"
          icon={Home}
          trend={{ value: 12, label: "from last month", isPositive: true }}
        />
        <StatsCard
          title="Active Builders"
          value="45"
          icon={Building2}
          trend={{ value: 4, label: "from last month", isPositive: true }}
        />
        <StatsCard
          title="Pending Leads"
          value="89"
          icon={Users}
          trend={{ value: 2, label: "from last month", isPositive: false }}
        />
        <StatsCard
          title="Open Jobs"
          value="12"
          icon={Briefcase}
          trend={{ value: 8, label: "from last month", isPositive: true }}
        />
      </div>

      {/* Overview Sections */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <SectionCard 
          title="Recent Properties" 
          description="Latest properties added to the platform"
          className="col-span-1 lg:col-span-4"
        >
          <EmptyState 
            title="No recent properties" 
            description="You haven't added any properties recently. Once you do, they'll appear here."
            className="border-0 rounded-none border-t"
          />
        </SectionCard>

        <SectionCard 
          title="Recent Leads" 
          description="Latest inquiries from potential clients"
          className="col-span-1 lg:col-span-3"
        >
          <EmptyState 
            title="No recent leads" 
            description="New leads will be displayed here as they come in."
            className="border-0 rounded-none border-t"
          />
        </SectionCard>
      </div>
    </div>
  );
}
