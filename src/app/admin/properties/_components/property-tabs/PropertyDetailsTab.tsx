"use client";

import { useState, useTransition, useMemo } from "react";
import { Property } from "@/modules/properties/types/property";
import {
  ConstructionStatus,
  PropertyAvailability,
  PROPERTY_CONFIGURATIONS,
} from "@/modules/properties/types/enums";
import {
  PropertyConfiguration,
  PropertyConfigurationInput
} from "@/modules/properties/types/configuration";
import {
  savePropertyConfigurationAction,
  deletePropertyConfigurationAction,
  syncPropertyConfigurationsAction
} from "@/modules/properties/actions/configurations.actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Layers,
  Info,
  Plus,
  Check,
  ChevronDown,
  ChevronUp,
  Trash2,
  Save,
  Building2,
  Sparkles,
  AlertCircle
} from "lucide-react";

interface LocalConfigState extends PropertyConfigurationInput {
  isSaved?: boolean;
  isExpanded?: boolean;
}

interface PropertyDetailsTabProps {
  property: Property;
}

const FACING_OPTIONS = [
  "North",
  "North-East",
  "East",
  "South-East",
  "South",
  "South-West",
  "West",
  "North-West",
];

const AVAILABILITY_OPTIONS = [
  { value: "AVAILABLE", label: "Available" },
  { value: "RESERVED", label: "Few Units Left / Reserved" },
  { value: "SOLD_OUT", label: "Sold Out" },
];

function deriveDefaultBedrooms(cfgType: string): number | null {
  const match = cfgType.match(/(\d+)/);
  if (match) {
    const num = parseInt(match[1], 10);
    return isNaN(num) ? null : num;
  }
  if (cfgType.toLowerCase().includes("studio") || cfgType.toLowerCase().includes("1 rk")) {
    return 1;
  }
  return null;
}

function formatPriceLive(price: number | null | undefined): string {
  if (!price || price <= 0) return "Price on Request";
  if (price >= 10000000) {
    const cr = price / 10000000;
    return `\u20B9 ${cr.toFixed(2).replace(/\.00$/, '')} Cr onwards`;
  }
  if (price >= 100000) {
    const lakhs = price / 100000;
    return `\u20B9 ${lakhs.toFixed(2).replace(/\.00$/, '')} Lakhs onwards`;
  }
  return `\u20B9 ${price.toLocaleString('en-IN')} onwards`;
}

