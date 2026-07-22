import * as repository from '../repository/property-amenities.repository';

export async function getAmenitiesForProperty(propertyId: string): Promise<string[]> {
  try {
    return await repository.getPropertyAmenityIds(propertyId);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    throw new Error(`Service Error: Failed to fetch property amenities. ${msg}`);
  }
}

export async function savePropertyAmenities(propertyId: string, amenityIds: string[]): Promise<void> {
  try {
    await repository.updatePropertyAmenities(propertyId, amenityIds);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    throw new Error(`Service Error: Failed to save property amenities. ${msg}`);
  }
}
