"use client";

import { useState, useTransition } from "react";
import { Property, UpdatePropertyInput } from "@/modules/properties/types/property";
import { updatePropertyAction } from "@/modules/properties/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { z } from "zod";

const PricingSchema = z.object({
  price: z.number().min(0, "Price must be positive").optional(),
  currency: z.string().optional().or(z.literal("")),
  pricePerSqft: z.number().min(0).optional(),
});

interface PricingTabProps {
  property: Property;
}

export function PricingTab({ property }: PricingTabProps) {
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

    ["price", "pricePerSqft"].forEach(field => {
      if (payload[field]) {
        payload[field] = Number(payload[field]);
      } else {
        payload[field] = undefined;
      }
    });

    if (payload.currency === "") payload.currency = undefined;

    const result = PricingSchema.safeParse(payload);
    
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
          showToast("Pricing saved successfully.");
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
            <CardTitle>Pricing</CardTitle>
            <CardDescription>Property valuation details.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="price">Total Price</Label>
              <Input id="price" name="price" type="number" step="0.01" defaultValue={property.price || ""} disabled={isPending} aria-invalid={!!errors.price} />
              {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Input id="currency" name="currency" defaultValue={property.currency || "INR"} disabled={isPending} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pricePerSqft">Price Per Sq. Ft.</Label>
              <Input id="pricePerSqft" name="pricePerSqft" type="number" step="0.01" defaultValue={property.pricePerSqft || ""} disabled={isPending} aria-invalid={!!errors.pricePerSqft} />
              {errors.pricePerSqft && <p className="text-sm text-destructive">{errors.pricePerSqft}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-4 border-t px-6 py-4 bg-muted/50">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Pricing"}
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
