"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Amenity, CreateAmenitySchema } from "@/modules/amenities/types/amenity";
import { createAmenityAction, updateAmenityAction } from "@/modules/amenities/actions/amenity.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { AmenityIconPicker } from "./AmenityIconPicker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Form Schema
const formSchema = CreateAmenitySchema.extend({
  isActive: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

interface AmenityFormProps {
  initialData?: Amenity;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const CATEGORIES = [
  "Community",
  "Convenience",
  "Fitness",
  "Kids",
  "Luxury",
  "Outdoor",
  "Parking",
  "Security",
  "General",
];

export function AmenityForm({ initialData, onSuccess, onCancel }: AmenityFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      category: initialData?.category || CATEGORIES[0],
      icon: initialData?.icon || "Check",
      description: initialData?.description || "",
      isActive: initialData !== undefined ? initialData.isActive : true,
    },
  });

  const onSubmit = (data: FormValues) => {
    startTransition(async () => {
      try {
        const result = initialData
          ? await updateAmenityAction(initialData.id, data)
          : await createAmenityAction(data);

        if (result.success) {
          toast.success(initialData ? "Amenity updated successfully!" : "Amenity created successfully!");
          if (onSuccess) onSuccess();
        } else {
          toast.error(result.error);
        }
      } catch (error) {
        toast.error("An unexpected error occurred.");
      }
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-2">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Amenity Name <span className="text-destructive">*</span></Label>
          <Input
            id="name"
            placeholder="e.g. Swimming Pool"
            disabled={isPending}
            {...form.register("name")}
          />
          {form.formState.errors.name && (
            <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category <span className="text-destructive">*</span></Label>
          <Select 
            disabled={isPending}
            value={form.watch("category")} 
            onValueChange={(val) => form.setValue("category", val, { shouldValidate: true })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.category && (
            <p className="text-sm text-destructive">{form.formState.errors.category.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Icon <span className="text-destructive">*</span></Label>
          <AmenityIconPicker 
            disabled={isPending}
            value={form.watch("icon")}
            onChange={(val) => form.setValue("icon", val, { shouldValidate: true })}
          />
          {form.formState.errors.icon && (
            <p className="text-sm text-destructive">{form.formState.errors.icon.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Brief description of the amenity..."
            disabled={isPending}
            {...form.register("description")}
          />
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <Switch
            id="isActive"
            disabled={isPending}
            checked={form.watch("isActive")}
            onCheckedChange={(val) => form.setValue("isActive", val)}
          />
          <Label htmlFor="isActive" className="cursor-pointer">Active</Label>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4 border-t">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : (initialData ? "Update Amenity" : "Create Amenity")}
        </Button>
      </div>
    </form>
  );
}
