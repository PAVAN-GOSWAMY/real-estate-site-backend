import * as repository from '../repository/amenity.repository';
import { Amenity, CreateAmenityInput, UpdateAmenityInput } from '../types/amenity';

export async function getActiveAmenities(): Promise<Amenity[]> {
  try {
    return await repository.listActiveAmenities();
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    throw new Error(`Service Error: Failed to list amenities. ${msg}`);
  }
}

export async function getAllAmenities(): Promise<Amenity[]> {
  try {
    return await repository.listAllAmenities();
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    throw new Error(`Service Error: Failed to list amenities. ${msg}`);
  }
}

export async function getAmenityById(id: string): Promise<Amenity | null> {
  try {
    return await repository.getAmenityById(id);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    throw new Error(`Service Error: Failed to get amenity. ${msg}`);
  }
}

export async function createAmenity(input: CreateAmenityInput): Promise<Amenity> {
  try {
    return await repository.createAmenity(input);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    throw new Error(`Service Error: Failed to create amenity. ${msg}`);
  }
}

export async function updateAmenity(id: string, input: UpdateAmenityInput): Promise<Amenity> {
  try {
    return await repository.updateAmenity(id, input);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    throw new Error(`Service Error: Failed to update amenity. ${msg}`);
  }
}

export async function deactivateAmenity(id: string): Promise<Amenity> {
  try {
    return await repository.updateAmenity(id, { isActive: false });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    throw new Error(`Service Error: Failed to deactivate amenity. ${msg}`);
  }
}
