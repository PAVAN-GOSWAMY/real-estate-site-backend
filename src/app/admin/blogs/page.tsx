import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ensureAdminAuth } from "@/lib/auth/utils";
import { BlogsService } from "@/modules/blogs/services/blogs.service";
import { BlogsList } from "./_components/BlogsList";
import { PageHeader } from "@/components/admin/ui/PageHeader";

export const dynamic = 'force-dynamic';

export default async function BlogsPage() {
  await ensureAdminAuth();
  const blogs = await BlogsService.getAllBlogs();
  
  
  return (
    <div className="space-y-6">
      <PageHeader
        title="Blogs"
        description="Manage all blog posts, guides, and articles."
        action={
          <Button asChild>
            <Link href="/admin/blogs/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Blog
            </Link>
          </Button>
        }
      />
      
      <BlogsList blogs={blogs} />
      
    </div>
  );
}
