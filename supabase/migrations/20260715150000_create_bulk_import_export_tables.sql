-- Phase 7.4.7: Bulk Import & Export Tables
-- Staging Engine to safely parse, validate, and rollback bulk property operations

CREATE TYPE bulk_import_job_status AS ENUM (
  'UPLOADED',
  'VALIDATING',
  'VALIDATED',
  'COMMITTING',
  'COMPLETED',
  'PARTIAL_SUCCESS',
  'ROLLED_BACK',
  'FAILED'
);

CREATE TYPE bulk_import_row_status AS ENUM (
  'PENDING',
  'VALID',
  'INVALID',
  'COMMITTED',
  'ROLLED_BACK'
);

CREATE TYPE bulk_export_job_status AS ENUM (
  'PENDING',
  'PROCESSING',
  'COMPLETED',
  'FAILED'
);

CREATE TABLE data_import_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- The admin performing the import
    status bulk_import_job_status NOT NULL DEFAULT 'UPLOADED',
    
    file_name VARCHAR(255) NOT NULL,
    
    total_rows INTEGER NOT NULL DEFAULT 0,
    success_rows INTEGER NOT NULL DEFAULT 0,
    failed_rows INTEGER NOT NULL DEFAULT 0,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE data_import_jobs IS 'Tracks the overall progress and status of a bulk property import job.';

CREATE TABLE data_import_rows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES data_import_jobs(id) ON DELETE CASCADE,
    
    row_number INTEGER NOT NULL,
    status bulk_import_row_status NOT NULL DEFAULT 'PENDING',
    
    raw_data JSONB NOT NULL,
    validation_errors JSONB,
    
    reference_id UUID, -- Links to the newly created property ID if successfully committed
    
    CONSTRAINT uq_import_job_row UNIQUE(job_id, row_number)
);

COMMENT ON TABLE data_import_rows IS 'Staging area for individual parsed rows before they are physically committed to the properties table.';

CREATE TABLE data_export_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    status bulk_export_job_status NOT NULL DEFAULT 'PENDING',
    
    filters JSONB, -- The query filters used to generate the export
    
    file_url TEXT,
    expires_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE data_export_jobs IS 'Tracks asynchronous generation of large property data exports.';

-- Indexes
CREATE INDEX idx_import_job_user ON data_import_jobs(user_id);
CREATE INDEX idx_import_job_status ON data_import_jobs(status);
CREATE INDEX idx_import_row_job ON data_import_rows(job_id);
CREATE INDEX idx_import_row_status ON data_import_rows(status);
CREATE INDEX idx_export_job_user ON data_export_jobs(user_id);
