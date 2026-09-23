import { BlogForm } from "../_components/BlogForm";
import { PageHeader } from "@/components/admin/ui/PageHeader";

export default function NewBlogPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Create New Blog"
        description="Add a new article to your blog."
      />
      <div className="max-w-3xl">
        <BlogForm />
      </div>
    </div>
  );
}
