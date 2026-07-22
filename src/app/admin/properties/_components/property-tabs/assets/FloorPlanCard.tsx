"use client";

import { PropertyFloorPlan } from "@/modules/properties/types/assets";
import Image from "next/image";
import { MoreHorizontal, Image as ImageIcon, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FloorPlanCardProps {
  floorPlan: PropertyFloorPlan;
  onEdit: (fp: PropertyFloorPlan) => void;
  onDelete: (id: string) => void;
  onPreview: (fp: PropertyFloorPlan) => void;
  disabled?: boolean;
}

export function FloorPlanCard({ floorPlan, onEdit, onDelete, onPreview, disabled }: FloorPlanCardProps) {
  return (
    <div className="group relative rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden transition-all hover:shadow-md cursor-grab active:cursor-grabbing">
      {/* Thumbnail */}
      <div 
        className="aspect-[4/3] w-full relative bg-muted cursor-pointer overflow-hidden"
        onClick={() => onPreview(floorPlan)}
      >
        {/* Actions Dropdown */}
        <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="h-8 w-8 shadow-sm rounded-md bg-background/80 backdrop-blur-sm" disabled={disabled}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => onPreview(floorPlan)} className="cursor-pointer">
                <ImageIcon className="mr-2 h-4 w-4" />
                Preview
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(floorPlan)} className="cursor-pointer">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDelete(floorPlan.id)} className="text-destructive focus:bg-destructive/10 cursor-pointer">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Image
          src={floorPlan.imageUrl}
          alt={floorPlan.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Details */}
      <div className="p-3">
        <h4 className="font-semibold text-sm truncate" title={floorPlan.name}>
          {floorPlan.name}
        </h4>
        <div className="flex flex-col gap-0.5 mt-1 text-xs text-muted-foreground">
          <div className="flex justify-between items-center">
            <span>{floorPlan.configuration}</span>
            <span className="font-medium text-foreground">{floorPlan.area} {floorPlan.unit}</span>
          </div>
          {floorPlan.floorNumber && (
            <span>Floor: {floorPlan.floorNumber}</span>
          )}
        </div>
      </div>
    </div>
  );
}
