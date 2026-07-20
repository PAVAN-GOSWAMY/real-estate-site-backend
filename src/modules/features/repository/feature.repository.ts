import { SupabaseClient } from "@supabase/supabase-js";
import { BaseRepository } from "@/lib/repositories/base/base.repository";

// Minimal stub to satisfy property features dependency
export class FeatureRepository extends BaseRepository<any, any, any> {
  constructor(supabase: SupabaseClient) {
    super(supabase, 'property_features'); // The dictionary table
  }
}
