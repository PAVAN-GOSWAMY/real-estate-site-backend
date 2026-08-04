"use client";

import React, { useState, useRef, useEffect } from "react";
import { Location } from "@/modules/locations/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { CreateLocationModal } from "./CreateLocationModal";

interface LocationComboboxProps {
  locations: Location[];
  cityId: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  onLocationCreated?: (newLocation: Location) => void;
}

export function LocationCombobox({
  locations,
  cityId,
  value,
  onChange,
  disabled,
  onLocationCreated
}: LocationComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter locations
  const filtered = locations.filter(loc => 
    loc.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedLocation = locations.find(loc => loc.id === value);

  // Keyboard navigation
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  useEffect(() => {
    setHighlightedIndex(0);
  }, [search]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === "Enter" || e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex(prev => Math.min(prev + 1, filtered.length)); // length = Other
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex < filtered.length) {
        onChange(filtered[highlightedIndex].id);
        setOpen(false);
      } else if (highlightedIndex === filtered.length) {
        // "Other" is selected
        setOpen(false);
        setShowCreateModal(true);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const handleOpen = () => {
    if (!disabled && cityId) {
      setOpen(true);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  // Render highlighted text
  const renderHighlighted = (text: string) => {
    if (!search) return text;
    const parts = text.split(new RegExp(`(${search})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === search.toLowerCase() ? (
            <span key={i} className="bg-primary/20 text-primary font-semibold rounded-sm">{part}</span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </span>
    );
  };

  return (
    <div className="relative" ref={containerRef}>
      <div 
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background cursor-pointer",
          disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-accent/50",
          open && "ring-2 ring-ring ring-offset-2"
        )}
        onClick={handleOpen}
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <span className={cn("truncate", !selectedLocation && "text-muted-foreground")}>
          {selectedLocation ? `${selectedLocation.name} (${selectedLocation.type})` : "Select Location..."}
        </span>
        <ChevronsUpDown className="h-4 w-4 opacity-50" />
      </div>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md z-50">
          <div className="p-2 border-b">
            <Input
              ref={inputRef}
              placeholder="Search location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-8 border-none focus-visible:ring-0 focus-visible:ring-offset-0 px-2"
            />
          </div>
          
          <div className="max-h-[300px] overflow-auto py-1">
            {filtered.length === 0 && search && (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No matching locations found.
              </div>
            )}
            
            {filtered.map((loc, index) => (
              <div
                key={loc.id}
                className={cn(
                  "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
                  highlightedIndex === index ? "bg-accent text-accent-foreground" : "hover:bg-accent/50",
                  loc.id === value && "font-medium text-primary"
                )}
                onClick={() => {
                  onChange(loc.id);
                  setOpen(false);
                }}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                <div className="flex-1 flex justify-between items-center">
                  <span>{renderHighlighted(loc.name)}</span>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{loc.type}</span>
                </div>
                {loc.id === value && (
                  <Check className="ml-2 h-4 w-4" />
                )}
              </div>
            ))}

            <div
              className={cn(
                "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none text-primary mt-1 border-t",
                highlightedIndex === filtered.length ? "bg-accent text-accent-foreground font-medium" : "hover:bg-accent/50"
              )}
              onClick={() => {
                setOpen(false);
                setShowCreateModal(true);
              }}
              onMouseEnter={() => setHighlightedIndex(filtered.length)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Other (Add New Location)
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <CreateLocationModal
          cityId={cityId}
          onClose={() => setShowCreateModal(false)}
          onSuccess={(newLoc: Location) => {
            setShowCreateModal(false);
            if (onLocationCreated) onLocationCreated(newLoc);
            onChange(newLoc.id);
          }}
        />
      )}
    </div>
  );
}
