import { createClient } from '@/lib/supabase/server';

export async function getPropertyAmenityIds(propertyId: string): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('property_amenities')
    .select('amenity_id')
    .eq('property_id', propertyId);

  if (error) {
    throw new Error(`Database Error: ${error.message}`);
  }

  return (data || []).map(row => row.amenity_id);
}

export async function updatePropertyAmenities(propertyId: string, amenityIds: string[]): Promise<void> {
  const supabase = await createClient();
  
  // To update safely, delete all existing and insert new ones
  // In a real transactional system, we'd use a transaction.
  // Supabase RPC or a simpler two-step process:
  
  const { error: deleteError } = await supabase
    .from('property_amenities')
    .delete()
    .eq('property_id', propertyId);
    
  if (deleteError) {
    throw new Error(`Database Error (Delete): ${deleteError.message}`);
  }
  
  if (amenityIds.length > 0) {
    const payload = amenityIds.map(amenityId => ({
      property_id: propertyId,
      amenity_id: amenityId,
    }));
    
    const { error: insertError } = await supabase
      .from('property_amenities')
      .insert(payload);
      
    if (insertError) {
      throw new Error(`Database Error (Insert): ${insertError.message}`);
    }
  }
}
