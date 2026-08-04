import { CityProvider } from "./CityProvider";
import { NominatimCityProvider } from "./NominatimCityProvider";

export const cityProviders: Record<string, CityProvider> = {
  OSM_NOMINATIM: new NominatimCityProvider(),
};

export * from "./CityProvider";
export * from "./NominatimCityProvider";
