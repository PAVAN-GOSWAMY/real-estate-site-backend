import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Blog } from "@/modules/blogs/types";

export function BlogCard({ blog }: { blog: Blog }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-brand-slate/50 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full min-h-[380px]">
      <Link href={`/blog/${blog.slug}`} className="relative h-48 w-full block border-b border-brand-slate/20">
        <Image
          src={blog.coverImage || '/placeholder.jpg'}
          alt={blog.title}
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
        />
      </Link>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-center mb-3">
          <p className="text-xs font-bold text-brand-blue uppercase tracking-wider">
            {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : 'Draft'}
          </p>
          {blog.readingTime && (
            <span className="text-xs font-medium text-brand-blue bg-brand-surface border border-brand-slate/40 px-2.5 py-1 rounded-full">{blog.readingTime} read</span>
          )}
        </div>
        <h3 className="font-bold text-xl text-brand-navy mb-3 line-clamp-2 leading-snug">
          <Link href={`/blog/${blog.slug}`} className="hover:text-brand-red transition-colors">
            {blog.title}
          </Link>
        </h3>
        <p className="text-sm text-brand-navy/70 line-clamp-3 mb-4">
          {blog.excerpt || 'Read this article to learn more...'}
        </p>
        
        <div className="mt-auto pt-4 border-t border-brand-slate/40">
          <Link href={`/blog/${blog.slug}`} className="inline-flex items-center text-[14px] font-bold text-brand-red hover:text-brand-red-hover transition-colors group">
            Read More
            <ArrowRight className="ml-1.5 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
