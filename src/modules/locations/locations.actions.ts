'use server';

import { LocationsService } from './locations.service';
import { ensureAdminAuth } from '@/lib/auth/utils';

export async function getActiveCitiesAction() {
  try {
    return await LocationsService.getActiveCities();
  } catch (error: any) {
    console.error('Failed to get cities:', error);
    return [];
  }
}

export async function getLocationsByCityAction(cityId: string) {
  try {
    return await LocationsService.getLocationsByCity(cityId, true);
  } catch (error: any) {
    console.error('Failed to get locations:', error);
    return [];
  }
}

export async function getPaginatedCitiesAction(page: number, limit: number, filters: any = {}) {
  try {
    return await LocationsService.getPaginatedCities(page, limit, filters);
  } catch (error: any) {
    console.error('Failed to get paginated cities:', error);
    return { cities: [], total: 0 };
  }
}

export async function createCityAction(input: any) {
  try {
    const data = await LocationsService.createCity(input);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateCityAction(id: string, input: any) {
  try {
    const data = await LocationsService.updateCity(id, input);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteCityAction(id: string) {
  try {
    await LocationsService.deleteCity(id);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function toggleCityStatusAction(id: string, isActive: boolean) {
  try {
    const data = await LocationsService.toggleCityStatus(id, isActive);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getPaginatedLocationsAction(page: number, limit: number, filters: any = {}) {
  try {
    return await LocationsService.getPaginatedLocations(page, limit, filters);
  } catch (error: any) {
    console.error('Failed to get paginated locations:', error);
    return { locations: [], total: 0 };
  }
}

export async function createLocationAction(input: any) {
  try {
    await ensureAdminAuth(); // Check permission
    const data = await LocationsService.createLocation(input);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateLocationAction(id: string, input: any) {
  try {
    const data = await LocationsService.updateLocation(id, input);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteLocationAction(id: string) {
  try {
    await LocationsService.deleteLocation(id);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function toggleLocationStatusAction(id: string, isActive: boolean) {
  try {
    const data = await LocationsService.toggleLocationStatus(id, isActive);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
