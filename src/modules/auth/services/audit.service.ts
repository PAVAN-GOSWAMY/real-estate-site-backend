import { createClient } from "@/lib/supabase/server";

export type AuditEventType = 'LOGIN' | 'LOGOUT' | 'PASSWORD_RESET_REQUEST' | 'PASSWORD_CHANGED' | 'PROFILE_UPDATED';

export class AuditService {
  static async logEvent(
    eventType: AuditEventType, 
    userId?: string, 
    description?: string,
    req?: Request
  ) {
    try {
      const supabase = await createClient();
      
      // In a real app we'd parse req.headers for ip and user-agent
      // For now we do a best effort or leave null
      const userAgent = req?.headers.get('user-agent') || null;
      const ipAddress = req?.headers.get('x-forwarded-for') || null;

      await supabase.from('audit_logs').insert({
        user_id: userId || null,
        event_type: eventType,
        description: description || null,
        user_agent: userAgent,
        ip_address: ipAddress
      });
    } catch (error) {
      console.error("Failed to write audit log", error);
      // We don't throw here to avoid failing the main action if audit logging fails
    }
  }
}
