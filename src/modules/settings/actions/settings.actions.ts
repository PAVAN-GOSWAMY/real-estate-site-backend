"use server";

import { revalidatePath } from "next/cache";
import { SettingsService, SiteStatsSettings } from "../services/settings.service";
import { ensureAdminAuth } from "@/lib/auth/utils";

export async function updateSiteStatsAction(formData: FormData): Promise<void> {
  try {
    const user = await ensureAdminAuth();
    
    const settings: SiteStatsSettings = {
      happyClients: formData.get("happyClients") as string,
      yearsExperience: formData.get("yearsExperience") as string,
      popularLocations: formData.get("popularLocations") as string,
    };

    if (!settings.happyClients || !settings.yearsExperience) {
      throw new Error("Both fields are required.");
    }

    await SettingsService.updateSiteStatsSettings(settings, user.email || "admin@example.com");
    
    // Revalidate paths that show these stats
    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/admin/settings");

  } catch (error: any) {
    console.error("Failed to update site stats:", error);
    throw new Error(error.message || "An unexpected error occurred");
  }
}
