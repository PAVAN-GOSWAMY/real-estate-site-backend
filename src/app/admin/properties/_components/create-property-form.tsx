"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createPropertyAction } from "@/modules/properties/actions";
import { CreatePropertyInput } from "@/modules/properties/types/property";
import { Builder } from "@/modules/builders/types/builder";
import { PropertyStatus, PropertyType, PropertyAvailability } from "@/modules/properties/types/enums";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { z } from "zod";
import Link from "next/link";

interface CreatePropertyFormProps {
  initialCode: string;
  builders: Builder[];
}

const MinimalCreateSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  builderId: z.string().uuid("Please select a builder"),
  propertyType: z.nativeEnum(PropertyType),
  status: z.nativeEnum(PropertyStatus),
  price: z.number().min(0, "Price must be positive").optional(),
  locality: z.string().min(2, "Locality is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  propertyCode: z.string(),
});

export function CreatePropertyForm({ initialCode, builders }: CreatePropertyFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string>();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [builderId, setBuilderId] = useState("");
  const [propertyType, setPropertyType] = useState<PropertyType | "">("");
  const [status, setStatus] = useState<PropertyStatus>(PropertyStatus.ACTIVE);

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
    
    const payload = {
      ...data,
      builderId,
      propertyType: propertyType === "" ? undefined : propertyType,
      status,
      price: data.price ? Number(data.price) : undefined,
      propertyCode: initialCode, // Force the initial code
      isFeatured: formData.get("isFeatured") === "on",
      isVerified: formData.get("isVerified") === "on",
      isPremium: formData.get("isPremium") === "on",
    };

    const result = MinimalCreateSchema.safeParse(payload);
    
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
          availability: PropertyAvailability.AVAILABLE, // Default requirement
          isFeatured: payload.isFeatured,
          isVerified: payload.isVerified,
          isPremium: payload.isPremium,
        } as CreatePropertyInput;
        
        const actionResult = await createPropertyAction(fullPayload);
        
        if (actionResult.success) {
          showToast("Property created successfully. Redirecting to Edit Hub...");
          setTimeout(() => {
            router.push(`/admin/properties/${actionResult.data.id}`);
          }, 1000);
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
      <form onSubmit={onSubmit} className="space-y-8" noValidate>
        {serverError && (
          <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md text-sm font-medium" role="alert">
            {serverError}
          </div>
        )}
        
        <Card>
          <CardHeader>
            <CardTitle>Create Property</CardTitle>
            <CardDescription>Enter the basic information to create this property.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="title">Property Title <span className="text-destructive">*</span></Label>
                <Input
                  id="title"
                  name="title"
                  disabled={isPending}
                  placeholder="e.g. Prestige Shantiniketan 3BHK"
                  aria-invalid={!!errors.title}
                />
                {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
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
                <Label htmlFor="price">Price (Optional)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  disabled={isPending}
                  aria-invalid={!!errors.price}
                />
                {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="locality">Locality <span className="text-destructive">*</span></Label>
                <Input
                  id="locality"
                  name="locality"
                  disabled={isPending}
                  aria-invalid={!!errors.locality}
                />
                {errors.locality && <p className="text-sm text-destructive">{errors.locality}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City <span className="text-destructive">*</span></Label>
                <Input
                  id="city"
                  name="city"
                  disabled={isPending}
                  aria-invalid={!!errors.city}
                />
                {errors.city && <p className="text-sm text-destructive">{errors.city}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State <span className="text-destructive">*</span></Label>
                <Input
                  id="state"
                  name="state"
                  disabled={isPending}
                  aria-invalid={!!errors.state}
                />
                {errors.state && <p className="text-sm text-destructive">{errors.state}</p>}
              </div>

              <div className="space-y-4 md:col-span-2 pt-4 border-t">
                <Label className="text-base font-semibold">Property Visibility</Label>
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isFeatured"
                      name="isFeatured"
                      disabled={isPending}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label htmlFor="isFeatured" className="cursor-pointer">Featured Project</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isPremium"
                      name="isPremium"
                      disabled={isPending}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label htmlFor="isPremium" className="cursor-pointer">Premium Project</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isVerified"
                      name="isVerified"
                      disabled={isPending}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label htmlFor="isVerified" className="cursor-pointer">Verified Project</Label>
                  </div>
                </div>
              </div>

            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-4 border-t px-6 py-4">
            <Button type="button" variant="outline" disabled={isPending} asChild>
              <Link href="/admin/properties">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create Property"}
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
