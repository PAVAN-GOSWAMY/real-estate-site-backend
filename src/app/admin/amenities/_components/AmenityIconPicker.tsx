"use client";

import { useState } from "react";
import { AMENITY_ICONS } from "@/lib/icons/amenity-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface AmenityIconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
  disabled?: boolean;
}

export function AmenityIconPicker({ value, onChange, disabled }: AmenityIconPickerProps) {
  const [search, setSearch] = useState("");

  const iconNames = Object.keys(AMENITY_ICONS);
  
  const filteredIcons = iconNames.filter((name) => 
    name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 border rounded-md p-4 bg-muted/20">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search icons..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          disabled={disabled}
        />
      </div>

      <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-[200px] overflow-y-auto p-1">
        {filteredIcons.length === 0 ? (
          <div className="col-span-full text-center text-sm text-muted-foreground py-4">
            No icons found.
          </div>
        ) : (
          filteredIcons.map((name) => {
            const IconComponent = AMENITY_ICONS[name];
            const isSelected = value === name;

            return (
              <Button
                key={name}
                type="button"
                variant={isSelected ? "default" : "outline"}
                size="icon"
                disabled={disabled}
                className={cn(
                  "h-10 w-10 flex-shrink-0",
                  isSelected ? "ring-2 ring-primary ring-offset-1" : ""
                )}
                onClick={() => onChange(name)}
                title={name}
              >
                <IconComponent className="h-5 w-5" />
              </Button>
            );
          })
        )}
      </div>
      
      <div className="flex items-center gap-2 pt-2 border-t text-sm">
        <span className="text-muted-foreground">Selected:</span>
        {value ? (
          <span className="font-medium text-foreground flex items-center gap-1.5">
            {(() => {
              const SelectedIcon = AMENITY_ICONS[value] || AMENITY_ICONS.Check;
              return <SelectedIcon className="h-4 w-4" />;
            })()}
            {value}
          </span>
        ) : (
          <span className="text-muted-foreground italic">None</span>
        )}
      </div>
    </div>
  );
}