export function PropertyDetailsTab({ property }: PropertyDetailsTabProps) {
  const [isPending, startTransition] = useTransition();
  const [savingConfigId, setSavingConfigId] = useState<string | null>(null);
  const [configToDelete, setConfigToDelete] = useState<{ index: number; type: string; id?: string } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize configurations from property.propertyConfigurations or fallback
  const initialConfigs = useMemo<LocalConfigState[]>(() => {
    if (property.propertyConfigurations && property.propertyConfigurations.length > 0) {
      return property.propertyConfigurations.map((c, idx) => ({
        ...c,
        isSaved: true,
        isExpanded: idx === 0, // expand first by default
      }));
    }

    // Fallback: seed from property.configurations or bedrooms
    const seedTypes = property.configurations && property.configurations.length > 0
      ? property.configurations
      : (property.bedrooms ? [`${property.bedrooms} BHK`] : []);

    if (seedTypes.length > 0) {
      return seedTypes.map((type, idx) => ({
        configurationType: type,
        bedrooms: deriveDefaultBedrooms(type) ?? property.bedrooms ?? null,
        bathrooms: property.bathrooms ?? (deriveDefaultBedrooms(type) || 1),
        balconies: property.balconies ?? 1,
        parkingSlots: property.parking ?? 1,
        superBuiltUpArea: property.superBuiltupArea ?? null,
        carpetArea: property.carpetArea ?? null,
        floorNumber: property.floorNumber ?? null,
        totalFloors: property.totalFloors ?? null,
        facing: property.facing || null,
        possessionDate: property.possessionDate ? property.possessionDate.split('T')[0] : null,
        constructionStatus: property.constructionStatus || null,
        basePrice: property.price ?? null,
        availability: property.availability || "AVAILABLE",
        displayOrder: idx,
        isSaved: false,
        isExpanded: idx === 0,
      }));
    }

    return [];
  }, [property]);

  const [configurations, setConfigurations] = useState<LocalConfigState[]>(initialConfigs);

  // Custom configuration input state
  const [showCustomConfigInput, setShowCustomConfigInput] = useState(false);
  const [customConfigText, setCustomConfigText] = useState("");

  const submitCustomConfig = () => {
    if (customConfigText.trim()) {
      handleAddConfiguration(customConfigText.trim());
      setCustomConfigText("");
      setShowCustomConfigInput(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const showError = (err: string) => {
    setErrorMessage(err);
    setTimeout(() => setErrorMessage(null), 5000);
  };

  // Add configuration from dropdown or quick-add
  const handleAddConfiguration = (cfgType: string) => {
    if (!cfgType) return;
    const existingIndex = configurations.findIndex(c => c.configurationType.toLowerCase() === cfgType.toLowerCase());
    if (existingIndex >= 0) {
      // Already exists - just expand it and show toast
      setConfigurations(prev => prev.map((c, idx) => ({
        ...c,
        isExpanded: idx === existingIndex ? true : c.isExpanded,
      })));
      showToast(`${cfgType} configuration already added. Opened for editing.`);
      return;
    }

    const defaultBedrooms = deriveDefaultBedrooms(cfgType);
    const newConfig: LocalConfigState = {
      configurationType: cfgType,
      bedrooms: defaultBedrooms,
      bathrooms: defaultBedrooms ? Math.max(1, Math.min(defaultBedrooms, 3)) : 1,
      balconies: 1,
      parkingSlots: 1,
      superBuiltUpArea: null,
      carpetArea: null,
      floorNumber: property.floorNumber ?? null,
      totalFloors: property.totalFloors ?? null,
      facing: property.facing || null,
      possessionDate: property.possessionDate ? property.possessionDate.split('T')[0] : null,
      constructionStatus: property.constructionStatus || null,
      basePrice: null,
      availability: "AVAILABLE",
      displayOrder: configurations.length,
      isSaved: false,
      isExpanded: true,
    };

    setConfigurations([...configurations, newConfig]);
    showToast(`Added ${cfgType} configuration card. Fill in details and save.`);
  };

  // Trigger remove modal popup
  const handleRemoveConfiguration = (index: number) => {
    const target = configurations[index];
    if (!target) return;
    setConfigToDelete({ index, type: target.configurationType, id: target.id });
  };

  // Confirm and execute removal
  const confirmDeleteConfig = () => {
    if (!configToDelete) return;
    const { index, type, id } = configToDelete;
    setConfigToDelete(null);

    if (id) {
      startTransition(async () => {
        try {
          const res = await deletePropertyConfigurationAction(id, property.id);
          if (!res.success) {
            toast.error(res.error || "Failed to delete configuration");
            showError(res.error);
            return;
          }
          setConfigurations(prev => prev.filter((_, idx) => idx !== index));
          toast.success(`${type} configuration deleted successfully.`);
          showToast(`${type} configuration deleted.`);
        } catch (err: any) {
          const msg = err.message || "Failed to delete configuration";
          toast.error(msg);
          showError(msg);
        }
      });
    } else {
      setConfigurations(prev => prev.filter((_, idx) => idx !== index));
      toast.success(`${type} configuration removed.`);
      showToast(`${type} configuration removed.`);
    }
  };

  // Update a single field in a configuration
  const handleFieldChange = (index: number, field: keyof PropertyConfigurationInput, value: any) => {
    setConfigurations(prev => prev.map((cfg, idx) => {
      if (idx !== index) return cfg;
      return {
        ...cfg,
        [field]: value,
        isSaved: false, // Mark modified
      };
    }));
  };

  // Toggle card expanded
  const toggleExpanded = (index: number) => {
    setConfigurations(prev => prev.map((cfg, idx) => {
      if (idx !== index) return cfg;
      return {
        ...cfg,
        isExpanded: !cfg.isExpanded,
      };
    }));
  };

  // Save single configuration
  const handleSaveSingleConfig = (index: number) => {
    const config = configurations[index];
    if (!config) return;

    if (!config.configurationType) {
      showError("Configuration type is required.");
      return;
    }

    setSavingConfigId(config.id || `temp-${index}`);
    startTransition(async () => {
      try {
        const payload: PropertyConfigurationInput = {
          id: config.id,
          propertyId: property.id,
          configurationType: config.configurationType,
          bedrooms: config.bedrooms !== null && config.bedrooms !== undefined ? Number(config.bedrooms) : null,
          bathrooms: config.bathrooms !== null && config.bathrooms !== undefined ? Number(config.bathrooms) : null,
          balconies: config.balconies !== null && config.balconies !== undefined ? Number(config.balconies) : null,
          parkingSlots: config.parkingSlots !== null && config.parkingSlots !== undefined ? Number(config.parkingSlots) : null,
          superBuiltUpArea: config.superBuiltUpArea !== null && config.superBuiltUpArea !== undefined ? Number(config.superBuiltUpArea) : null,
          carpetArea: config.carpetArea !== null && config.carpetArea !== undefined ? Number(config.carpetArea) : null,
          floorNumber: config.floorNumber !== null && config.floorNumber !== undefined ? Number(config.floorNumber) : null,
          totalFloors: config.totalFloors !== null && config.totalFloors !== undefined ? Number(config.totalFloors) : null,
          facing: config.facing || null,
          possessionDate: config.possessionDate || null,
          constructionStatus: config.constructionStatus || null,
          basePrice: config.basePrice !== null && config.basePrice !== undefined ? Number(config.basePrice) : null,
          priceDisplay: config.basePrice ? formatPriceLive(Number(config.basePrice)) : null,
          availability: config.availability || "AVAILABLE",
          displayOrder: index,
        };

        const res = await savePropertyConfigurationAction(property.id, payload);
        if (!res.success) {
          showError(res.error);
          return;
        }

        setConfigurations(prev => prev.map((c, idx) => {
          if (idx !== index) return c;
          return {
            ...c,
            ...res.data,
            isSaved: true,
          };
        }));

        showToast(`${config.configurationType} Configuration saved successfully!`);
      } catch (err: any) {
        showError(err.message || "Failed to save configuration");
      } finally {
        setSavingConfigId(null);
      }
    });
  };

  // Save all configurations
  const handleSaveAllConfigs = () => {
    if (configurations.length === 0) {
      showError("Please add at least one unit configuration.");
      return;
    }

    startTransition(async () => {
      try {
        const payloadList: PropertyConfigurationInput[] = configurations.map((c, idx) => ({
          id: c.id,
          propertyId: property.id,
          configurationType: c.configurationType,
          bedrooms: c.bedrooms !== null && c.bedrooms !== undefined ? Number(c.bedrooms) : null,
          bathrooms: c.bathrooms !== null && c.bathrooms !== undefined ? Number(c.bathrooms) : null,
          balconies: c.balconies !== null && c.balconies !== undefined ? Number(c.balconies) : null,
          parkingSlots: c.parkingSlots !== null && c.parkingSlots !== undefined ? Number(c.parkingSlots) : null,
          superBuiltUpArea: c.superBuiltUpArea !== null && c.superBuiltUpArea !== undefined ? Number(c.superBuiltUpArea) : null,
          carpetArea: c.carpetArea !== null && c.carpetArea !== undefined ? Number(c.carpetArea) : null,
          floorNumber: c.floorNumber !== null && c.floorNumber !== undefined ? Number(c.floorNumber) : null,
          totalFloors: c.totalFloors !== null && c.totalFloors !== undefined ? Number(c.totalFloors) : null,
          facing: c.facing || null,
          possessionDate: c.possessionDate || null,
          constructionStatus: c.constructionStatus || null,
          basePrice: c.basePrice !== null && c.basePrice !== undefined ? Number(c.basePrice) : null,
          priceDisplay: c.basePrice ? formatPriceLive(Number(c.basePrice)) : null,
          availability: c.availability || "AVAILABLE",
          displayOrder: idx,
        }));

        const res = await syncPropertyConfigurationsAction(property.id, payloadList);
        if (!res.success) {
          showError(res.error);
          return;
        }

        setConfigurations(res.data.map(c => ({
          ...c,
          isSaved: true,
          isExpanded: false,
        })));

        showToast("All configurations synchronized and saved successfully!");
      } catch (err: any) {
        showError(err.message || "Failed to save configurations");
      }
    });
  };

  const selectedTypes = configurations.map(c => c.configurationType);

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-lg flex items-center justify-between text-sm shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-600" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-600 hover:text-emerald-900">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 bg-rose-50 border border-rose-300 text-rose-800 rounded-lg flex items-center justify-between text-sm shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="text-rose-600 hover:text-rose-900">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Step 1: Select Available Unit Configurations */}
      <Card className="border border-brand-slate/40 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2 text-brand-navy">
                <Layers className="h-5 w-5 text-brand-blue" />
                Available Unit Configurations
              </CardTitle>
              <CardDescription className="mt-1">
                Select each unit type offered in this project (e.g. 1 BHK, 2 BHK, 3 BHK, Studio, Office). Each configuration has its own independent specifications and base price.
              </CardDescription>
            </div>
            <Badge variant="outline" className="font-medium text-brand-navy bg-brand-surface border-brand-slate/40">
              {configurations.length} {configurations.length === 1 ? 'Configuration' : 'Configurations'}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-1">
          {/* Active configuration badges */}
          <div className="flex flex-wrap items-center gap-2 min-h-[46px] p-2.5 rounded-xl border border-brand-slate/40 bg-brand-surface/40">
            {configurations.length === 0 ? (
              <span className="text-sm text-muted-foreground italic px-1">
                No configurations selected yet. Use the dropdown or quick-add buttons below.
              </span>
            ) : (
              configurations.map((cfg, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-brand-blue/10 text-brand-blue border border-brand-blue/30 shadow-xs"
                >
                  <Building2 className="h-3 w-3" />
                  {cfg.configurationType}
                  {cfg.basePrice ? (
                    <span className="text-xs text-brand-navy/60 font-normal">
                      • {formatPriceLive(cfg.basePrice)}
                    </span>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => handleRemoveConfiguration(idx)}
                    className="ml-1 p-0.5 rounded-full hover:bg-brand-blue/20 text-brand-blue transition-colors"
                    title={`Remove ${cfg.configurationType}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))
            )}
          </div>

          {/* Selector controls: dropdown + quick-add pills */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="w-full sm:w-72">
              <Select onValueChange={(val) => {
                if (val === "__other__") {
                  setShowCustomConfigInput(true);
                } else if (val) {
                  handleAddConfiguration(val);
                }
              }}>
                <SelectTrigger className="w-full bg-white h-9 text-xs">
                  <SelectValue placeholder="+ Select configuration to add..." />
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  {PROPERTY_CONFIGURATIONS.map((cfg) => {
                    const isAdded = selectedTypes.includes(cfg);
                    return (
                      <SelectItem key={cfg} value={cfg} disabled={isAdded}>
                        <div className="flex items-center justify-between w-full">
                          <span>{cfg}</span>
                          {isAdded && <span className="text-muted-foreground text-xs ml-2">(Added)</span>}
                        </div>
                      </SelectItem>
                    );
                  })}
                  <SelectItem value="__other__" className="font-semibold text-brand-navy border-t border-slate-100 mt-1 pt-1.5 cursor-pointer">
                    ✨ Others (Type custom)...
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Quick-add pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-muted-foreground font-medium mr-1">Quick add:</span>
              {["1 BHK", "2 BHK", "3 BHK", "4 BHK", "Studio", "Office"].map((preset) => {
                const isAdded = selectedTypes.includes(preset);
                return (
                  <Button
                    key={preset}
                    type="button"
                    variant={isAdded ? "secondary" : "outline"}
                    size="sm"
                    disabled={isAdded}
                    onClick={() => handleAddConfiguration(preset)}
                    className="h-7 text-xs px-2.5 rounded-full"
                  >
                    {isAdded ? <Check className="h-3 w-3 mr-1 text-emerald-600" /> : <Plus className="h-3 w-3 mr-1" />}
                    {preset}
                  </Button>
                );
              })}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowCustomConfigInput(true)}
                className="h-7 text-xs px-2.5 rounded-full border-dashed border-brand-navy/60 bg-brand-navy/5 hover:bg-brand-navy hover:text-white text-brand-navy font-semibold cursor-pointer"
              >
                <Plus className="h-3 w-3 mr-1" />
                Others
              </Button>
            </div>
          </div>

          {/* Custom Configuration Input Box */}
          {showCustomConfigInput && (
            <div className="flex items-center gap-2 p-2.5 rounded-lg border border-brand-navy/30 bg-brand-navy/5 max-w-md animate-in fade-in slide-in-from-top-1 duration-200">
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
              />
              <Button
                type="button"
                size="sm"
                onClick={submitCustomConfig}
                disabled={!customConfigText.trim()}
                className="h-8 px-3 text-xs bg-brand-navy hover:bg-brand-navy-hover text-white shrink-0"
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

          {/* Informational Callout */}
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-blue-50/70 border border-blue-200/60 text-xs text-blue-900 leading-relaxed">
            <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-blue-950">Independent Specification & Pricing Model</p>
              <p className="text-blue-800/90 mt-0.5">
                Each configuration card below stores its own independent bedrooms, bathrooms, carpet area, and base price. The base price is displayed publicly as <strong>&quot;₹X Lakhs onwards&quot;</strong>. Floor plans can be linked per configuration in the <strong>Floor Plans</strong> tab.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 2: Separate Configuration Cards */}
      <div className="space-y-4">
        {configurations.length === 0 ? (
          <Card className="border border-dashed border-brand-slate/60 p-8 text-center bg-brand-surface/20">
            <Building2 className="h-10 w-10 text-brand-navy/30 mx-auto mb-3" />
            <h3 className="font-semibold text-brand-navy text-base">No Unit Configurations Selected</h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto mt-1 mb-4">
              Add your unit configurations (e.g. 1 BHK, 2 BHK, 3 BHK) using the selector above. Expandable specification cards will appear here for each configuration.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Button size="sm" variant="outline" onClick={() => handleAddConfiguration("1 BHK")} className="text-xs">
                + Add 1 BHK
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleAddConfiguration("2 BHK")} className="text-xs">
                + Add 2 BHK
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleAddConfiguration("3 BHK")} className="text-xs">
                + Add 3 BHK
              </Button>
            </div>
          </Card>
        ) : (
          configurations.map((cfg, index) => {
            const isSavingThis = savingConfigId === (cfg.id || `temp-${index}`) || (isPending && !savingConfigId);
            const livePriceText = formatPriceLive(cfg.basePrice);

            return (
              <Card
                key={cfg.id || `${cfg.configurationType}-${index}`}
                className={`border transition-all duration-200 ${
                  cfg.isExpanded ? "border-brand-blue/50 shadow-md ring-1 ring-brand-blue/20" : "border-brand-slate/40 shadow-xs hover:border-brand-slate/70"
                }`}
              >
                {/* Expandable Card Header */}
                <CardHeader className="py-3 px-5 bg-gradient-to-r from-brand-surface/50 to-white border-b border-brand-slate/20">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center shrink-0">
                        <Building2 className="h-5 w-5 text-brand-blue" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-heading font-bold text-base text-brand-navy">
                            {cfg.configurationType} Configuration
                          </h3>
                          {cfg.isSaved ? (
                            <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-semibold py-0 px-2 h-5">
                              <Check className="h-2.5 w-2.5 mr-1" />
                              Saved
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] font-semibold py-0 px-2 h-5">
                              Unsaved changes
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-brand-navy/60 mt-0.5">
                          <span>{cfg.carpetArea ? `${cfg.carpetArea} sq.ft. carpet` : "Carpet on req"}</span>
                          <span>•</span>
                          <span>{cfg.bathrooms ? `${cfg.bathrooms} Bath` : "Bath on req"}</span>
                          <span>•</span>
                          <span className="font-semibold text-brand-red">{livePriceText}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveConfiguration(index)}
                        className="h-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2 text-xs"
                        title="Delete configuration"
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                        Remove
                      </Button>

                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => toggleExpanded(index)}
                        className="h-8 px-3 text-xs gap-1.5"
                      >
                        {cfg.isExpanded ? (
                          <>
                            <span>Collapse</span>
                            <ChevronUp className="h-3.5 w-3.5" />
                          </>
                        ) : (
                          <>
                            <span>Edit Details</span>
                            <ChevronDown className="h-3.5 w-3.5" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {/* Collapsible Card Body: Exact 12 Fields */}
                {cfg.isExpanded && (
                  <CardContent className="p-6 space-y-6 animate-in slide-in-from-top-1 duration-200">
                    {/* Section 1: Room & Parking Specifications (Fields 1-4) */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-brand-navy/70 mb-3 flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-brand-blue" />
                        Rooms &amp; Parking Specifications
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* 1. Bedrooms */}
                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold text-brand-navy">
                            1. Bedrooms (Primary / Min)
                          </Label>
                          <Input
                            type="number"
                            min="0"
                            placeholder="e.g. 2"
                            value={cfg.bedrooms ?? ""}
                            onChange={(e) => handleFieldChange(index, "bedrooms", e.target.value === "" ? null : Number(e.target.value))}
                            className="bg-white"
                          />
                        </div>

                        {/* 2. Bathrooms */}
                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold text-brand-navy">
                            2. Bathrooms
                          </Label>
                          <Input
                            type="number"
                            min="0"
                            placeholder="e.g. 2"
                            value={cfg.bathrooms ?? ""}
                            onChange={(e) => handleFieldChange(index, "bathrooms", e.target.value === "" ? null : Number(e.target.value))}
                            className="bg-white"
                          />
                        </div>

                        {/* 3. Balconies */}
                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold text-brand-navy">
                            3. Balconies
                          </Label>
                          <Input
                            type="number"
                            min="0"
                            placeholder="e.g. 1"
                            value={cfg.balconies ?? ""}
                            onChange={(e) => handleFieldChange(index, "balconies", e.target.value === "" ? null : Number(e.target.value))}
                            className="bg-white"
                          />
                        </div>

                        {/* 4. Parking Slots */}
                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold text-brand-navy">
                            4. Parking Slots
                          </Label>
                          <Input
                            type="number"
                            min="0"
                            placeholder="e.g. 1"
                            value={cfg.parkingSlots ?? ""}
                            onChange={(e) => handleFieldChange(index, "parkingSlots", e.target.value === "" ? null : Number(e.target.value))}
                            className="bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section 2: Areas & Floor Information (Fields 5-8) */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-brand-navy/70 mb-3 flex items-center gap-1.5">
                        <Layers className="h-3.5 w-3.5 text-brand-blue" />
                        Areas &amp; Floor Dimensions
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* 5. Super Built-up Area */}
                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold text-brand-navy">
                            5. Super Built-up Area (Sq.ft)
                          </Label>
                          <Input
                            type="number"
                            min="0"
                            step="any"
                            placeholder="e.g. 1450"
                            value={cfg.superBuiltUpArea ?? ""}
                            onChange={(e) => handleFieldChange(index, "superBuiltUpArea", e.target.value === "" ? null : Number(e.target.value))}
                            className="bg-white"
                          />
                        </div>

                        {/* 6. Carpet Area */}
                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold text-brand-navy">
                            6. Carpet Area (Sq.ft)
                          </Label>
                          <Input
                            type="number"
                            min="0"
                            step="any"
                            placeholder="e.g. 1150"
                            value={cfg.carpetArea ?? ""}
                            onChange={(e) => handleFieldChange(index, "carpetArea", e.target.value === "" ? null : Number(e.target.value))}
                            className="bg-white font-medium"
                          />
                        </div>

                        {/* 7. Floor Number */}
                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold text-brand-navy">
                            7. Floor Number
                          </Label>
                          <Input
                            type="number"
                            placeholder="e.g. 5"
                            value={cfg.floorNumber ?? ""}
                            onChange={(e) => handleFieldChange(index, "floorNumber", e.target.value === "" ? null : Number(e.target.value))}
                            className="bg-white"
                          />
                        </div>

                        {/* 8. Total Floors */}
                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold text-brand-navy">
                            8. Total Floors
                          </Label>
                          <Input
                            type="number"
                            min="1"
                            placeholder="e.g. 25"
                            value={cfg.totalFloors ?? ""}
                            onChange={(e) => handleFieldChange(index, "totalFloors", e.target.value === "" ? null : Number(e.target.value))}
                            className="bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section 3: Architecture, Timeline & Pricing (Fields 9-12) */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-brand-navy/70 mb-3 flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5 text-brand-blue" />
                        Facing, Possession, Status &amp; Pricing
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* 9. Facing */}
                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold text-brand-navy">
                            9. Facing
                          </Label>
                          <Select
                            value={cfg.facing || "none"}
                            onValueChange={(val) => handleFieldChange(index, "facing", val === "none" ? null : val)}
                          >
                            <SelectTrigger className="bg-white">
                              <SelectValue placeholder="Select facing" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Not specified</SelectItem>
                              {FACING_OPTIONS.map((facing) => (
                                <SelectItem key={facing} value={facing}>
                                  {facing}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* 10. Possession Date */}
                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold text-brand-navy">
                            10. Possession Date
                          </Label>
                          <Input
                            type="date"
                            value={cfg.possessionDate || ""}
                            onChange={(e) => handleFieldChange(index, "possessionDate", e.target.value || null)}
                            className="bg-white"
                          />
                        </div>

                        {/* 11. Construction Status */}
                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold text-brand-navy">
                            11. Construction Status
                          </Label>
                          <Select
                            value={cfg.constructionStatus || "none"}
                            onValueChange={(val) => handleFieldChange(index, "constructionStatus", val === "none" ? null : val)}
                          >
                            <SelectTrigger className="bg-white">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Project Default</SelectItem>
                              {Object.values(ConstructionStatus).map((status) => (
                                <SelectItem key={status} value={status}>
                                  {status.replace(/_/g, " ")}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* 12. Base Price */}
                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold text-brand-navy flex items-center justify-between">
                            <span>12. Base Price (in ₹)</span>
                            <span className="text-[11px] font-normal text-brand-red">{livePriceText}</span>
                          </Label>
                          <Input
                            type="number"
                            min="0"
                            step="any"
                            placeholder="e.g. 3500000"
                            value={cfg.basePrice ?? ""}
                            onChange={(e) => handleFieldChange(index, "basePrice", e.target.value === "" ? null : Number(e.target.value))}
                            className="bg-white font-semibold text-brand-navy"
                          />
                          <p className="text-[11px] text-muted-foreground">
                            Displayed on public site as: <strong>{livePriceText}</strong>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Extra: Availability */}
                    <div className="pt-2 border-t border-brand-slate/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <Label className="text-xs font-semibold text-brand-navy shrink-0">
                          Unit Availability:
                        </Label>
                        <Select
                          value={cfg.availability || "AVAILABLE"}
                          onValueChange={(val) => handleFieldChange(index, "availability", val)}
                        >
                          <SelectTrigger className="w-52 h-8 text-xs bg-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {AVAILABILITY_OPTIONS.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <Button
                        type="button"
                        size="sm"
                        disabled={isSavingThis}
                        onClick={() => handleSaveSingleConfig(index)}
                        className="bg-brand-blue hover:bg-brand-blue/90 text-white font-medium text-xs h-9 px-4 gap-1.5 shadow-sm"
                      >
                        <Save className="h-3.5 w-3.5" />
                        {isSavingThis ? "Saving..." : `Save ${cfg.configurationType}`}
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })
        )}
      </div>

      {/* Global Actions Footer */}
      {configurations.length > 0 && (
        <Card className="border border-brand-slate/40 bg-brand-surface/40 p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-muted-foreground text-center sm:text-left">
              <strong>{configurations.length}</strong> configurations configured. Changes will automatically synchronize the starting price and available BHK lists on the public site.
            </div>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddConfiguration("Penthouse")}
                className="text-xs"
              >
                + Add Another Configuration
              </Button>
              <Button
                type="button"
                disabled={isPending}
                onClick={handleSaveAllConfigs}
                className="bg-brand-red hover:bg-brand-red/90 text-white font-semibold text-xs h-9 px-5 shadow-sm gap-2"
              >
                <Save className="h-4 w-4" />
                {isPending ? "Saving All Configurations..." : "Save All Configurations"}
              </Button>
            </div>
          </div>
        </Card>
      )}
      {/* Remove Configuration Confirmation Pop-up */}
      <AlertDialog open={!!configToDelete} onOpenChange={(open) => !open && setConfigToDelete(null)}>
        <AlertDialogContent className="max-w-md bg-white border border-brand-slate/40 shadow-xl rounded-2xl p-6">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-bold text-brand-navy flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-brand-red" />
              Remove Configuration?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-brand-navy/70 leading-relaxed pt-1">
              Are you sure you want to remove the <span className="font-semibold text-brand-red">{configToDelete?.type}</span> configuration?
              {configToDelete?.id ? " All saved specifications, floor areas, and pricing for this unit will be permanently removed." : " This unsaved unit card will be removed from your list."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-5 flex items-center justify-end gap-2.5">
            <AlertDialogCancel className="h-9 px-4 text-xs font-medium rounded-lg border-brand-slate/40 text-brand-navy hover:bg-brand-surface">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteConfig}
              className="h-9 px-4 text-xs font-semibold rounded-lg bg-brand-red hover:bg-brand-red/90 text-white shadow-xs"
            >
              Yes, Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
