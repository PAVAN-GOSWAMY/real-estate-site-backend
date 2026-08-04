import { PropertyFloorPlan, PropertyDocument } from "../../properties/types/assets";

export interface PublicAmenityGroup {
  category: string;
  items: { name: string; iconKey: string }[];
}

export interface PublicPropertyMedia {
  url: string;
  isFeatured: boolean;
  displayOrder: number;
  mimeType?: string | null;
}

export interface PublicProperty {
  id: string;
  slug: string;
  title: string;
  propertyCode: string | null;
  builderId: string;
  builderName: string;
  builderLogo: string | null;
  landmark: string | null;
  locality: string;
  locationSlug?: string | null;
  sector: string | null;
  city: string;
  citySlug?: string | null;
  cityId?: string | null;
  locationId?: string | null;
  state: string;
  country: string | null;
  address: string | null;
  pincode: string | null;
  googleMapsUrl: string | null;
  latitude: number | null;
  longitude: number | null;
  price: number | null;
  priceDisplay: string | null;
  propertyType: string;
  status: string;
  bedrooms: number | null;
  bathrooms: number | null;
  carpetArea: number | null;
  possessionDate: string | null;
  reraNumber: string | null;
  isFeatured: boolean;
  isVerified: boolean;
  isPremium: boolean;
  description: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  
  // Joins
  thumbnail: string | null; // Extracted from media where isFeatured=true or first
  images: string[];         // URLs of all images
  
  amenityGroups: PublicAmenityGroup[];
  floorPlans: PropertyFloorPlan[];
  documents: PropertyDocument[];
  
  builderProfile?: {
    name: string;
    slug: string;
    logoUrl: string | null;
    description: string | null;
    establishedYear: number | null;
  };
  shortDescription?: string | null;
}
