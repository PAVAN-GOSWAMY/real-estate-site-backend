export type JobStatus = 'Draft' | 'Published' | 'Closed';

export interface Job {
  id: string;
  title: string;
  department: string;
  employment_type: string;
  location: string;
  experience: string;
  salary?: string | null;
  openings: number;
  description?: string | null;
  requirements?: string | null;
  responsibilities?: string | null;
  benefits?: string | null;
  skills?: string | null;
  status: JobStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateJobDTO {
  title: string;
  department: string;
  employment_type: string;
  location: string;
  experience: string;
  salary?: string;
  openings: number;
  description?: string;
  requirements?: string;
  responsibilities?: string;
  benefits?: string;
  skills?: string;
  status: JobStatus;
}

export type UpdateJobDTO = Partial<CreateJobDTO>;
