export type BulkImportJobStatus = 'UPLOADED' | 'VALIDATING' | 'VALIDATED' | 'COMMITTING' | 'COMPLETED' | 'PARTIAL_SUCCESS' | 'ROLLED_BACK' | 'FAILED';
export type BulkImportRowStatus = 'PENDING' | 'VALID' | 'INVALID' | 'COMMITTED' | 'ROLLED_BACK';
export type BulkExportJobStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface DataImportJobEntity {
  id: string;
  user_id: string;
  status: BulkImportJobStatus;
  file_name: string;
  total_rows: number;
  success_rows: number;
  failed_rows: number;
  created_at: string;
  updated_at: string;
}

export interface DataImportRowEntity {
  id: string;
  job_id: string;
  row_number: number;
  status: BulkImportRowStatus;
  raw_data: Record<string, any>;
  validation_errors: Record<string, any> | null;
  reference_id: string | null;
}

export interface DataExportJobEntity {
  id: string;
  user_id: string;
  status: BulkExportJobStatus;
  filters: Record<string, any> | null;
  file_url: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}
