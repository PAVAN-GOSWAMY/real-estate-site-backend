import { SupabaseClient } from "@supabase/supabase-js";
import { Modules } from "@/lib/constants/modules";
import { BaseRepository } from "@/lib/repositories/base/base.repository";

// Minimal stub to satisfy project towers dependency
export class ProjectRepository extends BaseRepository<any, any, any> {
  constructor(supabase: SupabaseClient) {
    super(supabase, Modules.PROJECTS);
  }
}
