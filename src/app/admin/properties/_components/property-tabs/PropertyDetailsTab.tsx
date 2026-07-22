"use client";

import { useState, useTransition } from "react";
import { Property, UpdatePropertyInput } from "@/modules/properties/types/property";
import { ConstructionStatus } from "@/modules/properties/types/enums";
import { updatePropertyAction } from "@/modules/properties/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { z } from "zod";

const PropertyDetailsSchema = z.object({
  bedrooms: z.number().int().min(0).optional(),
  bathrooms: z.number().int().min(0).optional(),
  balconies: z.number().int().min(0).optional(),
  parking: z.number().int().min(0).optional(),
  superBuiltupArea: z.number().min(0).optional(),
  carpetArea: z.number().min(0).optional(),
  floorNumber: z.number().int().optional(),
  totalFloors: z.number().int().optional(),
  facing: z.string().optional().or(z.literal("")),
  possessionDate: z.string().optional().or(z.literal("")),
  constructionStatus: z.nativeEnum(ConstructionStatus).optional(),
});

interface PropertyDetailsTabProps {
  property: Property;
}

export function PropertyDetailsTab({ property }: PropertyDetailsTabProps) {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string>();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [constructionStatus, setConstructionStatus] = useState<ConstructionStatus | "">(property.constructionStatus || "");

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
      constructionStatus: constructionStatus === "" ? undefined : constructionStatus
    };

    const numericFields = [
      "bedrooms", "bathrooms", "balconies", "parking", 
      "superBuiltupArea", "carpetArea", "floorNumber", "totalFloors"
    ];
    
    numericFields.forEach(field => {
      if (payload[field]) {
        payload[field] = Number(payload[field]);
      } else {
        payload[field] = undefined;
      }
    });

    ["facing", "possessionDate"].forEach(key => {
      if (payload[key] === "") payload[key] = undefined;
    });

    if (payload.possessionDate) {
      // Attempt to validate datetime format if provided (zod expects standard ISO)
      try {
        payload.possessionDate = new Date(payload.possessionDate).toISOString();
      } catch (e) {
        // Will fail zod validation
      }
    }

    const result = PropertyDetailsSchema.safeParse(payload);
    
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
          showToast("Property Details saved successfully.");
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
            <CardTitle>Property Details</CardTitle>
            <CardDescription>Physical dimensions and attributes.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input id="bedrooms" name="bedrooms" type="number" defaultValue={property.bedrooms || ""} disabled={isPending} aria-invalid={!!errors.bedrooms} />
              {errors.bedrooms && <p className="text-sm text-destructive">{errors.bedrooms}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input id="bathrooms" name="bathrooms" type="number" defaultValue={property.bathrooms || ""} disabled={isPending} aria-invalid={!!errors.bathrooms} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="balconies">Balconies</Label>
              <Input id="balconies" name="balconies" type="number" defaultValue={property.balconies || ""} disabled={isPending} aria-invalid={!!errors.balconies} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parking">Parking Slots</Label>
              <Input id="parking" name="parking" type="number" defaultValue={property.parking || ""} disabled={isPending} aria-invalid={!!errors.parking} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="superBuiltupArea">Super Built-up Area</Label>
              <Input id="superBuiltupArea" name="superBuiltupArea" type="number" step="0.01" defaultValue={property.superBuiltupArea || ""} disabled={isPending} aria-invalid={!!errors.superBuiltupArea} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="carpetArea">Carpet Area</Label>
              <Input id="carpetArea" name="carpetArea" type="number" step="0.01" defaultValue={property.carpetArea || ""} disabled={isPending} aria-invalid={!!errors.carpetArea} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="floorNumber">Floor Number</Label>
              <Input id="floorNumber" name="floorNumber" type="number" defaultValue={property.floorNumber || ""} disabled={isPending} aria-invalid={!!errors.floorNumber} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalFloors">Total Floors</Label>
              <Input id="totalFloors" name="totalFloors" type="number" defaultValue={property.totalFloors || ""} disabled={isPending} aria-invalid={!!errors.totalFloors} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="facing">Facing</Label>
              <Input id="facing" name="facing" defaultValue={property.facing || ""} disabled={isPending} aria-invalid={!!errors.facing} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="possessionDate">Possession Date</Label>
              <Input 
                id="possessionDate" 
                name="possessionDate" 
                type="date" 
                defaultValue={property.possessionDate ? new Date(property.possessionDate).toISOString().split('T')[0] : ""} 
                disabled={isPending} 
                aria-invalid={!!errors.possessionDate}
              />
              {errors.possessionDate && <p className="text-sm text-destructive">Invalid date format</p>}
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Construction Status</Label>
              <Select value={constructionStatus} onValueChange={(val: ConstructionStatus) => setConstructionStatus(val)} disabled={isPending}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(ConstructionStatus).map(s => (
                    <SelectItem key={s} value={s}>{s.replace(/_/g, ' ')}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-4 border-t px-6 py-4 bg-muted/50">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Details"}
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
