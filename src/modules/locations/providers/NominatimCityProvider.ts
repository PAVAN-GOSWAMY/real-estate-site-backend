import { CityProvider, ProviderCity } from "./CityProvider";

const NOMINATIM_ENDPOINT = "https://nominatim.openstreetmap.org/search";

export class NominatimCityProvider implements CityProvider {
  name = "OSM_NOMINATIM";

  async searchCities(query: string): Promise<ProviderCity[]> {
    if (!query) return [];

    try {
      const url = new URL(NOMINATIM_ENDPOINT);
      url.searchParams.append("q", query);
      url.searchParams.append("format", "json");
      url.searchParams.append("featuretype", "city");
      url.searchParams.append("addressdetails", "1");
      url.searchParams.append("limit", "10");

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "User-Agent": "RealEstateApp/1.0"
        },
        cache: 'no-store'
      });

      if (!response.ok) {
        throw new Error(`Nominatim API responded with status: ${response.status}`);
      }

      const data = await response.json();
      return this.normalizeProviderResponse(data);
    } catch (error) {
      console.error("NominatimCityProvider Error:", error);
      throw error;
    }
  }

  private normalizeProviderResponse(elements: any[]): ProviderCity[] {
    const cities: ProviderCity[] = [];
    const seenExternalIds = new Set<string>();

    for (const el of elements) {
      if (!el.osm_id) continue;
      
      const externalId = String(el.osm_id);
      if (seenExternalIds.has(externalId)) continue;
      seenExternalIds.add(externalId);

      const name = el.name || el.address?.city || el.address?.town || el.address?.village;
      if (!name) continue;

      const state = el.address?.state;
      const country = el.address?.country;
      
      // Calculate a basic confidence.
      // If it has a bounding box or importance score, use it.
      let confidence = 70;
      if (el.importance) {
        confidence = Math.min(100, Math.round(el.importance * 100) + 20); // Scale up importance
      }

      cities.push({
        name,
        state,
        country,
        externalId,
        provider: this.name,
        lat: el.lat ? parseFloat(el.lat) : undefined,
        lon: el.lon ? parseFloat(el.lon) : undefined,
        confidence
      });
    }

    // Sort by confidence descending
    return cities.sort((a, b) => b.confidence - a.confidence);
  }
}
