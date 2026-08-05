import { PageHeader } from "@/components/admin/ui/PageHeader";
import { SettingsService } from "@/modules/settings/services/settings.service";
import { SettingsForm } from "./SettingsForm";

export default async function SettingsPage() {
  const stats = await SettingsService.getSiteStatsSettings();

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Settings" 
        description="Manage global application settings and configurations."
      />

      <div className="bg-card shadow-sm border border-border/50 rounded-xl overflow-hidden p-6 max-w-2xl">
        <h2 className="text-xl font-heading font-semibold text-foreground mb-4">Site Statistics</h2>
        <p className="text-muted-foreground text-sm mb-6">
          Manage the hardcoded statistics displayed on the Home and About pages.
          Verified Projects and Trusted Developers are automatically calculated from the database.
        </p>
        
        <SettingsForm initialStats={stats} />
      </div>
    </div>
  );
}
