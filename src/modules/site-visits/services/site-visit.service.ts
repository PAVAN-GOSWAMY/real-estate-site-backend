import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { SiteVisit, SiteVisitStatus } from "@/types/site-visit";

export class SiteVisitService {
  static async createSiteVisit(data: {
    leadId: string;
    propertyId?: string;
    builderId?: string;
    preferredDate: string;
    preferredTime: string;
    visitorsCount: number;
    notes?: string;
  }): Promise<{ data: SiteVisit | null; error: string | null }> {
    const supabase = createAdminClient();

    const { data: result, error } = await supabase
      .from("site_visits")
      .insert({
        lead_id: data.leadId,
        property_id: data.propertyId || null,
        builder_id: data.builderId || null,
        preferred_date: data.preferredDate,
        preferred_time: data.preferredTime,
        visitors_count: data.visitorsCount,
        notes: data.notes || null,
        status: "Pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating site visit:", error);
      return { data: null, error: error.message };
    }

    return { data: this.mapToDomain(result), error: null };
  }

  static async getSiteVisits(): Promise<SiteVisit[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("site_visits")
      .select(`
        *,
        lead:leads(full_name, phone, email),
        property:properties(title, slug),
        builder:builders(name)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching site visits:", error);
      return [];
    }

    return (data || []).map(this.mapToDomain);
  }

  static async updateSiteVisitStatus(
    id: string,
    status: SiteVisitStatus,
    assignedToEmail?: string | null
  ): Promise<boolean> {
    const supabase = await createClient();

    const updateData: any = { status };
    if (assignedToEmail !== undefined) {
      updateData.assigned_to_email = assignedToEmail;
    }

    const { error } = await supabase
      .from("site_visits")
      .update(updateData)
      .eq("id", id);

    if (error) {
      console.error("Error updating site visit status:", error);
      return false;
    }

    return true;
  }

  private static mapToDomain(row: any): SiteVisit {
    return {
      id: row.id,
      leadId: row.lead_id,
      propertyId: row.property_id,
      builderId: row.builder_id,
      preferredDate: row.preferred_date,
      preferredTime: row.preferred_time,
      visitorsCount: row.visitors_count,
      notes: row.notes,
      status: row.status,
      assignedToEmail: row.assigned_to_email,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      lead: row.lead ? {
        fullName: row.lead.full_name,
        phone: row.lead.phone,
        email: row.lead.email,
      } : undefined,
      property: row.property ? {
        title: row.property.title,
        slug: row.property.slug,
      } : undefined,
      builder: row.builder ? {
        name: row.builder.name,
      } : undefined,
    };
  }
}
