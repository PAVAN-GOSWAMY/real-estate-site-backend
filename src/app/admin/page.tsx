import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Home, Users, Building2, Briefcase } from 'lucide-react';
import { PageHeader } from '@/components/admin/ui/PageHeader';
import { StatsCard } from '@/components/admin/ui/StatsCard';
import { SectionCard } from '@/components/admin/ui/SectionCard';
import { EmptyState } from '@/components/admin/ui/EmptyState';
import { LeadsService } from '@/modules/leads/services/leads.service';
import Link from 'next/link';
import { format } from 'date-fns';
import { StatusBadge } from '@/components/admin/ui/StatusBadge';

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const crmStats = await LeadsService.getDashboardMetrics();
  const recentLeadsRes = await LeadsService.getLeads({}, 1, 5);
  const recentLeads = recentLeadsRes.leads;

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { count: totalPropertiesCount } = await supabase
    .from('properties')
    .select('*', { count: 'exact', head: true });

  const { count: newPropertiesCount } = await supabase
    .from('properties')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', thirtyDaysAgo.toISOString());

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
          value={(totalPropertiesCount || 0).toString()}
          icon={Home}
          trend={{ value: newPropertiesCount || 0, label: "new this month", isPositive: true }}
        />
        <StatsCard
          title="Total Leads"
          value={crmStats.totalLeads.toString()}
          icon={Users}
          trend={{ value: crmStats.newLeads, label: "new leads pending", isPositive: true }}
        />
        <StatsCard
          title="Today's Follow-ups"
          value={crmStats.todaysFollowUps.toString()}
          icon={Users}
        />
        <StatsCard
          title="Won Leads"
          value={crmStats.wonLeads.toString()}
          icon={Briefcase}
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
          {recentLeads.length === 0 ? (
            <EmptyState 
              title="No recent leads" 
              description="New leads will be displayed here as they come in."
              className="border-0 rounded-none border-t"
            />
          ) : (
            <div className="divide-y divide-border/50">
              {recentLeads.map(lead => (
                <Link key={lead.id} href={`/admin/leads/${lead.id}`} className="block hover:bg-muted/30 transition-colors p-4">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-foreground text-sm">{lead.fullName}</span>
                    <span className="text-xs text-muted-foreground">{format(new Date(lead.createdAt), "MMM d, h:mm a")}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-muted-foreground line-clamp-1">{lead.source} - {lead.propertyName || "General Inquiry"}</span>
                    <StatusBadge status={lead.status} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
