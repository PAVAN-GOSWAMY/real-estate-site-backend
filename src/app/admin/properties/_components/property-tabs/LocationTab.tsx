"use client";

import { useState, useTransition } from "react";
import { Property, UpdatePropertyInput } from "@/modules/properties/types/property";
import { updatePropertyAction } from "@/modules/properties/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";

const LocationSchema = z.object({
  landmark: z.string().optional().or(z.literal("")),
  sector: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  locality: z.string().min(1, "Locality is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().optional().or(z.literal("")),
  pincode: z.string().optional().or(z.literal("")),
  googleMapsUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

interface LocationTabProps {
  property: Property;
}

export function LocationTab({ property }: LocationTabProps) {
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

    // Numeric conversion
    ["latitude", "longitude"].forEach(field => {
      if (payload[field]) {
        payload[field] = Number(payload[field]);
      } else {
        payload[field] = undefined;
      }
    });

    // Empty string conversion
    ["landmark", "sector", "address", "country", "pincode", "googleMapsUrl"].forEach(key => {
      if (payload[key] === "") payload[key] = undefined;
    });

    const result = LocationSchema.safeParse(payload);
    
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
          showToast("Location saved successfully.");
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
            <CardTitle>Location</CardTitle>
            <CardDescription>Address and geographical coordinates.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2 md:col-span-2 lg:col-span-3">
                <Label htmlFor="landmark">Project / Landmark Name</Label>
                <Input id="landmark" name="landmark" placeholder="e.g. Near Gachibowli Stadium" defaultValue={property.landmark || ""} disabled={isPending} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="locality">Locality <span className="text-destructive">*</span></Label>
                <Input id="locality" name="locality" defaultValue={property.locality || ""} disabled={isPending} aria-invalid={!!errors.locality} />
                {errors.locality && <p className="text-sm text-destructive">{errors.locality}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="sector">Sector</Label>
                <Input id="sector" name="sector" placeholder="e.g. Sector 150" defaultValue={property.sector || ""} disabled={isPending} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City <span className="text-destructive">*</span></Label>
                <Input id="city" name="city" defaultValue={property.city || ""} disabled={isPending} aria-invalid={!!errors.city} />
                {errors.city && <p className="text-sm text-destructive">{errors.city}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State <span className="text-destructive">*</span></Label>
                <Input id="state" name="state" defaultValue={property.state || ""} disabled={isPending} aria-invalid={!!errors.state} />
                {errors.state && <p className="text-sm text-destructive">{errors.state}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" name="country" defaultValue={property.country || "India"} disabled={isPending} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode</Label>
                <Input id="pincode" name="pincode" defaultValue={property.pincode || ""} disabled={isPending} />
              </div>

              <div className="space-y-2 md:col-span-2 lg:col-span-3">
                <Label htmlFor="address">Complete Address</Label>
                <Textarea 
                  id="address" 
                  name="address" 
                  rows={3} 
                  placeholder="e.g. Survey No. 12, Financial District Road, Narsingi..."
                  defaultValue={property.address || ""} 
                  disabled={isPending} 
                />
                {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
              </div>

              <div className="space-y-2 md:col-span-2 lg:col-span-3">
                <Label htmlFor="googleMapsUrl">Google Maps URL</Label>
                <Input id="googleMapsUrl" name="googleMapsUrl" placeholder="https://maps.google.com/..." defaultValue={property.googleMapsUrl || ""} disabled={isPending} aria-invalid={!!errors.googleMapsUrl} />
                {errors.googleMapsUrl && <p className="text-sm text-destructive">{errors.googleMapsUrl}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input id="latitude" name="latitude" type="number" step="any" defaultValue={property.latitude || ""} disabled={isPending} aria-invalid={!!errors.latitude} />
                {errors.latitude && <p className="text-sm text-destructive">{errors.latitude}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input id="longitude" name="longitude" type="number" step="any" defaultValue={property.longitude || ""} disabled={isPending} aria-invalid={!!errors.longitude} />
                {errors.longitude && <p className="text-sm text-destructive">{errors.longitude}</p>}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-4 border-t px-6 py-4 bg-muted/50">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Location"}
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
