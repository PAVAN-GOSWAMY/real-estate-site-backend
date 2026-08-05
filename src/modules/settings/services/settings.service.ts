import { createPublicClient } from "@/lib/supabase/public";
import { createClient } from "@/lib/supabase/server";

export interface SiteStatsSettings {
  happyClients: string;
  yearsExperience: string;
  popularLocations?: string;
}

export class SettingsService {
  static async getSiteStatsSettings(): Promise<SiteStatsSettings> {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'stats')
      .single();

    if (error || !data) {
      // Fallback defaults
      return { 
        happyClients: "2,000+", 
        yearsExperience: "10+",
        popularLocations: "Sector 150, Noida\nSector 128, Noida\nGreater Noida West\nYamuna Expressway"
      };
    }
    
    const settings = data.value as SiteStatsSettings;
    return {
      happyClients: settings.happyClients || "2,000+",
      yearsExperience: settings.yearsExperience || "10+",
      popularLocations: settings.popularLocations ?? "Sector 150, Noida\nSector 128, Noida\nGreater Noida West\nYamuna Expressway"
    };
  }

  static async updateSiteStatsSettings(settings: SiteStatsSettings, userEmail: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
      .from('site_settings')
      .upsert({ 
        key: 'stats', 
        value: settings,
        updated_at: new Date().toISOString(),
        updated_by: userEmail
      }, { onConflict: 'key' });

    if (error) {
      throw new Error(`Failed to update site settings: ${error.message}`);
    }
  }
}
