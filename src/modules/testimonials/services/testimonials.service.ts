import { TestimonialsRepository } from '../repository/testimonials.repository';
import { 
  CreateTestimonialSubmissionInput, 
  CreateTestimonialInput, 
  UpdateTestimonialInput,
  TestimonialStatus
} from '../types';
import { 
  createTestimonialSubmissionSchema, 
  createTestimonialSchema, 
  updateTestimonialSchema, 
  updateSubmissionStatusSchema 
} from '../validation/testimonials.schema';

export class TestimonialsService {
  
  // --- SUBMISSIONS (PUBLIC) ---
  static async createSubmission(input: CreateTestimonialSubmissionInput) {
    const validated = createTestimonialSubmissionSchema.parse(input);
    return await TestimonialsRepository.createSubmission(validated);
  }

  // --- SUBMISSIONS (ADMIN) ---
  static async getAllSubmissions() {
    return await TestimonialsRepository.getAllSubmissions();
  }

  static async getSubmissionById(id: string) {
    return await TestimonialsRepository.getSubmissionById(id);
  }

  static async updateSubmissionStatus(id: string, status: TestimonialStatus) {
    const validated = updateSubmissionStatusSchema.parse({ id, status });
    return await TestimonialsRepository.updateSubmissionStatus(validated.id, validated.status);
  }

  static async publishSubmission(submissionId: string, userId: string) {
    const submission = await TestimonialsRepository.getSubmissionById(submissionId);
    if (!submission) throw new Error("Submission not found");

    // Mark submission as approved
    await TestimonialsRepository.updateSubmissionStatus(submissionId, 'approved');

    // Create a public testimonial from the submission
    return await TestimonialsRepository.createTestimonial({
      name: submission.name,
      profileImageUrl: submission.profileImageUrl,
      rating: submission.rating,
      message: submission.message,
      location: submission.location,
      source: 'website',
      submissionId: submission.id,
      isActive: true,
      isFeatured: false,
      displayOrder: 0,
    }, userId);
  }

  // --- TESTIMONIALS (PUBLIC) ---
  static async getActiveTestimonials() {
    return await TestimonialsRepository.getActiveTestimonials();
  }

  // --- TESTIMONIALS (ADMIN) ---
  static async getAllTestimonialsAdmin() {
    return await TestimonialsRepository.getAllTestimonialsAdmin();
  }

  static async getTestimonialById(id: string) {
    return await TestimonialsRepository.getTestimonialById(id);
  }

  static async createTestimonial(input: CreateTestimonialInput, userId: string) {
    const validated = createTestimonialSchema.parse(input);
    return await TestimonialsRepository.createTestimonial(validated, userId);
  }

  static async updateTestimonial(input: UpdateTestimonialInput, userId: string) {
    const validated = updateTestimonialSchema.parse(input);
    return await TestimonialsRepository.updateTestimonial(validated, userId);
  }

  static async deleteTestimonial(id: string) {
    return await TestimonialsRepository.deleteTestimonial(id);
  }
}
