import { SupabaseClient } from "@supabase/supabase-js";
import { AuthenticationError, InternalError } from "../errors/domain.error";
import { Role } from "../constants/roles";

export interface UserSession {
  userId: string;
  email: string;
  role: Role;
  permissions: string[];
}

export class AuthHelper {
  constructor(private readonly supabase: SupabaseClient) {}

  /**
   * Validates the session and retrieves the current authenticated user's profile and permissions.
   */
  async getSession(): Promise<UserSession> {
    const { data: { session }, error: sessionError } = await this.supabase.auth.getSession();

    if (sessionError || !session?.user) {
      throw new AuthenticationError("Invalid or missing session");
    }

    const userId = session.user.id;

    // Fetch the profile to get the user's role
    const { data: profile, error: profileError } = await this.supabase
      .from("profiles")
      .select("user_role")
      .eq("id", userId)
      .single();

    if (profileError || !profile) {
      console.error("[AuthHelper] Error fetching profile:", profileError);
      throw new AuthenticationError("User profile not found");
    }

    // Fetch the role's permissions
    const { data: rolePermissions, error: permissionsError } = await this.supabase
      .from("role_permissions")
      .select("permission:permissions(permission_code)")
      .eq("user_role", profile.user_role);

    if (permissionsError) {
      console.error("[AuthHelper] Error fetching permissions:", permissionsError);
      throw new InternalError("Failed to load user permissions");
    }

    const permissions = rolePermissions.map(rp => (rp.permission as any).permission_code);

    return {
      userId,
      email: session.user.email!,
      role: profile.user_role as Role,
      permissions
    };
  }
}
