export interface ProviderCity {
  name: string;
  state?: string;
  country?: string;
  externalId?: string;
  provider: string;
  lat?: number;
  lon?: number;
  confidence: number;
}

export interface CityProvider {
  /**
   * The unique name/identifier of this provider (e.g. "OSM_NOMINATIM")
   */
  name: string;

  /**
   * Search for cities.
   */
  searchCities(query: string): Promise<ProviderCity[]>;
}
