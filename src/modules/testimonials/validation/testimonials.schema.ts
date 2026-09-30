import { z } from 'zod';

export const createTestimonialSubmissionSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name cannot exceed 100 characters"),
  email: z.string().email("Invalid email").optional().or(z.literal('')),
  profileImageUrl: z.string().url("Invalid image URL").optional().or(z.literal('')),
  rating: z.number().int().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000, "Message cannot exceed 2000 characters"),
  location: z.string().max(100, "Location cannot exceed 100 characters").optional().or(z.literal('')),
});

export const createTestimonialSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  profileImageUrl: z.string().url().optional().or(z.literal('')),
  rating: z.number().int().min(1).max(5),
  message: z.string().min(10),
  location: z.string().optional().or(z.literal('')),
  source: z.string().optional().or(z.literal('')),
  submissionId: z.string().uuid().optional().or(z.literal('')),
  displayOrder: z.number().int().optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
  adminNotes: z.string().optional().or(z.literal('')),
});

export const updateTestimonialSchema = createTestimonialSchema.partial().extend({
  id: z.string().uuid(),
});

export const updateSubmissionStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(['pending', 'approved', 'rejected']),
});
