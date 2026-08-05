"use client";

import React, { useState, useTransition } from "react";
import { City } from "@/modules/locations/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X, Loader2 } from "lucide-react";
import { createCityAction } from "@/modules/locations/locations.actions";
import { toast } from "sonner";

interface CreateCityModalProps {
  onClose: () => void;
  onSuccess: (city: City) => void;
}

export function CreateCityModal({ onClose, onSuccess }: CreateCityModalProps) {
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [stateName, setStateName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleCreateCity = () => {
    if (!name.trim()) {
      setError("City name is required.");
      return;
    }

    startTransition(async () => {
      setError(null);
      const res = await createCityAction({
        name: name.trim(),
        state: stateName.trim() || undefined,
        country: "India",
        is_active: true
      });

      if (res.success && res.data) {
        toast.success("City created successfully");
        onSuccess(res.data);
      } else {
        setError(res.error || "Failed to create city.");
      }
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-lg bg-background shadow-xl border overflow-hidden">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-lg font-semibold">Add New City</h2>
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
            <Label htmlFor="cityName">City Name <span className="text-destructive">*</span></Label>
            <Input
              id="cityName"
              autoFocus
              placeholder="e.g. Pune"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleCreateCity();
                }
              }}
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stateName">State (Optional)</Label>
            <Input
              id="stateName"
              placeholder="e.g. Maharashtra"
              value={stateName}
              onChange={(e) => setStateName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleCreateCity();
                }
              }}
              disabled={isPending}
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="button" onClick={handleCreateCity} disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save City
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
