"use client";

import { useState, useTransition } from "react";
import { Property, UpdatePropertyInput } from "@/modules/properties/types/property";
import { Builder } from "@/modules/builders/types/builder";
import { PropertyStatus, PropertyType, PropertyAvailability } from "@/modules/properties/types/enums";
import { updatePropertyAction } from "@/modules/properties/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { z } from "zod";

const BasicInfoSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  slug: z.string().optional().or(z.literal("")),
  builderId: z.string().uuid("Please select a builder"),
  propertyType: z.nativeEnum(PropertyType),
  status: z.nativeEnum(PropertyStatus),
  availability: z.nativeEnum(PropertyAvailability),
  shortDescription: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  reraNumber: z.string().optional().or(z.literal("")),
});

interface BasicInfoTabProps {
  property: Property;
  builders: Builder[];
}

export function BasicInfoTab({ property, builders }: BasicInfoTabProps) {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string>();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [builderId, setBuilderId] = useState(property.builderId);
  const [propertyType, setPropertyType] = useState<PropertyType>(property.propertyType);
  const [status, setStatus] = useState<PropertyStatus>(property.status);
  const [availability, setAvailability] = useState<PropertyAvailability>(property.availability);

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
    
    const payload: Record<string, any> = {
      ...data,
      builderId,
      propertyType,
      status,
      availability,
      isFeatured: formData.has("isFeatured"),
      isVerified: formData.has("isVerified"),
      isPremium: formData.has("isPremium"),
    };

    const textFields = ["slug", "shortDescription", "description", "reraNumber"];
    textFields.forEach(key => {
      if (payload[key] === "") payload[key] = undefined;
    });

    const result = BasicInfoSchema.safeParse(payload);
    
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
        const fullPayload = {
          ...result.data,
          isFeatured: payload.isFeatured,
          isVerified: payload.isVerified,
          isPremium: payload.isPremium,
        } as UpdatePropertyInput;
        
        const actionResult = await updatePropertyAction(property.id, fullPayload);
        
        if (actionResult.success) {
          showToast("Basic Information saved successfully.");
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
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Core details, descriptions, and builder association.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="title">Property Title <span className="text-destructive">*</span></Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={property.title}
                  disabled={isPending}
                  aria-invalid={!!errors.title}
                />
                {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug (Optional)</Label>
                <Input
                  id="slug"
                  name="slug"
                  defaultValue={property.slug}
                  disabled={isPending}
                  aria-invalid={!!errors.slug}
                />
                {errors.slug && <p className="text-sm text-destructive">{errors.slug}</p>}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="reraNumber">RERA Number (Optional)</Label>
                <Input
                  id="reraNumber"
                  name="reraNumber"
                  placeholder="e.g. PRM/KA/RERA/1251/446/PR/190809/002766"
                  defaultValue={property.reraNumber || ""}
                  disabled={isPending}
                  aria-invalid={!!errors.reraNumber}
                />
                {errors.reraNumber && <p className="text-sm text-destructive">{errors.reraNumber}</p>}
              </div>

              <div className="space-y-2">
                <Label>Builder <span className="text-destructive">*</span></Label>
                <Select value={builderId} onValueChange={setBuilderId} disabled={isPending}>
                  <SelectTrigger aria-invalid={!!errors.builderId}>
                    <SelectValue placeholder="Select a builder" />
                  </SelectTrigger>
                  <SelectContent>
                    {builders.map(b => (
                      <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.builderId && <p className="text-sm text-destructive">{errors.builderId}</p>}
              </div>

              <div className="space-y-2">
                <Label>Property Type <span className="text-destructive">*</span></Label>
                <Select value={propertyType} onValueChange={(val: PropertyType) => setPropertyType(val)} disabled={isPending}>
                  <SelectTrigger aria-invalid={!!errors.propertyType}>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(PropertyType).map(t => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.propertyType && <p className="text-sm text-destructive">{errors.propertyType}</p>}
              </div>

              <div className="space-y-2">
                <Label>Status <span className="text-destructive">*</span></Label>
                <Select value={status} onValueChange={(val: PropertyStatus) => setStatus(val)} disabled={isPending}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(PropertyStatus).map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Availability <span className="text-destructive">*</span></Label>
                <Select value={availability} onValueChange={(val: PropertyAvailability) => setAvailability(val)} disabled={isPending}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select availability" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(PropertyAvailability).map(a => (
                      <SelectItem key={a} value={a}>{a.replace('_', ' ')}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-6 md:col-span-2 pt-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    name="isFeatured"
                    defaultChecked={property.isFeatured}
                    disabled={isPending}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="isFeatured" className="cursor-pointer">Featured Property</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isVerified"
                    name="isVerified"
                    defaultChecked={property.isVerified}
                    disabled={isPending}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="isVerified" className="cursor-pointer">Verified Property</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPremium"
                    name="isPremium"
                    defaultChecked={property.isPremium}
                    disabled={isPending}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="isPremium" className="cursor-pointer">Premium Project</Label>
                </div>
              </div>

              <div className="space-y-2 md:col-span-2 mt-4 pt-4 border-t">
                <Label htmlFor="shortDescription">Short Description</Label>
                <textarea
                  id="shortDescription"
                  name="shortDescription"
                  defaultValue={property.shortDescription || ""}
                  disabled={isPending}
                  rows={2}
                  className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  aria-invalid={!!errors.shortDescription}
                />
                {errors.shortDescription && <p className="text-sm text-destructive">{errors.shortDescription}</p>}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Full Description</Label>
                <textarea
                  id="description"
                  name="description"
                  defaultValue={property.description || ""}
                  disabled={isPending}
                  rows={8}
                  className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  aria-invalid={!!errors.description}
                />
                {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
              </div>

            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-4 border-t px-6 py-4 bg-muted/50">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Basic Information"}
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
