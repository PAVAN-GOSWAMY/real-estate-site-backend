import { Section, Container, SectionHeader, SectionTitle } from "@/components/layout/wrappers";
import { BlogsService } from "@/modules/blogs/services/blogs.service";
import { Metadata } from "next";
import { BlogListingClient } from "./BlogListingClient";

export const metadata: Metadata = {
  title: "Blog | Square AR Spaces",
  description: "Read the latest news, updates, and insights from Square AR Spaces.",
};

export const revalidate = 60; // Revalidate every 60 seconds

export default async function BlogListingPage() {
  // Fetch published blogs and categories concurrently
  const [blogs, categories] = await Promise.all([
    BlogsService.getPublishedBlogs(),
    BlogsService.getCategories(),
  ]);

  return (
    <Section className="bg-brand-surface min-h-screen pt-32 pb-24 overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 -left-64 w-96 h-96 bg-brand-red/10 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-20 -right-64 w-96 h-96 bg-brand-blue/10 rounded-full blur-3xl opacity-50"></div>
      </div>

      <Container className="relative z-10">
        <SectionHeader className="mb-16 text-center max-w-3xl mx-auto">
          <SectionTitle>Our Blog</SectionTitle>
          <p className="text-brand-blue mt-4 text-xl font-medium">Insights, updates, and real estate market trends.</p>
        </SectionHeader>
        
        <BlogListingClient initialBlogs={blogs} categories={categories} />
      </Container>
    </Section>
  );
}
