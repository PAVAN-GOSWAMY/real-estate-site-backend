import { createClient } from '@/lib/supabase/server';
import { PropertyFloorPlan, PropertyDocument } from '../types/assets';

// --- Floor Plans ---
function mapFloorPlan(row: any): PropertyFloorPlan {
  return {
    id: row.id,
    propertyId: row.property_id,
    name: row.name,
    floorNumber: row.floor_number,
    configuration: row.configuration,
    area: row.area,
    unit: row.unit,
    imageUrl: row.image_url,
    description: row.description,
    displayOrder: row.display_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getFloorPlans(propertyId: string): Promise<PropertyFloorPlan[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('property_floor_plans')
    .select('*')
    .eq('property_id', propertyId)
    .order('display_order', { ascending: true });

  if (error) throw new Error(`Database Error: ${error.message}`);
  return (data || []).map(mapFloorPlan);
}

export async function getFloorPlanById(id: string): Promise<PropertyFloorPlan | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('property_floor_plans')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // not found
    throw new Error(`Database Error: ${error.message}`);
  }
  return mapFloorPlan(data);
}

export async function insertFloorPlan(payload: any): Promise<PropertyFloorPlan> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('property_floor_plans')
    .insert(payload)
    .select('*')
    .single();

  if (error) throw new Error(`Database Error: ${error.message}`);
  return mapFloorPlan(data);
}

export async function updateFloorPlan(id: string, payload: any): Promise<PropertyFloorPlan> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('property_floor_plans')
    .update(payload)
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw new Error(`Database Error: ${error.message}`);
  return mapFloorPlan(data);
}

export async function deleteFloorPlan(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('property_floor_plans')
    .delete()
    .eq('id', id);

  if (error) throw new Error(`Database Error: ${error.message}`);
}

export async function updateFloorPlanOrders(propertyId: string, updates: { id: string, display_order: number }[]): Promise<void> {
  const supabase = await createClient();
  
  // Basic naive loop since Supabase JS client doesn't support bulk update natively well without RPC
  for (const update of updates) {
    const { error } = await supabase
      .from('property_floor_plans')
      .update({ display_order: update.display_order })
      .eq('id', update.id)
      .eq('property_id', propertyId); // Safety check
      
    if (error) throw new Error(`Database Error: ${error.message}`);
  }
}


// --- Documents ---
function mapDocument(row: any): PropertyDocument {
  return {
    id: row.id,
    propertyId: row.property_id,
    name: row.name,
    documentType: row.document_type,
    fileUrl: row.file_url,
    fileSize: Number(row.file_size),
    version: row.version,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getDocuments(propertyId: string): Promise<PropertyDocument[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('property_documents')
    .select('*')
    .eq('property_id', propertyId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Database Error: ${error.message}`);
  return (data || []).map(mapDocument);
}

export async function getDocumentById(id: string): Promise<PropertyDocument | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('property_documents')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`Database Error: ${error.message}`);
  }
  return mapDocument(data);
}

export async function insertDocument(payload: any): Promise<PropertyDocument> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('property_documents')
    .insert(payload)
    .select('*')
    .single();

  if (error) throw new Error(`Database Error: ${error.message}`);
  return mapDocument(data);
}

export async function updateDocument(id: string, payload: any): Promise<PropertyDocument> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('property_documents')
    .update(payload)
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw new Error(`Database Error: ${error.message}`);
  return mapDocument(data);
}

export async function deleteDocument(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('property_documents')
    .delete()
    .eq('id', id);

  if (error) throw new Error(`Database Error: ${error.message}`);
}
