"use client";

import { useState, useTransition, useMemo } from "react";
import { Property } from "@/modules/properties/types/property";
import { Amenity } from "@/modules/amenities/types/amenity";
import { savePropertyAmenitiesAction } from "@/modules/properties/actions/property-amenities.actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X, Check } from "lucide-react";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

interface AmenitiesTabProps {
  property: Property;
  allAmenities: Amenity[];
  initialAssignedIds: string[];
}

export function AmenitiesTab({ property, allAmenities, initialAssignedIds }: AmenitiesTabProps) {
  const [assignedIds, setAssignedIds] = useState<Set<string>>(new Set(initialAssignedIds));
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  
  const [isPending, startTransition] = useTransition();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const hasUnsavedChanges = useMemo(() => {
    if (assignedIds.size !== initialAssignedIds.length) return true;
    for (const id of initialAssignedIds) {
      if (!assignedIds.has(id)) return true;
    }
    return false;
  }, [assignedIds, initialAssignedIds]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSave = () => {
    startTransition(async () => {
      const result = await savePropertyAmenitiesAction(property.id, Array.from(assignedIds));
      if (result.success) {
        showToast("Amenities saved successfully.");
      } else {
        alert(result.error);
      }
    });
  };

  const handleCancel = () => {
    setAssignedIds(new Set(initialAssignedIds));
    setSearchQuery("");
    setCategoryFilter(null);
  };

  const toggleAmenity = (id: string) => {
    setAssignedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Grouping and Filtering
  const categories = useMemo(() => {
    const cats = new Set(allAmenities.map(a => a.category));
    return Array.from(cats).sort();
  }, [allAmenities]);

  const assignedAmenitiesList = useMemo(() => {
    return allAmenities.filter(a => assignedIds.has(a.id));
  }, [allAmenities, assignedIds]);

  const filteredAmenities = useMemo(() => {
    return allAmenities.filter(a => {
      const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter ? a.category === categoryFilter : true;
      return matchesSearch && matchesCategory;
    });
  }, [allAmenities, searchQuery, categoryFilter]);

  const groupedAvailableAmenities = useMemo(() => {
    const grouped: Record<string, Amenity[]> = {};
    filteredAmenities.forEach(a => {
      if (!grouped[a.category]) grouped[a.category] = [];
      grouped[a.category].push(a);
    });
    return grouped;
  }, [filteredAmenities]);

  return (
    <div className="space-y-6 pb-20">
      
      {/* 1. Selected Amenities Section */}
      <Card>
        <CardHeader>
          <CardTitle>Assigned Amenities</CardTitle>
          <CardDescription>
            Features and facilities currently associated with this property.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {assignedAmenitiesList.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {assignedAmenitiesList.map(a => (
                <div 
                  key={a.id} 
                  className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium border border-primary/20 hover:bg-primary/20 transition-colors cursor-pointer"
                  onClick={() => toggleAmenity(a.id)}
                  title="Click to remove"
                >
                  <DynamicIcon name={a.icon} className="h-4 w-4" />
                  {a.name}
                  <X className="h-3.5 w-3.5 ml-1 opacity-70 hover:opacity-100" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 border border-dashed rounded-lg bg-muted/30">
              <p className="text-sm text-muted-foreground font-medium">No amenities assigned.</p>
              <p className="text-xs text-muted-foreground mt-1">Assign amenities below to improve property information.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 2. Available Amenities Section */}
      <Card>
        <CardHeader>
          <CardTitle>Available Amenities</CardTitle>
          <CardDescription>
            Search and select amenities from the master dictionary.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Search & Filter */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search amenities by name..." 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button
                variant={categoryFilter === null ? "default" : "outline"}
                size="sm"
                className="rounded-full h-8"
                onClick={() => setCategoryFilter(null)}
              >
                All
              </Button>
              {categories.map(cat => (
                <Button
                  key={cat}
                  variant={categoryFilter === cat ? "default" : "outline"}
                  size="sm"
                  className="rounded-full h-8"
                  onClick={() => setCategoryFilter(cat)}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>

          {/* Grouped Lists */}
          <div className="space-y-4">
            {Object.keys(groupedAvailableAmenities).length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No amenities found matching your criteria.</p>
            ) : (
              Object.keys(groupedAvailableAmenities).sort().map(category => (
                <Collapsible key={category} defaultOpen className="border rounded-md bg-card">
                  <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-3 font-medium hover:bg-muted/50 transition-colors [&[data-state=open]>svg]:rotate-180 rounded-md">
                    <span className="flex items-center gap-2">
                      {category}
                      <span className="bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded-full">
                        {groupedAvailableAmenities[category].length}
                      </span>
                    </span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-4 pt-0 border-t mt-3">
                      {groupedAvailableAmenities[category].map(amenity => {
                        const isSelected = assignedIds.has(amenity.id);
                        return (
                          <div 
                            key={amenity.id}
                            className={`flex flex-col p-3 rounded-lg border cursor-pointer transition-all ${
                              isSelected 
                                ? 'border-primary bg-primary/5 ring-1 ring-primary/20 shadow-sm' 
                                : 'border-border hover:border-primary/50 hover:bg-muted/50'
                            }`}
                            onClick={() => toggleAmenity(amenity.id)}
                          >
                            <div className="flex justify-between items-start">
                              <DynamicIcon 
                                name={amenity.icon} 
                                className={`h-5 w-5 mb-2 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} 
                              />
                              <div className={`h-5 w-5 rounded-full flex items-center justify-center border ${isSelected ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground/30'}`}>
                                {isSelected && <Check className="h-3 w-3" />}
                              </div>
                            </div>
                            <span className="font-medium text-sm leading-tight">{amenity.name}</span>
                            {amenity.description && (
                              <span className="text-xs text-muted-foreground mt-1 line-clamp-2">{amenity.description}</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Save Action Bar (Sticky Bottom) */}
      <div 
        className={`fixed bottom-0 left-0 lg:left-64 right-0 bg-background/80 backdrop-blur-md border-t p-4 z-40 flex items-center justify-between transition-transform duration-300 ${
          hasUnsavedChanges ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-sm font-medium text-amber-500">Unsaved Changes</span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={handleCancel} disabled={isPending}>
            Cancel Changes
          </Button>
          <Button onClick={handleSave} disabled={isPending}>
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {toastMessage && (
        <div className="fixed bottom-20 right-4 z-50 rounded-md bg-zinc-900 px-4 py-3 text-sm font-medium text-white shadow-lg transition-all animate-in fade-in slide-in-from-bottom-4">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
