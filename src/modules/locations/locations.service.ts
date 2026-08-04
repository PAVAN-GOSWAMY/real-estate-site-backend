import { CitiesRepository } from './repository/cities.repository';
import { LocationsRepository } from './repository/locations.repository';
import { City, Location, CityInput, LocationInput } from './types';
import { CitySchema, CreateCityInput, UpdateCityInput } from './validation/city.schema';
import { LocationSchema, CreateLocationInput, UpdateLocationInput } from './validation/location.schema';

export class LocationsService {
  // ==========================================
  // CITIES
  // ==========================================

  static async getPaginatedCities(page: number, limit: number, filters: any = {}) {
    return CitiesRepository.findPaginated(page, limit, filters);
  }

  static async getActiveCities(): Promise<City[]> {
    return CitiesRepository.findAll(true);
  }

  static async getAllCities(): Promise<City[]> {
    return CitiesRepository.findAll(false);
  }

  static async createCity(input: CreateCityInput): Promise<City> {
    const validated = CitySchema.parse(input);
    return CitiesRepository.create(validated);
  }

  static async updateCity(id: string, input: UpdateCityInput): Promise<City> {
    const validated = CitySchema.partial().parse(input);
    return CitiesRepository.update(id, validated);
  }

  static async deleteCity(id: string): Promise<void> {
    await CitiesRepository.delete(id);
  }

  static async toggleCityStatus(id: string, isActive: boolean): Promise<City> {
    return CitiesRepository.update(id, { is_active: isActive });
  }

  // ==========================================
  // LOCATIONS
  // ==========================================

  static async getPaginatedLocations(page: number, limit: number, filters: any = {}) {
    return LocationsRepository.findPaginated(page, limit, filters);
  }

  static async getLocationsByCity(cityId: string, activeOnly = true): Promise<Location[]> {
    if (!cityId) return [];
    return LocationsRepository.findAllByCity(cityId, activeOnly);
  }

  static async createLocation(input: CreateLocationInput): Promise<Location> {
    const validated = LocationSchema.parse(input);
    const city = await CitiesRepository.findById(validated.city_id);
    if (!city) throw new Error("City not found");
    if (!city.is_active) throw new Error("Cannot add location to an inactive city");
    
    // Check for duplicates
    const existingLocations = await LocationsRepository.findAllByCity(city.id, false);
    const isDuplicate = existingLocations.some(l => l.name.toLowerCase() === validated.name.toLowerCase());
    if (isDuplicate) {
      throw new Error("This location already exists.");
    }
    
    return LocationsRepository.create(validated, city.slug);
  }

  static async updateLocation(id: string, input: UpdateLocationInput): Promise<Location> {
    const validated = LocationSchema.partial().parse(input);
    return LocationsRepository.update(id, validated);
  }

  static async deleteLocation(id: string): Promise<void> {
    await LocationsRepository.delete(id);
  }

  static async toggleLocationStatus(id: string, isActive: boolean): Promise<Location> {
    return LocationsRepository.update(id, { is_active: isActive });
  }

  static async validateCityLocation(cityId: string, locationId: string): Promise<boolean> {
    const loc = await LocationsRepository.findById(locationId);
    if (!loc) return false;
    return loc.city_id === cityId && loc.is_active;
  }
}
