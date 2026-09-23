"use client";

import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { BlogCard } from "@/components/blog/BlogCard";
import { Blog, BlogCategory } from "@/modules/blogs/types";
import { motion } from "framer-motion";

interface BlogListingClientProps {
  initialBlogs: Blog[];
  categories: BlogCategory[];
}

export function BlogListingClient({ initialBlogs, categories }: BlogListingClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredBlogs = useMemo(() => {
    return initialBlogs.filter((blog) => {
      const matchesSearch =
        searchQuery === "" ||
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (blog.excerpt && blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        activeCategory === "all" || blog.categoryId === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [initialBlogs, searchQuery, activeCategory]);

  const recentBlogs = initialBlogs.slice(0, 5);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-10">
        
        {/* LEFT SIDEBAR: Categories */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <div className="sticky top-28 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Categories</h3>
            <div className="flex flex-row lg:flex-col flex-wrap gap-2 lg:gap-3">
              <button
                onClick={() => setActiveCategory("all")}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 text-left ${
                  activeCategory === "all"
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-primary"
                }`}
              >
                All Articles
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 text-left ${
                    activeCategory === cat.id
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-primary"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* CENTER CONTENT: Blog Listing Grid */}
        <div className="lg:col-span-2 order-3 lg:order-2">
          {filteredBlogs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16 bg-white rounded-3xl border border-slate-100 shadow-sm"
            >
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">No blogs found</h3>
              <p className="text-slate-500 max-w-md mx-auto">
                We couldn&apos;t find any articles matching your search or category filter. Try adjusting your criteria.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("all");
                }}
                className="mt-6 px-6 py-2 bg-primary/10 text-primary font-semibold rounded-full hover:bg-primary hover:text-white transition-colors"
              >
                Clear Filters
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredBlogs.map((blog, index) => (
                <motion.div
                  key={blog.id}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.5,
                    delay: (index % 4) * 0.1,
                    type: "spring",
                    stiffness: 100,
                  }}
                  className="h-full"
                >
                  <BlogCard blog={blog} />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR: Search & Recent Blogs */}
        <div className="lg:col-span-1 order-1 lg:order-3 space-y-8">
          
          {/* Search Box */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Search</h3>
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors sm:text-sm shadow-sm"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Recent Blogs */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Recent Blogs</h3>
            <div className="space-y-5">
              {recentBlogs.length === 0 ? (
                <p className="text-sm text-slate-500">No recent blogs.</p>
              ) : (
                recentBlogs.map((blog) => (
                  <Link href={`/blog/${blog.slug}`} key={blog.id} className="flex gap-4 group">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={blog.coverImage || '/placeholder.jpg'}
                        alt={blog.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex flex-col justify-center flex-1">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                        {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : 'Draft'}
                      </p>
                      <h4 className="text-sm font-bold text-slate-800 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                        {blog.title}
                      </h4>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
