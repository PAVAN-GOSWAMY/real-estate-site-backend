"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createPropertyAction } from "@/modules/properties/actions";
import { CreatePropertyInput } from "@/modules/properties/types/property";
import { Builder } from "@/modules/builders/types/builder";
import {
  PropertyStatus,
  PropertyType,
  PropertyAvailability,
  PropertyCategory,
  PROPERTY_CONFIGURATIONS,
  isBhkApplicable
} from "@/modules/properties/types/enums";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { z } from "zod";
import Link from "next/link";
import { X, Layers } from "lucide-react";
import { getLocationsByCityAction } from "@/modules/locations/locations.actions";
import { LocationCombobox } from "./LocationCombobox";
import { CityCombobox } from "./CityCombobox";

interface CreatePropertyFormProps {
  initialCode: string;
  builders: Builder[];
  cities: import("@/modules/locations/types").City[];
}

const MinimalCreateSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  builderId: z.string().uuid("Please select a builder"),
  managedBy: z.string().optional().or(z.literal("")),
  propertyCategories: z.array(z.string()).min(1, "Please select at least one category"),
  propertyCategory: z.string().optional(),
  propertyType: z.nativeEnum(PropertyType),
  configurations: z.array(z.string()).optional(),
  status: z.nativeEnum(PropertyStatus),
  price: z.number().min(0, "Price must be positive").optional(),
  city_id: z.string().uuid("Please select a city"),
  location_id: z.string().uuid("Please select a location"),
  reraNumber: z.string().optional().or(z.literal("")),
  propertyCode: z.string(),
});

