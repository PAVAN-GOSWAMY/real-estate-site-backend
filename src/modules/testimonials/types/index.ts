export type TestimonialStatus = 'pending' | 'approved' | 'rejected';

export interface TestimonialSubmission {
  id: string;
  name: string;
  email?: string;
  profileImageUrl?: string;
  rating: number;
  message: string;
  location?: string;
  status: TestimonialStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  profileImageUrl?: string;
  rating: number;
  message: string;
  location?: string;
  source?: string;
  submissionId?: string;
  displayOrder: number;
  isFeatured: boolean;
  isActive: boolean;
  adminNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTestimonialSubmissionInput {
  name: string;
  email?: string;
  profileImageUrl?: string;
  rating: number;
  message: string;
  location?: string;
}

export interface CreateTestimonialInput {
  name: string;
  profileImageUrl?: string;
  rating: number;
  message: string;
  location?: string;
  source?: string;
  submissionId?: string;
  displayOrder?: number;
  isFeatured?: boolean;
  isActive?: boolean;
  adminNotes?: string;
}

export interface UpdateTestimonialInput extends Partial<CreateTestimonialInput> {
  id: string;
}
