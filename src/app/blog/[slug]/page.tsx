import { BlogsService } from "@/modules/blogs/services/blogs.service";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { BlogArticleClient } from "./BlogArticleClient";
import Script from "next/script";

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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title,
    "description": blog.seoDescription || blog.excerpt,
    "image": blog.coverImage ? [blog.coverImage] : [],
    "datePublished": blog.publishedAt || blog.createdAt,
    "dateModified": blog.updatedAt,
    "author": [{
      "@type": "Person",
      "name": blog.author?.name || "Square AR Spaces"
    }],
    "publisher": {
      "@type": "Organization",
      "name": "Square AR Spaces",
      "logo": {
        "@type": "ImageObject",
        "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://squarearspaces.com'}/icon.jpg`
      }
    }
  };

  return (
    <>
      <Script
        id={`blog-schema-${blog.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogArticleClient blog={blog} recentBlogs={recentBlogs} relatedBlogs={relatedBlogs} />
    </>
  );
}
