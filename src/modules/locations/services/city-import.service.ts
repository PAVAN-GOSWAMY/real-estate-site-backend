import { ProviderCity, cityProviders } from "../providers";
import { CitiesRepository } from "../repository/cities.repository";

export type CityProviderType = "OSM_NOMINATIM";

export interface CityPreviewItem extends ProviderCity {
  action: "IMPORT" | "SKIP" | "CONFLICT";
  reason?: string;
}

export class CityImportService {
  static async previewImport(query: string, providerId: CityProviderType = "OSM_NOMINATIM"): Promise<CityPreviewItem[]> {
    const provider = cityProviders[providerId];
    if (!provider) {
      throw new Error(`Provider ${providerId} not found`);
    }

    // 1. Fetch cities from provider
    const externalCities = await provider.searchCities(query);
    if (!externalCities || externalCities.length === 0) {
      return [];
    }

    // 2. Fetch all local cities for diffing
    const localCities = await CitiesRepository.findAll(false);
    
    // Normalize local cities for comparison
    const localNames = new Set(localCities.map(c => c.name.toLowerCase()));

    // 3. Diff and build preview
    const previewItems: CityPreviewItem[] = [];

    for (const ec of externalCities) {
      const normalizedName = ec.name.trim().toLowerCase();
      
      let action: "IMPORT" | "SKIP" | "CONFLICT" = "IMPORT";
      let reason: string | undefined;

      if (localNames.has(normalizedName)) {
        action = "SKIP";
        reason = "City already exists in database";
      }

      previewItems.push({
        ...ec,
        action,
        reason
      });
    }

    return previewItems;
  }

  static async executeImport(items: CityPreviewItem[]): Promise<{ stats: { imported: number; skipped: number } }> {
    const toImport = items.filter(i => i.action === "IMPORT");
    
    let imported = 0;
    const skipped = items.length - toImport.length;

    for (const item of toImport) {
      try {
        await CitiesRepository.create({
          name: item.name,
          state: item.state || "Unknown",
          country: item.country || "India",
          is_active: true
        });
        imported++;
      } catch (error) {
        console.error(`Failed to import city ${item.name}:`, error);
        // Continue with others even if one fails
      }
    }

    return {
      stats: {
        imported,
        skipped
      }
    };
  }
}
