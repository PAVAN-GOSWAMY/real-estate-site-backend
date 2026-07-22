import * as repository from '../repository/amenity.repository';
import { Amenity } from '../types/amenity';

export async function getActiveAmenities(): Promise<Amenity[]> {
  try {
    return await repository.listActiveAmenities();
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    throw new Error(`Service Error: Failed to list amenities. ${msg}`);
  }
}
