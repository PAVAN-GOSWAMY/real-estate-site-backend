import { SupabaseClient } from "@supabase/supabase-js";
import { BaseRepository } from "@/lib/repositories/base/base.repository";
import { DataImportJobEntity, DataImportRowEntity, BulkImportJobStatus, BulkImportRowStatus } from "@/types/bulk.types";
import { Modules } from "@/lib/constants/modules";
import { GetJobsQueryDto } from "../dto/bulk.dto";

export class ImportRepository extends BaseRepository<DataImportJobEntity, any, any> {
  constructor(supabase: SupabaseClient) {
    super(supabase, Modules.DATA_IMPORT_JOBS);
  }

  async createJob(userId: string, fileName: string, totalRows: number): Promise<DataImportJobEntity> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .insert({
        user_id: userId,
        file_name: fileName,
        total_rows: totalRows,
        status: 'UPLOADED'
      })
      .select()
      .single();

    if (error) this.handleError(error, 'createJob');
    return data;
  }

  async updateJobStatus(jobId: string, status: BulkImportJobStatus, counts?: { success?: number, failed?: number }): Promise<void> {
    const payload: any = { status, updated_at: new Date().toISOString() };
    if (counts?.success !== undefined) payload.success_rows = counts.success;
    if (counts?.failed !== undefined) payload.failed_rows = counts.failed;

    const { error } = await this.supabase
      .from(this.tableName)
      .update(payload)
      .eq('id', jobId);

    if (error) this.handleError(error, 'updateJobStatus');
  }

  async insertRows(rows: Partial<DataImportRowEntity>[]): Promise<void> {
    // Supabase supports bulk inserts directly
    const { error } = await this.supabase
      .from(Modules.DATA_IMPORT_ROWS)
      .insert(rows);

    if (error) this.handleError(error, 'insertRows');
  }

  async updateRow(rowId: string, payload: Partial<DataImportRowEntity>): Promise<void> {
    const { error } = await this.supabase
      .from(Modules.DATA_IMPORT_ROWS)
      .update(payload)
      .eq('id', rowId);

    if (error) this.handleError(error, 'updateRow');
  }

  async getRowsByJobId(jobId: string): Promise<DataImportRowEntity[]> {
    const { data, error } = await this.supabase
      .from(Modules.DATA_IMPORT_ROWS)
      .select('*')
      .eq('job_id', jobId)
      .order('row_number', { ascending: true });

    if (error) this.handleError(error, 'getRowsByJobId');
    return data || [];
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

  async getErrors(jobId: string): Promise<DataImportRowEntity[]> {
    const { data, error } = await this.supabase
      .from(Modules.DATA_IMPORT_ROWS)
      .select('*')
      .eq('job_id', jobId)
      .in('status', ['INVALID', 'FAILED'])
      .order('row_number', { ascending: true });

    if (error) this.handleError(error, 'getErrors');
    return data || [];
  }
}
