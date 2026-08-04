"use server";

import { z } from "zod";
import { SiteVisitService } from "../services/site-visit.service";
import { createAdminClient } from "@/lib/supabase/admin";

const scheduleVisitSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^\+?[\d\s-]{10,15}$/, "Invalid phone format"),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  preferredDate: z.string().min(1, "Preferred date is required"),
  preferredTime: z.string().min(1, "Preferred time is required"),
  visitorsCount: z.coerce.number().min(1).default(1),
  notes: z.string().optional(),
  propertyId: z.string().uuid().optional().or(z.literal("")),
  builderId: z.string().uuid().optional().or(z.literal("")),
});

export async function createPublicSiteVisitAction(formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const data = scheduleVisitSchema.parse(rawData);

    // Validate date is not in the past
    const selectedDate = new Date(data.preferredDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      return { success: false, error: "Preferred date cannot be in the past" };
    }

    const supabase = createAdminClient();
    let leadId: string | null = null;

    // 1. Search for existing lead by phone (or email)
    let query = supabase.from("leads").select("id").eq("phone", data.phone);
    
    // Fallback search by email if provided
    if (data.email) {
      query = query.or(`email.eq.${data.email}`);
    }

    const { data: existingLeads, error: searchError } = await query.limit(1);

    if (searchError) {
      console.error("Error searching for lead:", searchError);
      return { success: false, error: "Database error while verifying customer." };
    }

    if (existingLeads && existingLeads.length > 0) {
      leadId = existingLeads[0].id;
    } else {
      // 2. Create new lead if none exists
      const { data: newLead, error: createError } = await supabase
        .from("leads")
        .insert({
          full_name: data.fullName,
          phone: data.phone,
          email: data.email || null,
          source: "Site Visit Request",
          status: "Site Visit Scheduled",
          property_id: data.propertyId || null,
          builder_id: data.builderId || null,
        })
        .select("id")
        .single();

      if (createError || !newLead) {
        console.error("Error creating lead:", createError);
        return { success: false, error: "Failed to create customer record." };
      }
      
      leadId = newLead.id;
    }

    if (!leadId) {
      return { success: false, error: "Failed to resolve customer record." };
    }

    // 3. Create Site Visit Record
    const result = await SiteVisitService.createSiteVisit({
      leadId: leadId,
      propertyId: data.propertyId || undefined,
      builderId: data.builderId || undefined,
      preferredDate: data.preferredDate,
      preferredTime: data.preferredTime,
      visitorsCount: data.visitorsCount,
      notes: data.notes || undefined,
    });

    if (result.error) {
      return { success: false, error: result.error };
    }

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: (error as any).errors[0].message };
    }
    console.error("Site visit action error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
