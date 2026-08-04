"use server";

import { revalidatePath } from "next/cache";
import { SiteVisitService } from "../services/site-visit.service";
import { SiteVisitStatus } from "@/types/site-visit";
import { createClient } from "@/lib/supabase/server";

export async function updateSiteVisitStatusAction(id: string, status: SiteVisitStatus) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const success = await SiteVisitService.updateSiteVisitStatus(id, status);

    if (success) {
      revalidatePath("/admin/site-visits");
      return { success: true };
    } else {
      return { success: false, error: "Failed to update status." };
    }
  } catch (error) {
    console.error("Update site visit error:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}
