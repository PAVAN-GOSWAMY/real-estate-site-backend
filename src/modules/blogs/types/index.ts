export type BlogStatus = 'draft' | 'published';

export interface BlogSection {
  heading: string;
  description: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  
  sections?: BlogSection[] | null;
  coverImage?: string | null;
  categoryId?: string | null;
  authorId?: string;
  
  status: BlogStatus;
  publishedAt?: string | null;
  readingTime?: string | null;
  isFeatured: boolean;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string[] | null;
  createdBy?: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
  category?: BlogCategory;
  author?: any;
  tags?: BlogTag[];
}

export interface CreateBlogInput {
  title: string;
  slug: string;
  excerpt?: string | null;
  
  sections?: BlogSection[] | null;
  coverImage?: string | null;
  categoryId?: string | null;
  
  status: BlogStatus;
  publishedAt?: string | null;
  readingTime?: string | null;
  isFeatured?: boolean;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string[] | null;
}

export interface UpdateBlogInput extends Partial<CreateBlogInput> {
  id: string;
}