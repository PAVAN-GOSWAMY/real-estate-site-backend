"use server";

import { revalidatePath } from "next/cache";
import { ensureAdminAuth } from "@/lib/auth/utils";
import { CityImportService, CityProviderType } from "../services/city-import.service";

export async function previewCityImportAction(
  query: string,
  provider: CityProviderType
) {
  try {
    await ensureAdminAuth();
    const previewItems = await CityImportService.previewImport(query, provider);
    return { success: true, data: previewItems };
  } catch (error: any) {
    console.error("Action Error - previewCityImportAction:", error);
    return { success: false, error: error.message || "Failed to fetch preview" };
  }
}

export async function executeCityImportAction(
  items: any[]
) {
  try {
    await ensureAdminAuth();
    const result = await CityImportService.executeImport(items);
    
    // Invalidate the cache for cities
    revalidatePath("/admin/locations/cities");
    revalidatePath("/admin/locations");
    
    return { success: true, data: result.stats };
  } catch (error: any) {
    console.error("Action Error - executeCityImportAction:", error);
    return { success: false, error: error.message || "Failed to execute import" };
  }
}
