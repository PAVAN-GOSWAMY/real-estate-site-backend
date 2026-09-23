"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CreateBlogSchema, CreateBlogInputSchema, UpdateBlogInputSchema } from "@/modules/blogs/validation/blogs.schema";
import { z } from "zod";
import { createBlogAction, updateBlogAction } from "@/modules/blogs/actions/blogs.actions";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageUpload } from "@/components/ui/image-upload";
import { createClient } from "@/lib/supabase/client";

interface BlogFormProps {
  initialData?: UpdateBlogInputSchema;
  isEditing?: boolean;
}

export function BlogForm({ initialData, isEditing }: BlogFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const { register, control, handleSubmit, getValues, formState: { errors } } = useForm<any>({
    resolver: zodResolver(CreateBlogSchema),
    defaultValues: initialData || {
      title: "",
      slug: "",
      status: "draft",
      isFeatured: false,
      sections: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "sections",
  });

  const onSubmit = async (data: z.infer<typeof CreateBlogSchema>) => {
    setIsSubmitting(true);
    let finalCoverImage = data.coverImage;

    if (coverFile) {
      const supabase = createClient();
      const fileExt = coverFile.name.split('.').pop();
      const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage.from('blogs').upload(fileName, coverFile);
      
      if (!uploadError) {
        const { data: publicUrlData } = supabase.storage.from('blogs').getPublicUrl(fileName);
        finalCoverImage = publicUrlData.publicUrl;
      } else {
        console.error("Upload error", uploadError);
      }
    }

    const submitData = { ...data, coverImage: finalCoverImage };

    let result;
    if (isEditing && initialData?.id) {
      result = await updateBlogAction({ ...submitData, id: initialData.id });
    } else {
      result = await createBlogAction(submitData);
    }
    
    setIsSubmitting(false);
    
    if (result.success) {
      toast.success(`Blog ${isEditing ? 'updated' : 'created'} successfully.`);
      router.push('/admin/blogs');
    } else {
      toast.error("Error: " + result.error);
    }
  };

  const onError = (errors: any, e: any) => {
    const values = getValues();
    console.error("Form Values:", values);
    const parsed = CreateBlogSchema.safeParse(values);
    console.error("Manual Parse Result:", parsed);
    console.error("Validation Errors:", errors);
    
    if (!parsed.success) {
       toast.error("Manual Parse Error: " + parsed.error.issues.map(i => i.path.join('.') + ' ' + i.message).join(', '));
    } else {
       toast.error("Validation failed but safeParse succeeded. Errors: " + Object.keys(errors).join(', '));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
      
      <div className="space-y-4 rounded-md border p-4 bg-white">
        <h3 className="font-semibold text-lg">General Info</h3>
        
        <div>
          <label className="block text-sm font-medium mb-1">Title <span className="text-red-500">*</span></label>
          <Input {...register("title")} placeholder="Blog Title" />
          {errors.title && <p className="text-red-500 text-xs mt-1">{(errors.title?.message as string)}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Slug <span className="text-red-500">*</span></label>
          <Input {...register("slug")} placeholder="blog-title-slug" />
          {errors.slug && <p className="text-red-500 text-xs mt-1">{(errors.slug?.message as string)}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Excerpt</label>
          <Textarea {...register("excerpt")} placeholder="Short description..." />
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium mb-1">Blog Content (Sections)</label>
          {fields.map((field, index) => (
            <div key={field.id} className="p-4 border rounded-md relative bg-slate-50 space-y-3">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium">Section {index + 1}</h4>
                <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)} className="text-red-500 h-8">
                  Remove
                </Button>
              </div>
              <div>
                <Input {...register(`sections.${index}.heading` as const)} placeholder="Section Heading *" />
                {errors.sections && (errors.sections as any)[index]?.heading && <p className="text-red-500 text-xs mt-1">{((errors.sections as any)[index].heading?.message as string)}</p>}
              </div>
              <div>
                <Textarea {...register(`sections.${index}.description` as const)} placeholder="Section Description *" className="min-h-[100px]" />
                {errors.sections && (errors.sections as any)[index]?.description && <p className="text-red-500 text-xs mt-1">{((errors.sections as any)[index].description?.message as string)}</p>}
              </div>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={() => append({ heading: "", description: "" })} className="w-full">
            + Add Section
          </Button>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Cover Image</label>
          <ImageUpload 
            name="coverImage" 
            defaultValue={initialData?.coverImage} 
            onFileSelect={setCoverFile} 
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="space-y-4 rounded-md border p-4 bg-white">
        <h3 className="font-semibold text-lg">Settings & SEO</h3>
        
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select {...register("status")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox id="isFeatured" {...register("isFeatured")} />
          <label htmlFor="isFeatured" className="text-sm font-medium">Is Featured</label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">SEO Title</label>
          <Input {...register("seoTitle")} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">SEO Description</label>
          <Textarea {...register("seoDescription")} />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Blog'}
        </Button>
      </div>
    </form>
  );
}