import { z } from "zod";

export const JobApplicationSchema = z.object({
  id: z.string().uuid().optional(),
  job_id: z.string().uuid(),
  first_name: z.string().min(2, "First name is too short"),
  last_name: z.string().min(2, "Last name is too short"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is too short"),
  cover_letter: z.string().optional(),
  resume_url: z.string().url("Must be a valid URL"),
  status: z.enum(["New", "Reviewing", "Shortlisted", "Rejected", "Hired"]).default("New"),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type JobApplication = z.infer<typeof JobApplicationSchema>;

export const CreateJobApplicationSchema = JobApplicationSchema.omit({ 
  id: true, 
  status: true, 
  created_at: true, 
  updated_at: true 
});

export type CreateJobApplication = z.infer<typeof CreateJobApplicationSchema>;
