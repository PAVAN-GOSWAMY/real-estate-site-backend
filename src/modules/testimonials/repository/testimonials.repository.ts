import { createClient } from '@/lib/supabase/server';
import { 
  Testimonial, 
  TestimonialSubmission, 
  CreateTestimonialInput, 
  UpdateTestimonialInput,
  CreateTestimonialSubmissionInput,
  TestimonialStatus
} from '../types';

function mapToSubmission(row: any): TestimonialSubmission {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    profileImageUrl: row.profile_image_url,
    rating: row.rating,
    message: row.message,
    location: row.location,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapToTestimonial(row: any): Testimonial {
  return {
    id: row.id,
    name: row.name,
    profileImageUrl: row.profile_image_url,
    rating: row.rating,
    message: row.message,
    location: row.location,
    source: row.source,
    submissionId: row.submission_id,
    displayOrder: row.display_order,
    isFeatured: row.is_featured,
    isActive: row.is_active,
    adminNotes: row.admin_notes,
    reviewedBy: row.reviewed_by,
    reviewedAt: row.reviewed_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class TestimonialsRepository {
  // --- SUBMISSIONS ---
  static async createSubmission(input: CreateTestimonialSubmissionInput) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('testimonial_submissions')
      .insert({
        name: input.name,
        email: input.email,
        profile_image_url: input.profileImageUrl,
        rating: input.rating,
        message: input.message,
        location: input.location,
      })
      .select()
      .single();

    if (error) throw error;
    return mapToSubmission(data);
  }

  static async getAllSubmissions() {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('testimonial_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(mapToSubmission);
  }

  static async getSubmissionById(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('testimonial_submissions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return mapToSubmission(data);
  }

  static async updateSubmissionStatus(id: string, status: TestimonialStatus) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('testimonial_submissions')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return mapToSubmission(data);
  }

  // --- TESTIMONIALS ---
  static async getActiveTestimonials() {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(mapToTestimonial);
  }

  static async getAllTestimonialsAdmin() {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(mapToTestimonial);
  }

  static async getTestimonialById(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return mapToTestimonial(data);
  }

  static async createTestimonial(input: CreateTestimonialInput, userId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('testimonials')
      .insert({
        name: input.name,
        profile_image_url: input.profileImageUrl,
        rating: input.rating,
        message: input.message,
        location: input.location,
        source: input.source,
        submission_id: input.submissionId,
        display_order: input.displayOrder ?? 0,
        is_featured: input.isFeatured ?? false,
        is_active: input.isActive ?? true,
        admin_notes: input.adminNotes,
        reviewed_by: userId,
        reviewed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return mapToTestimonial(data);
  }

  static async updateTestimonial(input: UpdateTestimonialInput, userId: string) {
    const supabase = await createClient();
    const updateData: any = {
      reviewed_by: userId,
      reviewed_at: new Date().toISOString(),
    };

    if (input.name !== undefined) updateData.name = input.name;
    if (input.profileImageUrl !== undefined) updateData.profile_image_url = input.profileImageUrl;
    if (input.rating !== undefined) updateData.rating = input.rating;
    if (input.message !== undefined) updateData.message = input.message;
    if (input.location !== undefined) updateData.location = input.location;
    if (input.source !== undefined) updateData.source = input.source;
    if (input.submissionId !== undefined) updateData.submission_id = input.submissionId;
    if (input.displayOrder !== undefined) updateData.display_order = input.displayOrder;
    if (input.isFeatured !== undefined) updateData.is_featured = input.isFeatured;
    if (input.isActive !== undefined) updateData.is_active = input.isActive;
    if (input.adminNotes !== undefined) updateData.admin_notes = input.adminNotes;

    const { data, error } = await supabase
      .from('testimonials')
      .update(updateData)
      .eq('id', input.id)
      .select()
      .single();

    if (error) throw error;
    return mapToTestimonial(data);
  }

  static async deleteTestimonial(id: string) {
    const supabase = await createClient();
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
}
