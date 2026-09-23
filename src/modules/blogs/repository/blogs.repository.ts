import { createClient } from '@/lib/supabase/server';
import { Blog, BlogCategory, BlogTag, CreateBlogInput, UpdateBlogInput } from '../types';

function mapToBlog(row: any): Blog {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    
    sections: row.sections,
    coverImage: row.cover_image,
    categoryId: row.category_id,
    authorId: row.author_id,
    status: row.status,
    publishedAt: row.published_at,
    readingTime: row.reading_time,
    isFeatured: row.is_featured,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    seoKeywords: row.seo_keywords,
    createdBy: row.created_by,
    updatedBy: row.updated_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    category: row.blog_categories ? mapToCategory(row.blog_categories) : undefined,
  };
}

function mapToCategory(row: any): BlogCategory {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class BlogsRepository {
  
  static async getAllBlogs() {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('blogs')
      .select('*, blog_categories(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(mapToBlog);
  }

  static async getPublishedBlogs() {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('blogs')
      .select('*, blog_categories(*)')
      .eq('status', 'published')
      .lte('published_at', new Date().toISOString())
      .order('published_at', { ascending: false });

    if (error) throw error;
    return data.map(mapToBlog);
  }

  static async getBlogBySlug(slug: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('blogs')
      .select('*, blog_categories(*)')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return mapToBlog(data);
  }

  static async getLatestBlogs(limit = 4) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('blogs')
      .select('*, blog_categories(*)')
      .eq('status', 'published')
      .lte('published_at', new Date().toISOString())
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data.map(mapToBlog);
  }

  static async getFeaturedBlogs() {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('blogs')
      .select('*, blog_categories(*)')
      .eq('status', 'published')
      .eq('is_featured', true)
      .lte('published_at', new Date().toISOString())
      .order('published_at', { ascending: false });

    if (error) throw error;
    return data.map(mapToBlog);
  }

  static async getRelatedBlogs(categoryId: string, currentBlogId: string, limit = 4) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('blogs')
      .select('*, blog_categories(*)')
      .eq('status', 'published')
      .eq('category_id', categoryId)
      .neq('id', currentBlogId)
      .lte('published_at', new Date().toISOString())
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data.map(mapToBlog);
  }

  static async getBlogsByCategory(categorySlug: string) {
    const supabase = await createClient();
    const { data: category } = await supabase
      .from('blog_categories')
      .select('id')
      .eq('slug', categorySlug)
      .single();

    if (!category) return [];

    const { data, error } = await supabase
      .from('blogs')
      .select('*, blog_categories(*)')
      .eq('status', 'published')
      .eq('category_id', category.id)
      .lte('published_at', new Date().toISOString())
      .order('published_at', { ascending: false });

    if (error) throw error;
    return data.map(mapToBlog);
  }

  static async searchBlogs(query: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('blogs')
      .select('*, blog_categories(*)')
      .eq('status', 'published')
      .lte('published_at', new Date().toISOString())
      .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`)
      .order('published_at', { ascending: false });

    if (error) throw error;
    return data.map(mapToBlog);
  }

  static async getCategories() {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('blog_categories')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) throw error;
    return data.map(mapToCategory);
  }

  static async createBlog(input: CreateBlogInput, userId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('blogs')
      .insert({
        title: input.title,
        slug: input.slug,
        excerpt: input.excerpt,
        
        sections: input.sections,
        cover_image: input.coverImage,
        category_id: input.categoryId,
        author_id: userId,
        status: input.status,
        published_at: input.status === 'published' ? new Date().toISOString() : null,
        reading_time: input.readingTime,
        is_featured: input.isFeatured,
        seo_title: input.seoTitle,
        seo_description: input.seoDescription,
        seo_keywords: input.seoKeywords,
        created_by: userId,
        updated_by: userId,
      })
      .select()
      .single();

    if (error) throw error;
    return mapToBlog(data);
  }

  static async updateBlog(input: UpdateBlogInput, userId: string) {
    const supabase = await createClient();
    
    
            const { data: currentBlog } = await supabase.from('blogs').select('status, published_at').eq('id', input.id).single();
      const updateData: any = { updated_by: userId };
      
      const newStatus = input.status !== undefined ? input.status : currentBlog?.status;

      if (newStatus === 'published') {
        if (!currentBlog?.published_at) {
          updateData.published_at = new Date().toISOString();
        }
      } else if (newStatus === 'draft') {
        updateData.published_at = null;
      }

    if (input.title !== undefined) updateData.title = input.title;
    if (input.slug !== undefined) updateData.slug = input.slug;
    if (input.excerpt !== undefined) updateData.excerpt = input.excerpt;
    
    if (input.sections !== undefined) updateData.sections = input.sections;
    if (input.coverImage !== undefined) updateData.cover_image = input.coverImage;
    if (input.categoryId !== undefined) updateData.category_id = input.categoryId;
    
    if (input.status !== undefined) updateData.status = input.status;
    
    if (input.readingTime !== undefined) updateData.reading_time = input.readingTime;
    if (input.isFeatured !== undefined) updateData.is_featured = input.isFeatured;
    if (input.seoTitle !== undefined) updateData.seo_title = input.seoTitle;
    if (input.seoDescription !== undefined) updateData.seo_description = input.seoDescription;
    if (input.seoKeywords !== undefined) updateData.seo_keywords = input.seoKeywords;

    const { data, error } = await supabase
      .from('blogs')
      .update(updateData)
      .eq('id', input.id)
      .select()
      .single();

    if (error) throw error;
    return mapToBlog(data);
  }

  static async deleteBlog(id: string) {
    const supabase = await createClient();
    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
}
