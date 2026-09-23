"use client";

import { BlogCard } from "./BlogCard";
import { Blog } from "@/modules/blogs/types";

export function RelatedArticles({ blogs }: { blogs: Blog[] }) {
  // A simple grid for related articles
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {blogs.map((blog) => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </div>
  );
}
