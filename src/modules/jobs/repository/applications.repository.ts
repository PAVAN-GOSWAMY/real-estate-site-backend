import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";
import { CreateJobApplication, JobApplication } from "../models/application.model";

export class ApplicationsRepository {
  static async create(application: CreateJobApplication): Promise<{ data: JobApplication | null; error: string | null }> {
    // We use the admin client to bypass RLS and check for duplicates securely
    if (env.SUPABASE_SERVICE_ROLE_KEY) {
      console.log("Service role key found, checking for duplicate application:", application.email, application.job_id);
      const adminClient = createSupabaseClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
      const { data: existingApps, error: checkError } = await adminClient
        .from("job_applications")
        .select("id")
        .eq("job_id", application.job_id)
        .ilike("email", application.email)
        .limit(1);

      console.log("Duplicate check result:", { existingApps, checkError });

      if (existingApps && existingApps.length > 0) {
        console.log("Duplicate found! Blocking application.");
        return { data: null, error: "You have already applied for this position." };
      }
    } else {
      console.log("WARNING: SUPABASE_SERVICE_ROLE_KEY is not defined in env. Skipping duplicate check.");
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from("job_applications")
      .insert(application);

    if (error) {
      if (error.code === '23505') {
        return { data: null, error: "You have already applied for this position." };
      }
      console.error("Error creating job application:", error);
      return { data: null, error: error.message };
    }

    return { data: null, error: null };
  }

  static async uploadResume(file: File): Promise<{ url: string | null; error: string | null }> {
    const supabase = await createClient();
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `resumes/${fileName}`; // Put inside a folder if needed, but bucket is "resumes"

    const { data, error } = await supabase.storage
      .from("resumes")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Error uploading resume:", error);
      return { url: null, error: error.message };
    }

    // Since it's a private bucket, we can't get a public URL. 
    // We store the internal path, and Admins can generate a signed URL to view it later.
    return { url: data.path, error: null };
  }

  static async getPaginated(
    page: number, 
    limit: number, 
    filters: { jobId?: string; status?: string } = {}
  ): Promise<{ applications: any[]; total: number }> {
    const supabase = env.SUPABASE_SERVICE_ROLE_KEY 
      ? createSupabaseClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
      : await createClient();

    let query = supabase
      .from('job_applications')
      .select('*, jobs!inner(title, department)', { count: 'exact' });

    if (filters.jobId && filters.jobId !== 'all') {
      query = query.eq('job_id', filters.jobId);
    }
    
    if (filters.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      console.error('Error fetching applications:', error);
      throw error;
    }

    return {
      applications: data || [],
      total: count || 0,
    };
  }

  static async updateStatus(id: string, status: string): Promise<void> {
    const supabase = env.SUPABASE_SERVICE_ROLE_KEY 
      ? createSupabaseClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
      : await createClient();
      
    const { error } = await supabase
      .from('job_applications')
      .update({ status })
      .eq('id', id);

    if (error) {
      throw error;
    }
  }

  static async delete(id: string): Promise<void> {
    const supabase = env.SUPABASE_SERVICE_ROLE_KEY 
      ? createSupabaseClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
      : await createClient();
      
    // Optionally delete the resume from storage here if needed, 
    // but typically cascades or periodic cleanup handle it. Let's just delete the row.
    const { error } = await supabase
      .from('job_applications')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting application:', error);
      throw error;
    }
  }

  static async getResumeSignedUrl(path: string): Promise<string> {
    const supabase = env.SUPABASE_SERVICE_ROLE_KEY 
      ? createSupabaseClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
      : await createClient();
      
    const { data, error } = await supabase.storage
      .from('resumes')
      .createSignedUrl(path, 60); // 60 seconds expiry

    if (error || !data) {
      console.error('Error creating signed URL:', error);
      throw new Error(error?.message || 'Failed to create signed URL');
    }

    return data.signedUrl;
  }
}
