"use client";

import { useState } from "react";
import { CreateBuilderSchema } from "@/modules/builders/validation/builder.schema";
import { CreateBuilderInput } from "@/modules/builders/types/builder";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ImageUpload } from "@/components/ui/image-upload";
import { z } from "zod";

// We extend the schema on the client to make slug optional, 
// since the server service will auto-generate it if omitted.
const ClientValidationSchema = CreateBuilderSchema.extend({
  slug: CreateBuilderSchema.shape.slug.optional().or(z.literal("")),
});

export interface BuilderFormProps {
  mode: "create" | "edit";
  initialData?: Partial<CreateBuilderInput>;
  onSubmit: (formData: FormData) => void;
  isPending: boolean;
  submitLabel?: string;
  serverError?: string; // Added to support server error rendering as requested
}

export function BuilderForm({
  mode,
  initialData = {},
  onSubmit,
  isPending,
  submitLabel = "Save",
  serverError,
}: BuilderFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [removeLogo, setRemoveLogo] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    // Construct payload safely
    const payload: Record<string, any> = {
      ...data,
      isFeatured: formData.has("isFeatured"),
      isActive: formData.has("isActive"),
    };

    if (payload.establishedYear) {
      payload.establishedYear = parseInt(payload.establishedYear as string, 10);
    } else {
      payload.establishedYear = undefined;
    }
    
    // Convert empty strings to undefined to match Zod expectations
    ["slug", "description", "headquarters", "website", "email", "phone", "logoUrl"].forEach(key => {
      if (payload[key] === "") payload[key] = undefined;
    });

    // Validate
    const result = ClientValidationSchema.safeParse(payload);
    
    if (!result.success) {
      const formattedErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        if (!formattedErrors[path]) {
          formattedErrors[path] = issue.message;
        }
      });
      setErrors(formattedErrors);
      return;
    }

    // Build the final FormData for the Server Action
    const finalFormData = new FormData();
    finalFormData.append("input", JSON.stringify(result.data));
    
    const logoFile = formData.get("logoFile");
    if (logoFile && (logoFile as File).size > 0) {
      finalFormData.append("logoFile", logoFile);
    }
    
    if (removeLogo) {
      finalFormData.append("removeLogo", "true");
    }

    onSubmit(finalFormData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      {serverError && (
        <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md text-sm font-medium" role="alert">
          {serverError}
        </div>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Core details about the builder. The slug will be auto-generated from the name if left blank.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label>Builder Logo</Label>
            <ImageUpload 
              name="logoFile" 
              defaultValue={initialData.logoUrl} 
              onRemove={() => setRemoveLogo(true)} 
              disabled={isPending}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name <span className="text-destructive">*</span></Label>
              <Input
                id="name"
                name="name"
                defaultValue={initialData.name || ""}
                disabled={isPending}
                placeholder="e.g. Prestige Group"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {errors.name && <p id="name-error" className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug (Optional)</Label>
              <Input
                id="slug"
                name="slug"
                defaultValue={initialData.slug || ""}
                disabled={isPending}
                placeholder="e.g. prestige-group"
                aria-invalid={!!errors.slug}
                aria-describedby={errors.slug ? "slug-error" : undefined}
              />
              {errors.slug && <p id="slug-error" className="text-sm text-destructive">{errors.slug}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              defaultValue={initialData.description || ""}
              disabled={isPending}
              rows={4}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Detailed description of the builder..."
              aria-invalid={!!errors.description}
              aria-describedby={errors.description ? "description-error" : undefined}
            />
            {errors.description && <p id="description-error" className="text-sm text-destructive">{errors.description}</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact & Details</CardTitle>
          <CardDescription>Additional company information and contact details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="establishedYear">Established Year</Label>
              <Input
                id="establishedYear"
                name="establishedYear"
                type="number"
                defaultValue={initialData.establishedYear || ""}
                disabled={isPending}
                placeholder="e.g. 1995"
                aria-invalid={!!errors.establishedYear}
                aria-describedby={errors.establishedYear ? "establishedYear-error" : undefined}
              />
              {errors.establishedYear && <p id="establishedYear-error" className="text-sm text-destructive">{errors.establishedYear}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="headquarters">Headquarters</Label>
              <Input
                id="headquarters"
                name="headquarters"
                defaultValue={initialData.headquarters || ""}
                disabled={isPending}
                placeholder="e.g. Bangalore, India"
                aria-invalid={!!errors.headquarters}
                aria-describedby={errors.headquarters ? "headquarters-error" : undefined}
              />
              {errors.headquarters && <p id="headquarters-error" className="text-sm text-destructive">{errors.headquarters}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                type="url"
                defaultValue={initialData.website || ""}
                disabled={isPending}
                placeholder="https://..."
                aria-invalid={!!errors.website}
                aria-describedby={errors.website ? "website-error" : undefined}
              />
              {errors.website && <p id="website-error" className="text-sm text-destructive">{errors.website}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={initialData.email || ""}
                disabled={isPending}
                placeholder="contact@builder.com"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && <p id="email-error" className="text-sm text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                defaultValue={initialData.phone || ""}
                disabled={isPending}
                placeholder="+91..."
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? "phone-error" : undefined}
              />
              {errors.phone && <p id="phone-error" className="text-sm text-destructive">{errors.phone}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Status & Visibility</CardTitle>
          <CardDescription>Control how and where this builder is displayed.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                defaultChecked={initialData.isActive ?? true}
                disabled={isPending}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="isActive" className="cursor-pointer">Active</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isFeatured"
                name="isFeatured"
                defaultChecked={initialData.isFeatured ?? false}
                disabled={isPending}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="isFeatured" className="cursor-pointer">Featured</Label>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-4 border-t px-6 py-4">
          <Button type="button" variant="outline" disabled={isPending} onClick={() => window.history.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : submitLabel}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
