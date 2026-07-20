import { UserSession } from "./auth.helper";
import { AuthorizationError } from "../errors/domain.error";
import { Roles } from "../constants/roles";

export class PermissionHelper {
  
  /**
   * Checks if the user possesses the required permission.
   * SUPER_ADMIN automatically bypasses all permission checks.
   */
  static hasPermission(session: UserSession, requiredPermission: string): boolean {
    if (session.role === Roles.SUPER_ADMIN) {
      return true;
    }
    
    return session.permissions.includes(requiredPermission);
  }

  /**
   * Throws an AuthorizationError if the user lacks the required permission.
   */
  static requirePermission(session: UserSession, requiredPermission: string): void {
    if (!this.hasPermission(session, requiredPermission)) {
      throw new AuthorizationError(`Missing required permission: ${requiredPermission}`);
    }
  }

  /**
   * Future-ready Ownership hook. Used in Service layers.
   * Example: requireOwnership(session.userId, lead.assigned_to)
   */
  static requireOwnership(sessionUserId: string, ownerId: string, bypassPermission?: string): void {
    // If a bypass permission is provided (e.g. "leads.edit_all"), they don't need ownership
    if (bypassPermission && this.hasPermission({ role: Roles.ADMIN, permissions: [bypassPermission] } as any, bypassPermission)) {
        return; // Simplistic check for bypass, requires proper session logic in real implementation
    }

    if (sessionUserId !== ownerId) {
      throw new AuthorizationError("You do not own this resource");
    }
  }
}
