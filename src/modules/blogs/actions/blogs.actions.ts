"use server";

import { revalidatePath } from 'next/cache';
import { BlogsService } from '../services/blogs.service';
import { CreateBlogInput, UpdateBlogInput } from '../types';
import { ensureAdminAuth } from "@/lib/auth/utils";

export async function createBlogAction(input: CreateBlogInput) {
  try {
    const user = await ensureAdminAuth();
    const blog = await BlogsService.createBlog(input, user.id);
    revalidatePath('/admin/blogs');
    revalidatePath('/blog');
    return { success: true, data: blog };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateBlogAction(input: UpdateBlogInput) {
  try {
    const user = await ensureAdminAuth();
    const blog = await BlogsService.updateBlog(input, user.id);
    revalidatePath('/admin/blogs');
    revalidatePath('/blog');
    revalidatePath(`/blog/${blog.slug}`);
    return { success: true, data: blog };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteBlogAction(id: string) {
  try {
    await BlogsService.deleteBlog(id);
    revalidatePath('/admin/blogs');
    revalidatePath('/blog');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function publishBlogAction(id: string, userId: string) {
  try {
    const blog = await BlogsService.publishBlog(id, userId);
    revalidatePath('/admin/blogs');
    revalidatePath('/blog');
    revalidatePath(`/blog/${blog.slug}`);
    return { success: true, data: blog };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function unpublishBlogAction(id: string, userId: string) {
  try {
    const blog = await BlogsService.unpublishBlog(id, userId);
    revalidatePath('/admin/blogs');
    revalidatePath('/blog');
    revalidatePath(`/blog/${blog.slug}`);
    return { success: true, data: blog };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