export function CreatePropertyForm({ initialCode, builders, cities }: CreatePropertyFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string>();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [builderId, setBuilderId] = useState("");
  const [managedBy, setManagedBy] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([PropertyCategory.RESIDENTIAL]);
  const [propertyType, setPropertyType] = useState<PropertyType | "">("");
  const [selectedConfigurations, setSelectedConfigurations] = useState<string[]>([]);
  const [status, setStatus] = useState<PropertyStatus>(PropertyStatus.ACTIVE);
  const [cityId, setCityId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [locations, setLocations] = useState<import("@/modules/locations/types").Location[]>([]);

  const ALL_CATEGORIES = Object.values(PropertyCategory);

  // Custom Others input states for Category & Configuration
  const [showCustomCategoryInput, setShowCustomCategoryInput] = useState(false);
  const [customCategoryText, setCustomCategoryText] = useState("");
  const [showCustomConfigInput, setShowCustomConfigInput] = useState(false);
  const [customConfigText, setCustomConfigText] = useState("");

  const submitCustomCategory = () => {
    if (customCategoryText.trim()) {
      handleAddCategory(customCategoryText.trim());
      setCustomCategoryText("");
      setShowCustomCategoryInput(false);
    }
  };

  const submitCustomConfig = () => {
    if (customConfigText.trim()) {
      handleAddConfiguration(customConfigText.trim());
      setCustomConfigText("");
      setShowCustomConfigInput(false);
    }
  };

  useEffect(() => {
    if (cityId) {
      getLocationsByCityAction(cityId).then(setLocations);
    } else {
      setLocations([]);
    }
  }, [cityId]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddCategory = (cat: string) => {
    if (!cat) return;
    if (!selectedCategories.includes(cat)) {
      const updated = [...selectedCategories, cat];
      setSelectedCategories(updated);
      if (errors.propertyCategories || errors.propertyCategory) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next.propertyCategories;
          delete next.propertyCategory;
          return next;
        });
      }
    }
  };

  const handleRemoveCategory = (cat: string) => {
    const updated = selectedCategories.filter((c) => c !== cat);
    setSelectedCategories(updated);
  };

  const handleAddConfiguration = (cfg: string) => {
    if (!cfg) return;
    if (!selectedConfigurations.includes(cfg)) {
      setSelectedConfigurations([...selectedConfigurations, cfg]);
    }
  };

  const handleRemoveConfiguration = (cfg: string) => {
    setSelectedConfigurations(selectedConfigurations.filter(c => c !== cfg));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError(undefined);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const payload: any = {
      ...data,
      builderId,
      propertyCategories: selectedCategories,
      propertyCategory: selectedCategories[0] || undefined,
      propertyType: propertyType === "" ? undefined : propertyType,
      configurations: selectedConfigurations,
      status,
      price: data.price ? Number(data.price) : undefined,
      propertyCode: initialCode, // Force the initial code
      isFeatured: formData.has("isFeatured"),
      isVerified: formData.has("isVerified"),
      isPremium: formData.has("isPremium"),
      city_id: cityId,
      location_id: locationId,
      reraNumber: data.reraNumber === "" ? undefined : data.reraNumber,
    };

    // Dual-write legacy text fields based on selection
    if (cityId) {
      const cityData = cities.find(c => c.id === cityId);
      if (cityData) {
        payload.city = cityData.name;
        payload.state = cityData.state;
      }
    }
    if (locationId) {
      const locData = locations.find(l => l.id === locationId);
      if (locData) {
        if (locData.type === 'SECTOR') {
          payload.sector = locData.name;
          payload.locality = locData.name;
        } else {
          payload.locality = locData.name;
        }
      }
    }

    const result = MinimalCreateSchema.safeParse(payload);

    if (!result.success) {
      const formattedErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        if (!formattedErrors[path]) {
          formattedErrors[path] = issue.message;
        }
      });
      setErrors(formattedErrors);
      return;
    }

    startTransition(async () => {
      try {
        const fullPayload = {
          ...result.data,
          propertyCategories: selectedCategories,
          propertyCategory: selectedCategories[0] || undefined,
          configurations: selectedConfigurations,
          availability: PropertyAvailability.AVAILABLE, // Default requirement
          isFeatured: payload.isFeatured,
          isVerified: payload.isVerified,
          isPremium: payload.isPremium,
        } as CreatePropertyInput;

        const actionResult = await createPropertyAction(fullPayload);

        if (actionResult.success) {
          showToast("Property created successfully. Redirecting to Edit Hub...");
          setTimeout(() => {
            router.push(`/admin/properties/${actionResult.data.id}`);
          }, 1000);
        } else {
          setServerError(actionResult.error);
        }
      } catch (error: any) {
        setServerError(error.message || "An unexpected error occurred.");
      }
    });
  };

  return (
    <>
      <form onSubmit={onSubmit} className="space-y-8" noValidate>
        {serverError && (
          <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md text-sm font-medium" role="alert">
            {serverError}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Create Property</CardTitle>
            <CardDescription>Enter the basic information, categories, and unit types to create this property.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="title">Property Title <span className="text-destructive">*</span></Label>
                <Input
                  id="title"
                  name="title"
                  disabled={isPending}
                  placeholder="e.g. Prestige Shantiniketan 3BHK"
                  aria-invalid={!!errors.title}
                />
                {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
              </div>

              <div className="space-y-2">
                <Label>Builder / Developer <span className="text-destructive">*</span></Label>
                <Select value={builderId} onValueChange={setBuilderId} disabled={isPending}>
                  <SelectTrigger aria-invalid={!!errors.builderId}>
                    <SelectValue placeholder="Select builder/developer" />
                  </SelectTrigger>
                  <SelectContent>
                    {builders.map(b => (
                      <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Original company that developed the project.</p>
                {errors.builderId && <p className="text-sm text-destructive">{errors.builderId}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="managedBy">Managed By <span className="text-xs font-normal text-muted-foreground ml-1">(Optional)</span></Label>
                <Input
                  id="managedBy"
                  name="managedBy"
                  value={managedBy}
                  onChange={(e) => setManagedBy(e.target.value)}
                  disabled={isPending}
                  placeholder="e.g. ABC Developers or Management Co."
                />
                <p className="text-xs text-muted-foreground">Company currently managing or operating the project.</p>
              </div>

              {/* Multi-category selection */}
              <div className="space-y-3 md:col-span-2 p-4 rounded-xl border border-border/70 bg-card/40">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <Label className="text-sm font-semibold text-foreground">
                    Property Categories <span className="text-destructive">*</span>
                  </Label>
                  <span className="text-xs text-muted-foreground">
                    Select and remove all categories that apply to this project
                  </span>
                </div>

                {/* Selected categories tags */}
                <div className="min-h-[44px] p-2.5 rounded-lg border border-input bg-background flex flex-wrap items-center gap-2">
                  {selectedCategories.length === 0 ? (
                    <span className="text-xs text-muted-foreground italic px-1">
                      No categories selected. Please add at least one category below.
                    </span>
                  ) : (
                    selectedCategories.map((cat) => (
                      <span
                        key={cat}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-brand-navy/10 text-brand-navy border border-brand-navy/20 shadow-2xs transition-all animate-in fade-in zoom-in-95"
                      >
                        {cat}
                        <button
                          type="button"
                          onClick={() => handleRemoveCategory(cat)}
                          disabled={isPending}
                          className="hover:bg-brand-navy/20 rounded-full p-0.5 text-brand-navy hover:text-brand-red transition-colors focus:outline-none"
                          title={`Remove ${cat}`}
                          aria-label={`Remove ${cat}`}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))
                  )}
                </div>

                {/* Dropdown to add categories */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                  <Select
                    value=""
                    onValueChange={(val) => {
                      if (val === "__other__") {
                        setShowCustomCategoryInput(true);
                      } else if (val) {
                        handleAddCategory(val);
                      }
                    }}
                    disabled={isPending}
                  >
                    <SelectTrigger className="w-full sm:w-[280px]">
                      <SelectValue placeholder="+ Select category to add..." />
                    </SelectTrigger>
                    <SelectContent>
                      {ALL_CATEGORIES.map((c) => {
                        const isAlreadySelected = selectedCategories.includes(c);
                        return (
                          <SelectItem
                            key={c}
                            value={c}
                            disabled={isAlreadySelected}
                            className={isAlreadySelected ? "opacity-50" : ""}
                          >
                            {c} {isAlreadySelected ? "✓ Added" : ""}
                          </SelectItem>
                        );
                      })}
                      <SelectItem value="__other__" className="font-semibold text-brand-navy border-t border-slate-100 mt-1 pt-1.5 cursor-pointer">
                        ✨ Others (Type custom)...
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Quick-add unselected category pills */}
                  <div className="flex items-center flex-wrap gap-1.5 text-xs">
                    <span className="text-xs font-medium text-muted-foreground mr-1">Quick add:</span>
                    {ALL_CATEGORIES.filter(c => !selectedCategories.includes(c)).slice(0, 5).map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => handleAddCategory(c)}
                        disabled={isPending}
                        className="px-2.5 py-1 rounded-md border border-dashed border-slate-300 hover:border-brand-navy hover:bg-brand-surface text-slate-600 hover:text-brand-navy transition-colors text-xs cursor-pointer font-medium"
                      >
                        + {c}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setShowCustomCategoryInput(true)}
                      disabled={isPending}
                      className="px-2.5 py-1 rounded-md border border-dashed border-brand-navy/60 bg-brand-navy/5 hover:bg-brand-navy hover:text-white text-brand-navy transition-colors text-xs cursor-pointer font-semibold"
                    >
                      + Others
                    </button>
                  </div>
                </div>

                {/* Custom Category Input Box */}
                {showCustomCategoryInput && (
                  <div className="flex items-center gap-2 p-2.5 rounded-lg border border-brand-navy/30 bg-brand-navy/5 max-w-md animate-in fade-in slide-in-from-top-1 duration-200">
                    <Input
                      value={customCategoryText}
                      onChange={(e) => setCustomCategoryText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          submitCustomCategory();
                        } else if (e.key === "Escape") {
                          setShowCustomCategoryInput(false);
                          setCustomCategoryText("");
                        }
                      }}
                      placeholder="Enter custom category (e.g. Penthouse, Plot...)"
                      className="h-8 text-xs bg-white"
                      autoFocus
                      disabled={isPending}
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={submitCustomCategory}
                      disabled={!customCategoryText.trim() || isPending}
                      className="h-8 px-3 text-xs bg-brand-navy hover:bg-brand-navy-hover text-white shrink-0"
                    >
                      Add
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setShowCustomCategoryInput(false);
                        setCustomCategoryText("");
                      }}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground shrink-0"
                      title="Cancel"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {(errors.propertyCategories || errors.propertyCategory) && (
                  <p className="text-sm text-destructive">
                    {errors.propertyCategories || errors.propertyCategory}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Property Type <span className="text-destructive">*</span></Label>
                <Select value={propertyType} onValueChange={(val: PropertyType) => setPropertyType(val)} disabled={isPending}>
                  <SelectTrigger aria-invalid={!!errors.propertyType}>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(PropertyType).map(t => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.propertyType && <p className="text-sm text-destructive">{errors.propertyType}</p>}
              </div>

              <div className="space-y-2">
                <Label>Status <span className="text-destructive">*</span></Label>
                <Select value={status} onValueChange={(val: PropertyStatus) => setStatus(val)} disabled={isPending}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(PropertyStatus).map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Dynamic BHK Configurations selector when Property Type is Apartment, Villa, Penthouse */}
              {isBhkApplicable(propertyType) && (
                <div className="space-y-3 md:col-span-2 p-4 rounded-xl border border-brand-slate/40 bg-brand-surface/40 animate-in fade-in slide-in-from-top-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <Label className="text-sm font-semibold text-brand-navy flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-brand-red" />
                      Available Unit Configurations (BHK)
                    </Label>
                    <span className="text-xs text-muted-foreground">
                      Select all BHK types offered (e.g. 1 BHK, 2 BHK, 3 BHK)
                    </span>
                  </div>

                  {/* Selected BHK badges */}
                  <div className="min-h-[44px] p-2.5 rounded-lg border border-input bg-background flex flex-wrap items-center gap-2">
                    {selectedConfigurations.length === 0 ? (
                      <span className="text-xs text-muted-foreground italic px-1">
                        No BHK configurations selected (Optional). Add one or more below if applicable.
                      </span>
                    ) : (
                      selectedConfigurations.map((cfg) => (
                        <span
                          key={cfg}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-brand-red/10 text-brand-red border border-brand-red/20 shadow-2xs transition-all animate-in fade-in zoom-in-95"
                        >
                          {cfg}
                          <button
                            type="button"
                            onClick={() => handleRemoveConfiguration(cfg)}
                            disabled={isPending}
                            className="hover:bg-brand-red/20 rounded-full p-0.5 text-brand-red hover:text-brand-red-hover transition-colors focus:outline-none"
                            title={`Remove ${cfg}`}
                            aria-label={`Remove ${cfg}`}
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ))
                    )}
                  </div>

                  {/* Dropdown to add configurations */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                    <Select
                      value=""
                      onValueChange={(val) => {
                        if (val === "__other__") {
                          setShowCustomConfigInput(true);
                        } else if (val) {
                          handleAddConfiguration(val);
                        }
                      }}
                      disabled={isPending}
                    >
                      <SelectTrigger className="w-full sm:w-[280px]">
                        <SelectValue placeholder="+ Select BHK configuration to add..." />
                      </SelectTrigger>
                      <SelectContent>
                        {PROPERTY_CONFIGURATIONS.map((cfg) => {
                          const isAlreadySelected = selectedConfigurations.includes(cfg);
                          return (
                            <SelectItem
                              key={cfg}
                              value={cfg}
                              disabled={isAlreadySelected}
                              className={isAlreadySelected ? "opacity-50" : ""}
                            >
                              {cfg} {isAlreadySelected ? "✓ Added" : ""}
                            </SelectItem>
                          );
                        })}
                        <SelectItem value="__other__" className="font-semibold text-brand-red border-t border-slate-100 mt-1 pt-1.5 cursor-pointer">
                          ✨ Others (Type custom)...
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Quick-add popular BHK pills */}
                    <div className="flex items-center flex-wrap gap-1.5 text-xs">
                      <span className="text-xs font-medium text-muted-foreground mr-1">Quick add:</span>
                      {['1 BHK', '2 BHK', '3 BHK', '4 BHK', '1 RK / Studio'].filter(c => !selectedConfigurations.includes(c)).map(c => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => handleAddConfiguration(c)}
                          disabled={isPending}
                          className="px-2.5 py-1 rounded-md border border-dashed border-brand-red/40 hover:border-brand-red hover:bg-brand-red/10 text-brand-red transition-colors text-xs cursor-pointer font-medium"
                        >
                          + {c}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => setShowCustomConfigInput(true)}
                        disabled={isPending}
                        className="px-2.5 py-1 rounded-md border border-dashed border-brand-red/60 bg-brand-red/5 hover:bg-brand-red hover:text-white text-brand-red transition-colors text-xs cursor-pointer font-semibold"
                      >
                        + Others
                      </button>
                    </div>
                  </div>

                  {/* Custom Configuration Input Box */}
                  {showCustomConfigInput && (
                    <div className="flex items-center gap-2 p-2.5 rounded-lg border border-brand-red/30 bg-brand-red/5 max-w-md animate-in fade-in slide-in-from-top-1 duration-200">
                      <Input
                        value={customConfigText}
                        onChange={(e) => setCustomConfigText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            submitCustomConfig();
                          } else if (e.key === "Escape") {
                            setShowCustomConfigInput(false);
                            setCustomConfigText("");
                          }
                        }}
                        placeholder="Enter custom configuration (e.g. 5 BHK, Duplex...)"
                        className="h-8 text-xs bg-white"
                        autoFocus
                        disabled={isPending}
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={submitCustomConfig}
                        disabled={!customConfigText.trim() || isPending}
                        className="h-8 px-3 text-xs bg-brand-red hover:bg-brand-red-hover text-white shrink-0"
                      >
                        Add
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setShowCustomConfigInput(false);
                          setCustomConfigText("");
                        }}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground shrink-0"
                        title="Cancel"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="price">Price (Optional)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  disabled={isPending}
                  aria-invalid={!!errors.price}
                />
                {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="reraNumber">RERA Number (Optional)</Label>
                <Input
                  id="reraNumber"
                  name="reraNumber"
                  placeholder="e.g. PRM/KA/RERA/1251/446/PR/190809/002766"
                  disabled={isPending}
                  aria-invalid={!!errors.reraNumber}
                />
                {errors.reraNumber && <p className="text-sm text-destructive">{errors.reraNumber}</p>}
              </div>

              <div className="space-y-2">
                <Label>City <span className="text-destructive">*</span></Label>
                <CityCombobox
                  cities={cities}
                  value={cityId}
                  onChange={(val) => {
                    setCityId(val);
                    setLocationId("");
                  }}
                  disabled={isPending}
                  onCityCreated={(newCity) => {
                    cities.push(newCity);
                  }}
                />
                {errors.city_id && <p className="text-sm text-destructive">{errors.city_id}</p>}
              </div>

              <div className="space-y-2 relative z-10">
                <Label>Location (Locality/Sector) <span className="text-destructive">*</span></Label>
                <LocationCombobox
                  locations={locations}
                  cityId={cityId}
                  value={locationId}
                  onChange={setLocationId}
                  disabled={isPending || !cityId}
                  onLocationCreated={(newLoc) => setLocations(prev => [...prev, newLoc].sort((a, b) => a.name.localeCompare(b.name)))}
                />
                {errors.location_id && <p className="text-sm text-destructive">{errors.location_id}</p>}
              </div>

              <div className="space-y-4 md:col-span-2 pt-4 border-t">
                <Label className="text-base font-semibold">Property Visibility</Label>
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isFeatured"
                      name="isFeatured"
                      disabled={isPending}
                      className="h-4 w-4 rounded border-brand-slate/50 text-brand-red focus:ring-brand-red"
                    />
                    <Label htmlFor="isFeatured" className="cursor-pointer">Featured Project</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isPremium"
                      name="isPremium"
                      disabled={isPending}
                      className="h-4 w-4 rounded border-brand-slate/50 text-brand-red focus:ring-brand-red"
                    />
                    <Label htmlFor="isPremium" className="cursor-pointer">Premium Project</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isVerified"
                      name="isVerified"
                      disabled={isPending}
                      className="h-4 w-4 rounded border-brand-slate/50 text-brand-red focus:ring-brand-red"
                    />
                    <Label htmlFor="isVerified" className="cursor-pointer">Verified Project</Label>
                  </div>
                </div>
              </div>

            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-4 border-t px-6 py-4 bg-muted/50">
            <Button variant="outline" asChild disabled={isPending}>
              <Link href="/admin/properties">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create & Continue"}
            </Button>
          </CardFooter>
        </Card>
      </form>

      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 rounded-md bg-zinc-900 px-4 py-3 text-sm font-medium text-white shadow-lg transition-all animate-in fade-in slide-in-from-bottom-4">
          {toastMessage}
        </div>
      )}
    </>
  );
}
