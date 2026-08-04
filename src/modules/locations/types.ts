export type LocationType = 'LOCALITY' | 'SECTOR' | 'AREA' | 'ZONE' | 'VILLAGE' | 'TOWNSHIP' | 'INDUSTRIAL_AREA' | 'TECH_PARK' | 'COMMERCIAL_HUB';

export interface City {
  id: string;
  name: string;
  slug: string;
  state: string;
  country: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Location {
  id: string;
  city_id: string;
  name: string;
  slug: string;
  type: LocationType;
  pincode: string | null;
  external_id?: string | null;
  provider?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CityInput {
  name: string;
  state: string;
  country?: string;
  is_active?: boolean;
}

export interface LocationInput {
  city_id: string;
  name: string;
  type: LocationType;
  pincode?: string;
  external_id?: string;
  provider?: string;
  is_active?: boolean;
}
