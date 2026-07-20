import { z } from "zod";
import { 
  createImportJobSchema, 
  createExportJobSchema,
  exportFilterSchema 
} from "../validators/bulk.validator";
import { DataImportJobEntity, DataImportRowEntity, DataExportJobEntity } from "@/types/bulk.types";
import { paginationSchema } from "@/lib/validators/common.validator";

export type CreateImportJobDto = z.infer<typeof createImportJobSchema>;
export type CreateExportJobDto = z.infer<typeof createExportJobSchema>;
export type ExportFilterDto = z.infer<typeof exportFilterSchema>;

export const getJobsQuerySchema = paginationSchema.extend({});
export type GetJobsQueryDto = z.infer<typeof getJobsQuerySchema>;

export interface ImportJobResponseDto extends Omit<DataImportJobEntity, 'created_at' | 'updated_at'> {}
export interface ImportRowResponseDto extends Omit<DataImportRowEntity, ''> {}
export interface ExportJobResponseDto extends Omit<DataExportJobEntity, 'created_at' | 'updated_at'> {}
