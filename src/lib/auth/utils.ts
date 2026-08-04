import { createClient } from "@/lib/supabase/server";

export type AdminRole = 'Super Admin' | 'Admin' | 'Sales Executive';

export interface AdminUser {
  id: string;
  email: string;
  role: AdminRole;
}

export async function ensureAdminAuth(): Promise<AdminUser> {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Unauthorized: Admin authentication required.");
  }

  // Fetch user role
  const { data: roleData, error: roleError } = await supabase
    .from('admin_roles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  if (roleError) {
    console.error(`[Authorization Error] [${new Date().toISOString()}] Failed to fetch role for user ${user.id} (${user.email}):`, roleError.message || roleError);
    throw new Error("Database error during role resolution.");
  }

  if (!roleData || !roleData.role) {
    console.error(`[Authorization Error] [${new Date().toISOString()}] No role mapping found for user ${user.id} (${user.email}).`);
    throw new Error("User role not found.");
  }

  const role = roleData.role as AdminRole;

  return {
    id: user.id,
    email: user.email!,
    role
  };
}

export async function ensureRole(allowedRoles: AdminRole[]): Promise<AdminUser> {
  const user = await ensureAdminAuth();
  
  if (!allowedRoles.includes(user.role)) {
    throw new Error(`Forbidden: Requires one of [${allowedRoles.join(', ')}]`);
  }

  return user;
}
