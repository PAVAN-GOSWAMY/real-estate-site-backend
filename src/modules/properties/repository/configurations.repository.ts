import { createClient } from '@/lib/supabase/server';
import { PropertyConfiguration, PropertyConfigurationInput } from '../types/configuration';

export function mapConfiguration(row: any): PropertyConfiguration {
  return {
    id: row.id,
    propertyId: row.property_id,
    configurationType: row.configuration_type,
    bedrooms: row.bedrooms !== null && row.bedrooms !== undefined ? Number(row.bedrooms) : null,
    bathrooms: row.bathrooms !== null && row.bathrooms !== undefined ? Number(row.bathrooms) : null,
    balconies: row.balconies !== null && row.balconies !== undefined ? Number(row.balconies) : null,
    parkingSlots: row.parking_slots !== null && row.parking_slots !== undefined ? Number(row.parking_slots) : null,
    superBuiltUpArea: row.super_built_up_area !== null && row.super_built_up_area !== undefined ? Number(row.super_built_up_area) : null,
    carpetArea: row.carpet_area !== null && row.carpet_area !== undefined ? Number(row.carpet_area) : null,
    floorNumber: row.floor_number !== null && row.floor_number !== undefined ? Number(row.floor_number) : null,
    totalFloors: row.total_floors !== null && row.total_floors !== undefined ? Number(row.total_floors) : null,
    facing: row.facing || null,
    possessionDate: row.possession_date || null,
    constructionStatus: row.construction_status || null,
    basePrice: row.base_price !== null && row.base_price !== undefined ? Number(row.base_price) : null,
    priceDisplay: row.price_display || null,
    availability: row.availability || 'AVAILABLE',
    displayOrder: row.display_order ?? 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getPropertyConfigurations(propertyId: string): Promise<PropertyConfiguration[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('property_configurations')
    .select('*')
    .eq('property_id', propertyId)
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(`Database Error: ${error.message}`);
  }

  return (data || []).map(mapConfiguration);
}

export async function getPropertyConfigurationById(id: string): Promise<PropertyConfiguration | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('property_configurations')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`Database Error: ${error.message}`);
  }

  return data ? mapConfiguration(data) : null;
}

export async function upsertPropertyConfiguration(
  propertyId: string,
  input: PropertyConfigurationInput
): Promise<PropertyConfiguration> {
  const supabase = await createClient();

  const payload: any = {
    property_id: propertyId,
    configuration_type: input.configurationType,
    bedrooms: input.bedrooms ?? null,
    bathrooms: input.bathrooms ?? null,
    balconies: input.balconies ?? null,
    parking_slots: input.parkingSlots ?? null,
    super_built_up_area: input.superBuiltUpArea ?? null,
    carpet_area: input.carpetArea ?? null,
    floor_number: input.floorNumber ?? null,
    total_floors: input.totalFloors ?? null,
    facing: input.facing || null,
    possession_date: input.possessionDate || null,
    construction_status: input.constructionStatus || null,
    base_price: input.basePrice ?? null,
    price_display: input.priceDisplay || null,
    availability: input.availability || 'AVAILABLE',
    display_order: input.displayOrder ?? 0,
  };

  let resultData: any;

  if (input.id) {
    const { data, error } = await supabase
      .from('property_configurations')
      .update(payload)
      .eq('id', input.id)
      .eq('property_id', propertyId)
      .select()
      .single();

    if (error) throw new Error(`Database Error - Failed to update configuration: ${error.message}`);
    resultData = data;
  } else {
    const { data, error } = await supabase
      .from('property_configurations')
      .insert(payload)
      .select()
      .single();

    if (error) throw new Error(`Database Error - Failed to insert configuration: ${error.message}`);
    resultData = data;
  }

  // Sync parent property summary fields for backward compatibility
  await syncParentPropertySummary(propertyId);

  return mapConfiguration(resultData);
}

export async function deletePropertyConfiguration(id: string, propertyId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('property_configurations')
    .delete()
    .eq('id', id)
    .eq('property_id', propertyId);

  if (error) throw new Error(`Database Error - Failed to delete configuration: ${error.message}`);

  // Re-sync parent summary
  await syncParentPropertySummary(propertyId);
}

export async function syncPropertyConfigurations(
  propertyId: string,
  configs: PropertyConfigurationInput[]
): Promise<PropertyConfiguration[]> {
  const supabase = await createClient();

  // 1. Get existing configurations
  const existing = await getPropertyConfigurations(propertyId);
  const existingIds = new Set(existing.map(c => c.id));
  const keepIds = new Set(configs.map(c => c.id).filter(Boolean) as string[]);

  // 2. Delete configurations that were removed
  for (const item of existing) {
    if (!keepIds.has(item.id)) {
      await supabase
        .from('property_configurations')
        .delete()
        .eq('id', item.id)
        .eq('property_id', propertyId);
    }
  }

  // 3. Upsert current configurations
  const results: PropertyConfiguration[] = [];
  for (let idx = 0; idx < configs.length; idx++) {
    const c = configs[idx];
    const saved = await upsertPropertyConfiguration(propertyId, {
      ...c,
      displayOrder: idx,
    });
    results.push(saved);
  }

  // 4. Sync parent property
  await syncParentPropertySummary(propertyId);

  return results;
}

/**
 * Synchronizes the parent `properties` table with summary information
 * derived from its active `property_configurations`.
 */
export async function syncParentPropertySummary(propertyId: string): Promise<void> {
  const supabase = await createClient();
  const { data: configs, error } = await supabase
    .from('property_configurations')
    .select('*')
    .eq('property_id', propertyId)
    .order('display_order', { ascending: true });

  if (error || !configs) return;

  const configTypes = configs.map(c => c.configuration_type).filter(Boolean);

  // Extract lowest bedroom count
  const bedroomCounts = configs
    .map(c => c.bedrooms)
    .filter((b): b is number => typeof b === 'number' && b > 0);
  const lowestBedrooms = bedroomCounts.length > 0 ? Math.min(...bedroomCounts) : null;

  // Extract lowest base price
  const basePrices = configs
    .map(c => Number(c.base_price))
    .filter((p): p is number => !isNaN(p) && p > 0);
  const minBasePrice = basePrices.length > 0 ? Math.min(...basePrices) : null;

  // Extract lowest carpet area
  const carpetAreas = configs
    .map(c => Number(c.carpet_area))
    .filter((a): a is number => !isNaN(a) && a > 0);
  const minCarpetArea = carpetAreas.length > 0 ? Math.min(...carpetAreas) : null;

  // Extract lowest super builtup area
  const superBuiltupAreas = configs
    .map(c => Number(c.super_built_up_area))
    .filter((a): a is number => !isNaN(a) && a > 0);
  const minSuperBuiltup = superBuiltupAreas.length > 0 ? Math.min(...superBuiltupAreas) : null;

  const updatePayload: any = {
    configurations: configTypes,
  };

  if (lowestBedrooms !== null) {
    updatePayload.bedrooms = lowestBedrooms;
  }
  if (minBasePrice !== null) {
    updatePayload.price = minBasePrice;
  }
  if (minCarpetArea !== null) {
    updatePayload.carpet_area = minCarpetArea;
  }
  if (minSuperBuiltup !== null) {
    updatePayload.super_builtup_area = minSuperBuiltup;
  }

  await supabase
    .from('properties')
    .update(updatePayload)
    .eq('id', propertyId);
}
