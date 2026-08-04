"use client";

import React, { useState, useTransition } from "react";
import { Location, LocationType } from "@/modules/locations/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Loader2 } from "lucide-react";
import { createLocationAction } from "@/modules/locations/locations.actions";
import { toast } from "sonner";

interface CreateLocationModalProps {
  cityId: string;
  onClose: () => void;
  onSuccess: (location: Location) => void;
}

export function CreateLocationModal({ cityId, onClose, onSuccess }: CreateLocationModalProps) {
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [type, setType] = useState<LocationType>("SECTOR");
  const [error, setError] = useState<string | null>(null);

  const handleCreateLocation = () => {
    if (!name.trim()) {
      setError("Location name is required.");
      return;
    }

    startTransition(async () => {
      setError(null);
      const res = await createLocationAction({
        name: name.trim(),
        type,
        city_id: cityId,
        is_active: true
      });

      if (res.success && res.data) {
        toast.success("Location created successfully");
        onSuccess(res.data);
      } else {
        setError(res.error || "Failed to create location.");
      }
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-lg bg-background shadow-xl border overflow-hidden">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-lg font-semibold">Add New Location</h2>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose} disabled={isPending}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-4 space-y-4">
          {error && (
            <div className="bg-destructive/15 text-destructive text-sm px-3 py-2 rounded-md font-medium">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="locationName">Location Name <span className="text-destructive">*</span></Label>
            <Input
              id="locationName"
              autoFocus
              placeholder="e.g. Sector 150"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleCreateLocation();
                }
              }}
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label>Location Type <span className="text-destructive">*</span></Label>
            <Select value={type} onValueChange={(v: LocationType) => setType(v)} disabled={isPending}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SECTOR">Sector</SelectItem>
                <SelectItem value="LOCALITY">Locality</SelectItem>
                <SelectItem value="AREA">Area</SelectItem>
                <SelectItem value="TOWNSHIP">Township</SelectItem>
                <SelectItem value="VILLAGE">Village</SelectItem>
                <SelectItem value="COMMERCIAL_HUB">Commercial Hub</SelectItem>
                <SelectItem value="TECH_PARK">Tech Park</SelectItem>
                <SelectItem value="ZONE">Zone</SelectItem>
                <SelectItem value="INDUSTRIAL_AREA">Industrial Area</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="button" onClick={handleCreateLocation} disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Location
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
