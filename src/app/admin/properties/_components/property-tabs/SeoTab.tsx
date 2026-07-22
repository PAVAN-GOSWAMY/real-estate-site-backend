"use client";

import { useState, useTransition } from "react";
import { Property, UpdatePropertyInput } from "@/modules/properties/types/property";
import { updatePropertyAction } from "@/modules/properties/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { z } from "zod";

const SeoSchema = z.object({
  metaTitle: z.string().max(100).optional().or(z.literal("")),
  metaDescription: z.string().max(255).optional().or(z.literal("")),
});

interface SeoTabProps {
  property: Property;
}

export function SeoTab({ property }: SeoTabProps) {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string>();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError(undefined);
    setErrors({});
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    const payload: Record<string, any> = { ...data };

    ["metaTitle", "metaDescription"].forEach(key => {
      if (payload[key] === "") payload[key] = undefined;
    });

    const result = SeoSchema.safeParse(payload);
    
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
    
    startTransition(async () => {
      try {
        const actionResult = await updatePropertyAction(property.id, result.data as UpdatePropertyInput);
        
        if (actionResult.success) {
          showToast("SEO settings saved successfully.");
        } else {
          setServerError(actionResult.error);
        }
      } catch (error: any) {
        setServerError(error.message || "An unexpected error occurred.");
      }
    });
  };

  return (
    <>
      <form onSubmit={onSubmit} noValidate>
        {serverError && (
          <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md text-sm font-medium mb-6" role="alert">
            {serverError}
          </div>
        )}
        
        <Card>
          <CardHeader>
            <CardTitle>SEO Settings</CardTitle>
            <CardDescription>Search engine optimization configuration for this property.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="metaTitle">Meta Title</Label>
              <Input id="metaTitle" name="metaTitle" defaultValue={property.metaTitle || ""} disabled={isPending} aria-invalid={!!errors.metaTitle} />
              {errors.metaTitle && <p className="text-sm text-destructive">{errors.metaTitle}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="metaDescription">Meta Description</Label>
              <textarea
                id="metaDescription"
                name="metaDescription"
                defaultValue={property.metaDescription || ""}
                disabled={isPending}
                rows={3}
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                aria-invalid={!!errors.metaDescription}
              />
              {errors.metaDescription && <p className="text-sm text-destructive">{errors.metaDescription}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-4 border-t px-6 py-4 bg-muted/50">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save SEO Settings"}
            </Button>
          </CardFooter>
        </Card>
      </form>

      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 rounded-md bg-zinc-900 px-4 py-3 text-sm font-medium text-white shadow-lg transition-all animate-in fade-in slide-in-from-bottom-4">
          {toastMessage}
        </div>
      )}
    </>
  );
}
