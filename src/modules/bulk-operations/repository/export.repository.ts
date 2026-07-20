import { SupabaseClient } from "@supabase/supabase-js";
import { BaseRepository } from "@/lib/repositories/base/base.repository";
import { DataExportJobEntity, BulkExportJobStatus } from "@/types/bulk.types";
import { Modules } from "@/lib/constants/modules";
import { GetJobsQueryDto } from "../dto/bulk.dto";

export class ExportRepository extends BaseRepository<DataExportJobEntity, any, any> {
  constructor(supabase: SupabaseClient) {
    super(supabase, Modules.DATA_EXPORT_JOBS);
  }

  async createJob(userId: string, filters: Record<string, any> | null): Promise<DataExportJobEntity> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .insert({
        user_id: userId,
        filters: filters,
        status: 'PENDING'
      })
      .select()
      .single();

    if (error) this.handleError(error, 'createJob');
    return data;
  }

  async updateJobStatus(jobId: string, status: BulkExportJobStatus, fileUrl?: string, expiresAt?: string): Promise<void> {
    const payload: any = { status, updated_at: new Date().toISOString() };
    if (fileUrl) payload.file_url = fileUrl;
    if (expiresAt) payload.expires_at = expiresAt;

    const { error } = await this.supabase
      .from(this.tableName)
      .update(payload)
      .eq('id', jobId);

    if (error) this.handleError(error, 'updateJobStatus');
  }

  async getJobs(query: GetJobsQueryDto): Promise<{ data: any[]; count: number }> {
    const { page, limit } = query;
    const offset = (page! - 1) * limit!;
    
    const { data, count, error } = await this.supabase
      .from(this.tableName)
      .select('*', { count: 'exact' })
      .range(offset, offset + limit! - 1)
      .order('created_at', { ascending: false });

    if (error) this.handleError(error, 'getJobs');
    return { data: data || [], count: count || 0 };
  }
}
