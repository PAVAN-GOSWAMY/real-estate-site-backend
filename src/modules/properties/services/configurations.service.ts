import * as repo from '../repository/configurations.repository';
import { PropertyConfiguration, PropertyConfigurationInput } from '../types/configuration';

export async function getPropertyConfigurations(propertyId: string): Promise<PropertyConfiguration[]> {
  return repo.getPropertyConfigurations(propertyId);
}

export async function upsertPropertyConfiguration(
  propertyId: string,
  input: PropertyConfigurationInput
): Promise<PropertyConfiguration> {
  return repo.upsertPropertyConfiguration(propertyId, input);
}

export async function deletePropertyConfiguration(id: string, propertyId: string): Promise<void> {
  return repo.deletePropertyConfiguration(id, propertyId);
}

export async function syncPropertyConfigurations(
  propertyId: string,
  configs: PropertyConfigurationInput[]
): Promise<PropertyConfiguration[]> {
  return repo.syncPropertyConfigurations(propertyId, configs);
}
