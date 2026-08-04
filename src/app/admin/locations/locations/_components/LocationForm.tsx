"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createLocationAction, updateLocationAction } from "@/modules/locations/locations.actions";
import { LocationSchema, CreateLocationInput } from "@/modules/locations/validation/location.schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { City, Location } from "@/modules/locations/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LocationFormProps {
  initialData?: Location;
  cities: City[];
}

export function LocationForm({ initialData, cities }: LocationFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string>();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isActive, setIsActive] = useState(initialData?.is_active ?? true);
  
  const [selectedCity, setSelectedCity] = useState<string>(initialData?.city_id || "");
  const [selectedType, setSelectedType] = useState<any>(initialData?.type || "LOCALITY");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError(undefined);
    setErrors({});
    
    const formData = new FormData(e.currentTarget);
    const payload: Record<string, any> = {
      name: formData.get("name") as string,
      city_id: selectedCity,
      type: selectedType,
      pincode: formData.get("pincode") as string,
      is_active: isActive,
    };

    if (payload.pincode === "") payload.pincode = undefined;

    const result = LocationSchema.safeParse(payload);
    
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
          actionResult = await updateLocationAction(initialData.id, result.data);
        } else {
          actionResult = await createLocationAction(result.data);
        }
        
        if (actionResult.success) {
          router.push("/admin/locations/locations");
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
            <Label>City <span className="text-destructive">*</span></Label>
            <Select value={selectedCity} onValueChange={setSelectedCity} disabled={isPending}>
              <SelectTrigger aria-invalid={!!errors.city_id}>
                <SelectValue placeholder="Select City" />
              </SelectTrigger>
              <SelectContent>
                {cities.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.city_id && <p className="text-sm text-destructive">{errors.city_id}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Location Name <span className="text-destructive">*</span></Label>
            <Input id="name" name="name" defaultValue={initialData?.name || ""} disabled={isPending} aria-invalid={!!errors.name} />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label>Location Type <span className="text-destructive">*</span></Label>
            <Select value={selectedType} onValueChange={setSelectedType} disabled={isPending}>
              <SelectTrigger aria-invalid={!!errors.type}>
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOCALITY">Locality</SelectItem>
                <SelectItem value="SECTOR">Sector</SelectItem>
                <SelectItem value="AREA">Area</SelectItem>
                <SelectItem value="ZONE">Zone</SelectItem>
                <SelectItem value="VILLAGE">Village</SelectItem>
                <SelectItem value="TOWNSHIP">Township</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && <p className="text-sm text-destructive">{errors.type}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="pincode">Pincode</Label>
            <Input id="pincode" name="pincode" defaultValue={initialData?.pincode || ""} disabled={isPending} />
            {errors.pincode && <p className="text-sm text-destructive">{errors.pincode}</p>}
          </div>

          <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Active Status</Label>
              <p className="text-sm text-muted-foreground">
                Determines if this location can be selected for new properties.
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
            {isPending ? "Saving..." : initialData ? "Save Changes" : "Create Location"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
