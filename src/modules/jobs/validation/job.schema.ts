import { z } from 'zod';
import { JobStatus } from '../models/job.model';

export const JobSchema = z.object({
  title: z.string().min(2, "Job title is required"),
  department: z.string().min(2, "Department is required"),
  employment_type: z.string().min(2, "Employment type is required"),
  location: z.string().min(2, "Location is required"),
  experience: z.string().min(1, "Experience is required"),
  salary: z.string().optional(),
  openings: z.coerce.number().min(1, "Openings must be at least 1"),
  description: z.string().optional(),
  requirements: z.string().optional(),
  responsibilities: z.string().optional(),
  benefits: z.string().optional(),
  skills: z.string().optional(),
  status: z.enum(['Draft', 'Published', 'Closed']),
});

export type JobSchemaInput = z.infer<typeof JobSchema>;
