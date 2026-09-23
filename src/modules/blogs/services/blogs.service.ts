import { BlogsRepository } from '../repository/blogs.repository';
import { CreateBlogInput, UpdateBlogInput } from '../types';

export class BlogsService {
  
  static async getAllBlogs() {
    return BlogsRepository.getAllBlogs();
  }

  static async getPublishedBlogs() {
    return BlogsRepository.getPublishedBlogs();
  }

  static async getBlogBySlug(slug: string) {
    return BlogsRepository.getBlogBySlug(slug);
  }

  static async getLatestBlogs(limit?: number) {
    return BlogsRepository.getLatestBlogs(limit);
  }

  static async getFeaturedBlogs() {
    return BlogsRepository.getFeaturedBlogs();
  }

  static async getRelatedBlogs(categoryId: string, currentBlogId: string, limit?: number) {
    return BlogsRepository.getRelatedBlogs(categoryId, currentBlogId, limit);
  }

  static async getBlogsByCategory(categorySlug: string) {
    return BlogsRepository.getBlogsByCategory(categorySlug);
  }

  static async searchBlogs(query: string) {
    if (!query || query.trim().length === 0) return [];
    return BlogsRepository.searchBlogs(query);
  }

  static async getCategories() {
    return BlogsRepository.getCategories();
  }

  static async createBlog(input: CreateBlogInput, userId: string) {
    // Basic validation
    if (!input.title || !input.slug) {
      throw new Error("Title and Slug are required.");
    }
    return BlogsRepository.createBlog(input, userId);
  }

  static async updateBlog(input: UpdateBlogInput, userId: string) {
    if (!input.id) {
      throw new Error("Blog ID is required for update.");
    }
    return BlogsRepository.updateBlog(input, userId);
  }

  static async deleteBlog(id: string) {
    return BlogsRepository.deleteBlog(id);
  }

  static async publishBlog(id: string, userId: string) {
    return BlogsRepository.updateBlog({ 
      id, 
      status: 'published', 
      publishedAt: new Date().toISOString() 
    }, userId);
  }

  static async unpublishBlog(id: string, userId: string) {
    return BlogsRepository.updateBlog({ 
      id, 
      status: 'draft' 
    }, userId);
  }
}
