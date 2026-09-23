import { BlogForm } from "../../_components/BlogForm";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { createClient } from "@/lib/supabase/server";

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: blog, error } = await supabase.from('blogs').select('*').eq('id', id).single();

  if (error || !blog) {
    return <div>Blog not found.</div>;
  }

  // map back to camelCase for the form
  const initialData = {
    id: blog.id,
    title: blog.title,
    slug: blog.slug,
    excerpt: blog.excerpt,
    content: blog.content,
    coverImage: blog.cover_image,
    categoryId: blog.category_id,
    authorId: blog.author_id,
    status: blog.status,
    readingTime: blog.reading_time,
    isFeatured: blog.is_featured,
    seoTitle: blog.seo_title,
    seoDescription: blog.seo_description,
    seoKeywords: blog.seo_keywords,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Blog"
        description="Update an existing blog article."
      />
      <div className="max-w-3xl">
        <BlogForm initialData={initialData as any} isEditing />
      </div>
    </div>
  );
}
