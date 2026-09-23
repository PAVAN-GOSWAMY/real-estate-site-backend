"use client";

import Link from "next/link";
import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteBlogAction, publishBlogAction, unpublishBlogAction } from "@/modules/blogs/actions/blogs.actions";
import { Blog } from "@/modules/blogs/types";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function BlogsList({ blogs }: { blogs: Blog[] }) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    const result = await deleteBlogAction(id);
    setIsDeleting(null);
    if (result.success) {
      toast.success("Blog deleted successfully.");
    } else {
      toast.error("Error: " + result.error);
    }
  };

  const handleTogglePublish = async (blog: Blog) => {
    const userId = "temp-user"; 
    let result;
    if (blog.status === "published") {
      result = await unpublishBlogAction(blog.id, userId);
    } else {
      result = await publishBlogAction(blog.id, userId);
    }
    
    if (result.success) {
      toast.success(`Blog ${blog.status === 'published' ? 'unpublished' : 'published'} successfully.`);
    } else {
      toast.error("Error: " + result.error);
    }
  };

  if (!blogs || blogs.length === 0) {
    return <div className="text-center py-10 text-muted-foreground">No blogs found.</div>;
  }

  return (
    <div className="rounded-md border">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-gray-500">Title</th>
            <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
            <th className="px-4 py-3 text-left font-medium text-gray-500">Date</th>
            <th className="px-4 py-3 text-right font-medium text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {blogs.map((blog) => (
            <tr key={blog.id}>
              <td className="px-4 py-3 font-medium">{blog.title}</td>
              <td className="px-4 py-3">
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${blog.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {blog.status}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-500">
                {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : '—'}
              </td>
              <td className="px-4 py-3 text-right space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleTogglePublish(blog)}>
                  {blog.status === 'published' ? 'Unpublish' : 'Publish'}
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/admin/blogs/${blog.id}/edit`}>
                    <Edit className="h-4 w-4" />
                  </Link>
                </Button>
                                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" disabled={isDeleting === blog.id}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure you want to delete this blog?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the blog post.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(blog.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
