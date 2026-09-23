import { z } from "zod";

export const BlogSectionSchema = z.object({
  heading: z.string().min(1, "Heading is required"),
  description: z.string().min(1, "Description is required"),
});

const emptyToNull = (v: any) => (v === "" ? null : v);

export const CreateBlogSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(255),
  slug: z.string().min(3, "Slug must be at least 3 characters").max(255).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
  categoryId: z.preprocess(emptyToNull, z.string().uuid("Invalid category ID").nullish()),
  status: z.enum(["draft", "published"]).default("draft"),
  excerpt: z.preprocess(emptyToNull, z.string().max(500).nullish()),
  sections: z.array(BlogSectionSchema).nullish(),
  coverImage: z.preprocess(emptyToNull, z.string().url("Must be a valid URL").nullish()),
  readingTime: z.preprocess(emptyToNull, z.string().max(50).nullish()),
  isFeatured: z.boolean().default(false),
  seoTitle: z.preprocess(emptyToNull, z.string().max(255).nullish()),
  seoDescription: z.preprocess(emptyToNull, z.string().max(500).nullish()),
  seoKeywords: z.preprocess((v: any) => (v === "" || v === null ? undefined : v), z.array(z.string()).nullish()),
  publishedAt: z.preprocess(emptyToNull, z.string().datetime().nullish()),
});

export const UpdateBlogSchema = CreateBlogSchema.partial().extend({
  id: z.string().uuid(),
});

export type CreateBlogInputSchema = z.infer<typeof CreateBlogSchema>;
export type UpdateBlogInputSchema = z.infer<typeof UpdateBlogSchema>;
