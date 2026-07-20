import { SupabaseClient } from "@supabase/supabase-js";
import { BaseService } from "@/lib/services/base/base.service";
import { ImportRepository } from "../repository/import.repository";
import { CreateImportJobDto, GetJobsQueryDto } from "../dto/bulk.dto";
import { importRowSchema } from "../validators/bulk.validator";
import { PropertyService } from "../../properties/service/property.service";
import { CreatePropertyDto } from "../../properties/dto/property.dto";
import { NotFoundError, ValidationError, ConflictError } from "@/lib/errors/domain.error";

export class ImportService extends BaseService {
  private repository: ImportRepository;
  private propertyService: PropertyService;

  constructor(supabase: SupabaseClient) {
    super();
    this.repository = new ImportRepository(supabase);
    this.propertyService = new PropertyService(supabase);
  }

  async previewImport(userId: string, dto: CreateImportJobDto) {
    return this.executeSafe(async () => {
      // 1. Create Staging Job
      const job = await this.repository.createJob(userId, dto.file_name, dto.rows.length);
      await this.repository.updateJobStatus(job.id, 'VALIDATING');

      // 2. Insert rows to Staging
      const rowEntities = dto.rows.map((row, index) => ({
        job_id: job.id,
        row_number: index + 1,
        status: 'PENDING' as any,
        raw_data: row
      }));
      await this.repository.insertRows(rowEntities);

      // 3. Validation Pass (simulate processing the staging table)
      const rows = await this.repository.getRowsByJobId(job.id);
      let successCount = 0;
      let failCount = 0;

      for (const row of rows) {
        try {
          // Schema Validation
          importRowSchema.parse(row.raw_data);
          
          // (In a full implementation, we'd also run Builder/Project ID presence checks here)
          await this.repository.updateRow(row.id, { status: 'VALID' });
          successCount++;
        } catch (err: any) {
          await this.repository.updateRow(row.id, { 
            status: 'INVALID',
            validation_errors: { error: err.message || "Invalid row data" }
          });
          failCount++;
        }
      }

      await this.repository.updateJobStatus(job.id, 'VALIDATED', { success: successCount, failed: failCount });
      return await this.repository.findById(job.id);
    });
  }

  async commitImport(jobId: string) {
    return this.executeSafe(async () => {
      const job = await this.repository.findById(jobId);
      if (!job) throw new NotFoundError("Import Job");
      if (job.status !== 'VALIDATED') throw new ValidationError("Job must be in VALIDATED state to commit.");

      await this.repository.updateJobStatus(job.id, 'COMMITTING');

      const rows = await this.repository.getRowsByJobId(job.id);
      const validRows = rows.filter(r => r.status === 'VALID');

      let committedCount = 0;
      for (const row of validRows) {
        try {
          // We cast raw_data to the creation DTO required by Phase 7.3
          const payload = row.raw_data as any; 
          
          // Using the existing PropertyService ensures ALL business rules (audit, pricing ledgers, inventory states) are obeyed
          const property = await this.propertyService.createProperty(payload);

          await this.repository.updateRow(row.id, { 
            status: 'COMMITTED',
            reference_id: property.id
          });
          committedCount++;
        } catch (err: any) {
          await this.repository.updateRow(row.id, { 
            status: 'INVALID',
            validation_errors: { error: err.message || "Failed during physical commit." }
          });
        }
      }

      const finalStatus = (committedCount === job.total_rows) ? 'COMPLETED' : 
                          (committedCount > 0 ? 'PARTIAL_SUCCESS' : 'FAILED');

      await this.repository.updateJobStatus(job.id, finalStatus, { 
        success: committedCount, 
        failed: job.total_rows - committedCount 
      });

      return await this.repository.findById(job.id);
    });
  }

  async rollbackImport(jobId: string) {
    return this.executeSafe(async () => {
      const job = await this.repository.findById(jobId);
      if (!job) throw new NotFoundError("Import Job");
      if (job.status !== 'COMPLETED' && job.status !== 'PARTIAL_SUCCESS') {
        throw new ValidationError("Only completed or partially successful jobs can be rolled back.");
      }

      const rows = await this.repository.getRowsByJobId(job.id);
      const committedRows = rows.filter(r => r.status === 'COMMITTED' && r.reference_id);

      for (const row of committedRows) {
        try {
          // Hard delete or soft delete. PropertyService.delete() handles it.
          await this.propertyService.deleteProperty(row.reference_id!);
          await this.repository.updateRow(row.id, { status: 'ROLLED_BACK' });
        } catch (err: any) {
          // Log rollback failure
          console.error(`Failed to rollback property ${row.reference_id}`, err);
        }
      }

      await this.repository.updateJobStatus(job.id, 'ROLLED_BACK');
      return await this.repository.findById(job.id);
    });
  }

  async getJobs(query: GetJobsQueryDto) {
    return this.executeSafe(async () => {
      return await this.repository.getJobs(query);
    });
  }

  async getJob(jobId: string) {
    return this.executeSafe(async () => {
      const job = await this.repository.findById(jobId);
      if (!job) throw new NotFoundError("Import Job");
      return job;
    });
  }

  async getErrors(jobId: string) {
    return this.executeSafe(async () => {
      return await this.repository.getErrors(jobId);
    });
  }
}
