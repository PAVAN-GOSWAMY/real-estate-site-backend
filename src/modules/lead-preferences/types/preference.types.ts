export interface LeadPreferenceEntity {
  id: string;
  lead_id: string;
  
  location_id: string | null;
  category_id: string | null;
  configuration_id: string | null;
  
  preferred_builder: string | null;
  preferred_project: string | null;
  preferred_tower: string | null;
  
  budget_min: number | null;
  budget_max: number | null;
  
  minimum_area: number | null;
  maximum_area: number | null;
  area_unit: string;
  
  preferred_floor_min: number | null;
  preferred_floor_max: number | null;
  preferred_facing: string | null;
  preferred_bedrooms: number | null;
  preferred_bathrooms: number | null;
  
  preferred_possession_status: string | null;
  preferred_availability: string | null;
  
  parking_required: boolean;
  furnished_required: boolean;
  loan_required: boolean;
  investment_purpose: boolean;
  self_use: boolean;
  
  remarks: string | null;
  is_current: boolean;
  
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  created_by: string | null;
  updated_by: string | null;
}
