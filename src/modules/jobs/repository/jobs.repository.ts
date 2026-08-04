import { createClient } from '@/lib/supabase/server';
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";
import { Job, CreateJobDTO, UpdateJobDTO } from '../models/job.model';

export class JobsRepository {
  static async findAll(activeOnly = false): Promise<Job[]> {
    const supabase = await createClient();
    let query = supabase.from('jobs').select('*').order('created_at', { ascending: false });
    if (activeOnly) {
      query = query.eq('status', 'Published');
    }
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data || [];
  }

  static async findPaginated(page: number, limit: number, filters: any = {}): Promise<{ jobs: Job[], total: number }> {
    const supabase = await createClient();
    const offset = (page - 1) * limit;

    let query = supabase.from('jobs').select('*', { count: 'exact' });

    if (filters.q) {
      query = query.ilike('title', `%${filters.q}%`);
    }
    if (filters.status && filters.status !== 'all') {
      query = query.eq('status', filters.status === 'active' ? 'Published' : filters.status === 'draft' ? 'Draft' : 'Closed');
    }

    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw new Error(error.message);
    return { jobs: data || [], total: count || 0 };
  }

  static async findById(id: string): Promise<Job | null> {
    const supabase = await createClient();
    const { data, error } = await supabase.from('jobs').select('*').eq('id', id).single();
    if (error && error.code !== 'PGRST116') throw new Error(error.message);
    return data;
  }

  static async create(input: CreateJobDTO): Promise<Job> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('jobs')
      .insert(input)
      .select()
      .single();
      
    if (error) throw new Error(error.message);
    return data;
  }

  static async update(id: string, input: UpdateJobDTO): Promise<Job> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('jobs')
      .update(input)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw new Error(error.message);
    return data;
  }

  static async delete(id: string): Promise<void> {
    const supabase = await createClient();
    
    // In future phases, we may want to prevent deleting a job if it has applications,
    // but for now, we'll allow it.
    
    const { error } = await supabase.from('jobs').delete().eq('id', id);
    if (error) throw new Error(error.message);
  }

  static async getCareersStats(): Promise<{ totalJobs: number, activeJobs: number, totalApplications: number, newApplications: number }> {
    const supabase = await createClient();
    const adminSupabase = env.SUPABASE_SERVICE_ROLE_KEY 
      ? createSupabaseClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
      : supabase;

    const [
      { count: totalJobs },
      { count: activeJobs },
      { count: totalApplications },
      { count: newApplications }
    ] = await Promise.all([
      supabase.from('jobs').select('*', { count: 'exact', head: true }),
      supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'Published'),
      adminSupabase.from('job_applications').select('*', { count: 'exact', head: true }),
      adminSupabase.from('job_applications').select('*', { count: 'exact', head: true }).eq('status', 'New')
    ]);

    return {
      totalJobs: totalJobs || 0,
      activeJobs: activeJobs || 0,
      totalApplications: totalApplications || 0,
      newApplications: newApplications || 0
    };
  }
}
