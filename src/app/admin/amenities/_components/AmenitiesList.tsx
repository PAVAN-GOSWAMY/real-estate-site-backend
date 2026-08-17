"use client";

import { useState } from "react";
import { Amenity } from "@/modules/amenities/types/amenity";
import { getAmenityIcon } from "@/lib/icons/amenity-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AmenityForm } from "./AmenityForm";

interface AmenitiesListProps {
  amenities: Amenity[];
}

export function AmenitiesList({ amenities }: AmenitiesListProps) {
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAmenity, setSelectedAmenity] = useState<Amenity | undefined>(undefined);

  const filtered = amenities.filter(a => 
    a.name.toLowerCase().includes(search.toLowerCase()) || 
    a.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenNew = () => {
    setSelectedAmenity(undefined);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (amenity: Amenity) => {
    setSelectedAmenity(amenity);
    setIsDialogOpen(true);
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-b gap-4">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search amenities..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button onClick={handleOpenNew} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Amenity
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedAmenity ? "Edit Amenity" : "Create Amenity"}</DialogTitle>
          </DialogHeader>
          <AmenityForm 
            initialData={selectedAmenity} 
            onSuccess={() => setIsDialogOpen(false)}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b">
            <tr>
              <th className="px-6 py-4 font-medium">Icon</th>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                  No amenities found.
                </td>
              </tr>
            ) : (
              filtered.map((amenity) => {
                const Icon = getAmenityIcon(amenity.icon);
                return (
                  <tr key={amenity.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center border">
                        <Icon className="h-5 w-5 text-foreground" />
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-foreground">
                      {amenity.name}
                      {amenity.description && (
                        <p className="text-xs text-muted-foreground font-normal mt-1 max-w-[200px] truncate" title={amenity.description}>
                          {amenity.description}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {amenity.category}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={amenity.isActive ? "default" : "secondary"}>
                        {amenity.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(amenity)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
