"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronRight,  Link as LinkIcon, Share2 } from "lucide-react";
import { BlogCard } from "@/components/blog/BlogCard";
import { Blog } from "@/modules/blogs/types";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface BlogArticleClientProps {
  blog: Blog;
  recentBlogs: Blog[];
  relatedBlogs: Blog[];
}

export function BlogArticleClient({ blog, recentBlogs, relatedBlogs }: BlogArticleClientProps) {
  const [activeSection, setActiveSection] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const plugin = React.useRef(
    Autoplay({ delay: 4500, stopOnInteraction: true })
  );

  // Generate safe IDs for sections
  const sections = blog.sections || [];
  const sectionIds = sections.map((s, i) => `section-${i}-${s.heading?.replace(/\s+/g, '-').toLowerCase()}`);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100; // Offset for sticky header
      
      let current = "";
      for (let i = 0; i < sectionIds.length; i++) {
        const element = document.getElementById(sectionIds[i]);
        if (element && element.offsetTop <= scrollPosition) {
          current = sectionIds[i];
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sectionIds]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#faf9f6] min-h-screen pt-28 pb-20">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center text-sm font-medium text-slate-500 mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-slate-800 line-clamp-1">{blog.title}</span>
        </nav>

        {/* Article Header */}
        <div className="max-w-4xl mx-auto text-center mb-10">
          {blog.category && (
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-bold tracking-wide uppercase mb-6">
              {blog.category.name}
            </span>
          )}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-8">
            {blog.title}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-slate-500">
            {blog.authorId && (
              <>
                <span className="text-slate-800 font-bold">Admin</span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
              </>
            )}
            <span>{blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Draft'}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
            <span>{blog.readingTime || '5 min read'}</span>
          </div>
        </div>

        {/* Featured Image */}
        {blog.coverImage && (
          <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-3xl overflow-hidden mb-16 shadow-lg border border-slate-100">
            <Image
              src={blog.coverImage}
              alt={blog.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Content (Left) */}
          <div className="lg:col-span-8">
            {sections && sections.length > 0 && (
              <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100">
                {sections.map((section, idx) => (
                <div key={idx} id={sectionIds[idx]} className="mb-12 last:mb-0">
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
                    {section.heading}
                  </h2>
                  <div 
                    className="prose prose-lg prose-slate max-w-none prose-p:leading-relaxed prose-a:text-primary hover:prose-a:text-primary/80"
                    dangerouslySetInnerHTML={{ __html: section.description.replace(/\n/g, '<br/>') }} 
                  />
                </div>
              ))}
              </div>
            )}

            {/* Social Sharing */}
            <div className="mt-12 flex items-center justify-between py-6 border-t border-b border-slate-200">
              <span className="font-bold text-slate-800">Share this article:</span>
              <div className="flex gap-3">
                <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(blog.title)}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-[#1DA1F2] hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                </a>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-[#4267B2] hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
                <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(blog.title + " " + currentUrl)}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-[#25D366] hover:text-white transition-colors">
                  <Share2 className="w-5 h-5" />
                </a>
                <button onClick={copyToClipboard} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors relative" title="Copy link">
                  <LinkIcon className="w-5 h-5" />
                  {copied && <span className="absolute -top-8 bg-slate-800 text-white text-xs py-1 px-2 rounded">Copied!</span>}
                </button>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* In This Article */}
            {sections.length > 0 && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-28">
                <h3 className="text-lg font-bold text-slate-900 mb-4">In This Article</h3>
                <ul className="space-y-3">
                  {sections.map((section, idx) => (
                    <li key={idx}>
                      <a 
                        href={`#${sectionIds[idx]}`}
                        className={`block text-sm transition-colors ${activeSection === sectionIds[idx] ? 'text-primary font-bold' : 'text-slate-600 hover:text-primary'}`}
                      >
                        {section.heading}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recent Blogs */}
            {recentBlogs.length > 0 && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-[calc(7rem+100px+1rem)]">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Blogs</h3>
                <div className="space-y-5">
                  {recentBlogs.map((rBlog) => (
                    <Link href={`/blog/${rBlog.slug}`} key={rBlog.id} className="flex gap-4 group">
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={rBlog.coverImage || '/placeholder.jpg'}
                          alt={rBlog.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex flex-col justify-center flex-1">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                          {rBlog.publishedAt ? new Date(rBlog.publishedAt).toLocaleDateString() : 'Draft'}
                        </p>
                        <h4 className="text-sm font-bold text-slate-800 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                          {rBlog.title}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Blogs Carousel */}
        {relatedBlogs.length > 0 && (
          <div className="mt-24 pt-16 border-t border-slate-200">
            <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">Related Articles</h2>
            
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              plugins={[plugin.current]}
              className="w-full relative group"
              onMouseEnter={plugin.current.stop}
              onMouseLeave={plugin.current.reset}
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {relatedBlogs.map((rBlog, index) => (
                  <CarouselItem key={rBlog.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, x: index % 2 === 0 ? -20 : 20 }}
                      whileInView={{ opacity: 1, scale: 1, x: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{
                        duration: 0.6,
                        delay: (index % 3) * 0.1,
                        type: "spring",
                        stiffness: 100,
                      }}
                      className="h-full py-4"
                    >
                      <BlogCard blog={rBlog} />
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              
              <div className="flex items-center justify-between mt-8 px-2">
                <CarouselPrevious className="relative inset-0 translate-y-0 h-12 w-12 bg-white border border-slate-200 text-slate-600 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 shadow-sm disabled:opacity-50" />
                <div className="flex-1 text-center hidden md:block">
                  <span className="text-sm font-semibold text-slate-400 tracking-wider uppercase">Swipe to explore</span>
                </div>
                <CarouselNext className="relative inset-0 translate-y-0 h-12 w-12 bg-white border border-slate-200 text-slate-600 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 shadow-sm disabled:opacity-50" />
              </div>
            </Carousel>
          </div>
        )}
      </div>
    </div>
  );
}
