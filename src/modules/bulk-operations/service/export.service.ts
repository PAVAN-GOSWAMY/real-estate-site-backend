import { SupabaseClient } from "@supabase/supabase-js";
import { BaseService } from "@/lib/services/base/base.service";
import { ExportRepository } from "../repository/export.repository";
import { CreateExportJobDto, GetJobsQueryDto } from "../dto/bulk.dto";
import { NotFoundError } from "@/lib/errors/domain.error";

export class ExportService extends BaseService {
  private repository: ExportRepository;

  constructor(supabase: SupabaseClient) {
    super();
    this.repository = new ExportRepository(supabase);
  }

  async createExportJob(userId: string, dto: CreateExportJobDto) {
    return this.executeSafe(async () => {
      const job = await this.repository.createJob(userId, dto.filters || null);
      
      // In a real system, this would trigger a Background Worker (e.g., BullMQ)
      // For this architecture phase, we simulate the async task completion:
      this.simulateExportGeneration(job.id);

      return job;
    });
  }

  private async simulateExportGeneration(jobId: string) {
    // Simulated background generation
    setTimeout(async () => {
      try {
        await this.repository.updateJobStatus(jobId, 'PROCESSING');
        // Simulate reading from Properties, generating CSV, uploading to S3/Supabase Storage
        await new Promise(r => setTimeout(r, 2000));
        
        const fileUrl = `/storage/v1/object/public/exports/properties_export_${jobId}.csv`;
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

        await this.repository.updateJobStatus(jobId, 'COMPLETED', fileUrl, expiresAt.toISOString());
      } catch (err) {
        await this.repository.updateJobStatus(jobId, 'FAILED');
      }
    }, 100); // Trigger almost immediately for demo
  }

  async getJobs(query: GetJobsQueryDto) {
    return this.executeSafe(async () => {
      return await this.repository.getJobs(query);
    });
  }

  async getJob(jobId: string) {
    return this.executeSafe(async () => {
      const job = await this.repository.findById(jobId);
      if (!job) throw new NotFoundError("Export Job");
      return job;
    });
  }
}
