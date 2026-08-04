'use server';

import { JobsRepository } from '../repository/jobs.repository';
import { ensureRole } from '@/lib/auth/utils';
import { CreateJobDTO, UpdateJobDTO } from '../models/job.model';
import { revalidatePath } from 'next/cache';
import { ApplicationsRepository } from '../repository/applications.repository';
import { sendEmail } from '@/lib/email';

const ALLOWED_ROLES = ['Super Admin', 'Admin'] as const;

export async function getPaginatedJobsAction(page: number, limit: number, filters: any = {}) {
  try {
    await ensureRole(ALLOWED_ROLES as any);
    return await JobsRepository.findPaginated(page, limit, filters);
  } catch (error: any) {
    console.error('Failed to get paginated jobs:', error);
    return { jobs: [], total: 0 };
  }
}

export async function createJobAction(input: CreateJobDTO) {
  try {
    await ensureRole(ALLOWED_ROLES as any);
    const data = await JobsRepository.create(input);
    revalidatePath('/admin/jobs');
    revalidatePath('/career');
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateJobAction(id: string, input: UpdateJobDTO) {
  try {
    await ensureRole(ALLOWED_ROLES as any);
    const data = await JobsRepository.update(id, input);
    revalidatePath('/admin/jobs');
    revalidatePath('/career');
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteJobAction(id: string) {
  try {
    await ensureRole(ALLOWED_ROLES as any);
    await JobsRepository.delete(id);
    revalidatePath('/admin/jobs');
    revalidatePath('/career');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function submitJobApplicationAction(formData: FormData) {
  try {
    const file = formData.get('resume') as File | null;
    if (!file) {
      return { success: false, error: 'Resume is required.' };
    }

    // 1. Upload resume to Supabase Storage
    const uploadResult = await ApplicationsRepository.uploadResume(file);
    if (!uploadResult.url) {
      return { success: false, error: uploadResult.error || 'Failed to upload resume.' };
    }

    // 2. Save application to DB
    const applicationData = {
      job_id: formData.get('job_id') as string,
      first_name: formData.get('first_name') as string,
      last_name: formData.get('last_name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      cover_letter: formData.get('cover_letter') as string | undefined,
      resume_url: uploadResult.url,
    };

    const { data, error } = await ApplicationsRepository.create(applicationData);
    if (error) {
      return { success: false, error };
    }

    // 3. Send Email Notification
    const jobTitle = formData.get('job_title') as string;
    
    // Notify HR / Admin
    const hrEmail = process.env.RESEND_FROM_EMAIL || 'admin@example.com';
    await sendEmail({
      to: hrEmail,
      subject: `New Job Application: ${jobTitle}`,
      html: `
        <h2>New Application Received</h2>
        <p><strong>Job:</strong> ${jobTitle}</p>
        <p><strong>Applicant:</strong> ${applicationData.first_name} ${applicationData.last_name}</p>
        <p><strong>Email:</strong> ${applicationData.email}</p>
        <p><strong>Phone:</strong> ${applicationData.phone}</p>
        <br/>
        <p>You can view the full application and resume in the Admin Dashboard.</p>
      `,
    });

    // Notify Applicant
    await sendEmail({
      to: applicationData.email,
      subject: `Application Received - ${jobTitle}`,
      html: `
        <p>Hi ${applicationData.first_name},</p>
        <p>Thank you for applying for the <strong>${jobTitle}</strong> position at Square AR Spaces.</p>
        <p>We have received your application and our team will review it shortly. If your profile matches our requirements, we will be in touch!</p>
        <br/>
        <p>Best regards,</p>
        <p>Square AR Spaces Careers Team</p>
      `,
    });

    return { success: true };
  } catch (error: any) {
    console.error("Submission error:", error);
    return { success: false, error: error.message || 'An unexpected error occurred.' };
  }
}

export async function getPaginatedApplicationsAction(page: number, limit: number, filters: any = {}) {
  try {
    await ensureRole(ALLOWED_ROLES as any);
    return await ApplicationsRepository.getPaginated(page, limit, filters);
  } catch (error: any) {
    console.error('Failed to get paginated applications:', error);
    return { applications: [], total: 0 };
  }
}

export async function updateApplicationStatusAction(id: string, status: string) {
  try {
    await ensureRole(ALLOWED_ROLES as any);
    await ApplicationsRepository.updateStatus(id, status);
    revalidatePath('/admin/applications');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteApplicationAction(id: string) {
  try {
    await ensureRole(ALLOWED_ROLES as any);
    await ApplicationsRepository.delete(id);
    revalidatePath('/admin/applications');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getResumeUrlAction(path: string) {
  try {
    await ensureRole(ALLOWED_ROLES as any);
    const url = await ApplicationsRepository.getResumeSignedUrl(path);
    return { success: true, url };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getCareersStatsAction() {
  try {
    await ensureRole(ALLOWED_ROLES as any);
    return await JobsRepository.getCareersStats();
  } catch (error: any) {
    console.error('Failed to get careers stats:', error);
    return {
      totalJobs: 0,
      activeJobs: 0,
      totalApplications: 0,
      newApplications: 0
    };
  }
}
