"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createCityAction, updateCityAction } from "@/modules/locations/locations.actions";
import { CitySchema, CreateCityInput } from "@/modules/locations/validation/city.schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { City } from "@/modules/locations/types";

interface CityFormProps {
  initialData?: City;
}

export function CityForm({ initialData }: CityFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string>();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isActive, setIsActive] = useState(initialData?.is_active ?? true);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError(undefined);
    setErrors({});
    
    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name") as string,
      state: formData.get("state") as string,
      country: formData.get("country") as string,
      is_active: isActive,
    };

    const result = CitySchema.safeParse(payload);
    
    if (!result.success) {
      const formattedErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        formattedErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(formattedErrors);
      return;
    }
    
    startTransition(async () => {
      try {
        let actionResult;
        if (initialData) {
          actionResult = await updateCityAction(initialData.id, result.data);
        } else {
          actionResult = await createCityAction(result.data);
        }
        
        if (actionResult.success) {
          router.push("/admin/locations/cities");
          router.refresh();
        } else {
          setServerError(actionResult.error);
        }
      } catch (error: any) {
        setServerError(error.message || "An unexpected error occurred.");
      }
    });
  };

  return (
    <form onSubmit={onSubmit} noValidate>
      {serverError && (
        <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md text-sm font-medium mb-6">
          {serverError}
        </div>
      )}
      
      <Card>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-2">
            <Label htmlFor="name">City Name <span className="text-destructive">*</span></Label>
            <Input id="name" name="name" defaultValue={initialData?.name || ""} disabled={isPending} aria-invalid={!!errors.name} />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State <span className="text-destructive">*</span></Label>
            <Input id="state" name="state" defaultValue={initialData?.state || ""} disabled={isPending} aria-invalid={!!errors.state} />
            {errors.state && <p className="text-sm text-destructive">{errors.state}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input id="country" name="country" defaultValue={initialData?.country || "India"} disabled={isPending} />
            {errors.country && <p className="text-sm text-destructive">{errors.country}</p>}
          </div>

          <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Active Status</Label>
              <p className="text-sm text-muted-foreground">
                Determines if this city can be selected for new properties.
              </p>
            </div>
            <Switch
              checked={isActive}
              onCheckedChange={setIsActive}
              disabled={isPending}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t px-6 py-4">
          <Button type="button" variant="ghost" onClick={() => router.back()} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : initialData ? "Save Changes" : "Create City"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
