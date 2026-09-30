"use server";

import { revalidatePath } from 'next/cache';
import { TestimonialsService } from '../services/testimonials.service';
import { 
  CreateTestimonialSubmissionInput, 
  CreateTestimonialInput, 
  UpdateTestimonialInput,
  TestimonialStatus
} from '../types';
import { ensureAdminAuth } from "@/lib/auth/utils";

function formatError(error: any): string {
  let errorMessage = error.message;
  try {
    const parsedError = JSON.parse(error.message);
    if (Array.isArray(parsedError) && parsedError[0]?.message) {
      errorMessage = parsedError.map(err => err.message).join(", ");
    }
  } catch (e) {
    // Not a JSON error, keep original message
  }
  return errorMessage;
}

// --- SUBMISSIONS (PUBLIC) ---
export async function createTestimonialSubmissionAction(input: CreateTestimonialSubmissionInput) {
  try {
    const submission = await TestimonialsService.createSubmission(input);
    revalidatePath('/admin/testimonials/submissions');
    return { success: true, data: submission };
  } catch (error: any) {
    return { success: false, error: formatError(error) };
  }
}

// --- SUBMISSIONS (ADMIN) ---
export async function updateSubmissionStatusAction(id: string, status: TestimonialStatus) {
  try {
    await ensureAdminAuth();
    const submission = await TestimonialsService.updateSubmissionStatus(id, status);
    revalidatePath('/admin/testimonials/submissions');
    return { success: true, data: submission };
  } catch (error: any) {
    return { success: false, error: formatError(error) };
  }
}

export async function publishSubmissionAction(id: string) {
  try {
    const user = await ensureAdminAuth();
    const testimonial = await TestimonialsService.publishSubmission(id, user.id);
    revalidatePath('/admin/testimonials');
    revalidatePath('/admin/testimonials/submissions');
    revalidatePath('/'); // Revalidate public pages where testimonials are shown
    return { success: true, data: testimonial };
  } catch (error: any) {
    return { success: false, error: formatError(error) };
  }
}

// --- TESTIMONIALS (ADMIN) ---
export async function createTestimonialAction(input: CreateTestimonialInput) {
  try {
    const user = await ensureAdminAuth();
    const testimonial = await TestimonialsService.createTestimonial(input, user.id);
    revalidatePath('/admin/testimonials');
    revalidatePath('/');
    return { success: true, data: testimonial };
  } catch (error: any) {
    return { success: false, error: formatError(error) };
  }
}

export async function updateTestimonialAction(input: UpdateTestimonialInput) {
  try {
    const user = await ensureAdminAuth();
    const testimonial = await TestimonialsService.updateTestimonial(input, user.id);
    revalidatePath('/admin/testimonials');
    revalidatePath('/');
    return { success: true, data: testimonial };
  } catch (error: any) {
    return { success: false, error: formatError(error) };
  }
}

export async function deleteTestimonialAction(id: string) {
  try {
    await ensureAdminAuth();
    await TestimonialsService.deleteTestimonial(id);
    revalidatePath('/admin/testimonials');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: formatError(error) };
  }
}
