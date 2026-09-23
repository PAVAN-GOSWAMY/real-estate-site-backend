import { BlogsService } from "@/modules/blogs/services/blogs.service";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { BlogArticleClient } from "./BlogArticleClient";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await Promise.resolve(params);
  const blog = await BlogsService.getBlogBySlug(slug);
  
  if (!blog || blog.status !== 'published') return { title: 'Not Found' };
  
  return {
    title: blog.seoTitle || `${blog.title} | Square AR Spaces`,
    description: blog.seoDescription || blog.excerpt || "Read this article on Square AR Spaces",
  };
}

export default async function SingleBlogPage({ params }: Props) {
  const { slug } = await Promise.resolve(params);
  const blog = await BlogsService.getBlogBySlug(slug);

  // Prevent draft blogs from being publicly viewed
  if (!blog || blog.status !== 'published') {
    notFound();
  }

  // Fetch all published blogs to construct related & recent blogs
  const allBlogs = await BlogsService.getPublishedBlogs();
  
  // Recent blogs (excluding current)
  const recentBlogs = allBlogs.filter(b => b.id !== blog.id).slice(0, 3);
  
  // Related blogs (same category if available, otherwise just other blogs)
  let relatedBlogs = allBlogs.filter(b => b.id !== blog.id && b.categoryId === blog.categoryId);
  if (relatedBlogs.length === 0) {
    relatedBlogs = allBlogs.filter(b => b.id !== blog.id);
  }

  return <BlogArticleClient blog={blog} recentBlogs={recentBlogs} relatedBlogs={relatedBlogs} />;
}
