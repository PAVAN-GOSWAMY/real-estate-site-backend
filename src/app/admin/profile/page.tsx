import { PageHeader } from "@/components/admin/ui/PageHeader";
import { ensureAdminAuth } from "@/lib/auth/utils";
import { UserProfileForm } from "./_components/UserProfileForm";

export default async function ProfilePage() {
  const user = await ensureAdminAuth();

  return (
    <div className="space-y-6">
      <PageHeader title="Profile" description="Manage your account settings and credentials." />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Info Card */}
        <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm h-fit">
          <h3 className="font-semibold text-lg text-foreground mb-4">Account Information</h3>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email Address</p>
              <p className="text-base text-foreground mt-1">{user.email}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground">Assigned Role</p>
              <div className="mt-1 inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                {user.role}
              </div>
            </div>
          </div>
        </div>

        {/* Password Reset Form */}
        <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-lg text-foreground mb-4">Change Password</h3>
          <UserProfileForm />
        </div>
      </div>
    </div>
  );
}
