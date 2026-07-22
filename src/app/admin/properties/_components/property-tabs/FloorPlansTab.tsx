"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/text-area";
import { PropertyFloorPlan, CreatePropertyFloorPlanSchema } from "@/modules/properties/types/assets";
import { getFloorPlansAction, uploadFloorPlanAction, updateFloorPlanAction, deleteFloorPlanAction, updateFloorPlanOrderAction } from "@/modules/properties/actions/assets.actions";
import { FloorPlanCard } from "./assets/FloorPlanCard";
import { ImageLightbox } from "./media/ImageLightbox";
import { UploadCloud, Plus, Loader2, Image as ImageIcon } from "lucide-react";

interface FloorPlansTabProps {
  propertyId: string;
}

export function FloorPlansTab({ propertyId }: FloorPlansTabProps) {
  const [floorPlans, setFloorPlans] = useState<PropertyFloorPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    floorNumber: "",
    configuration: "",
    area: "",
    unit: "sq.ft",
    description: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drag and drop state for sorting
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // Lightbox
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const fetchFloorPlans = async () => {
    setIsLoading(true);
    try {
      const result = await getFloorPlansAction(propertyId);
      if (result.success) {
        setFloorPlans(result.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFloorPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyId]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenForm = (fp?: PropertyFloorPlan) => {
    if (fp) {
      setEditingId(fp.id);
      setFormData({
        name: fp.name,
        floorNumber: fp.floorNumber || "",
        configuration: fp.configuration,
        area: fp.area.toString(),
        unit: fp.unit,
        description: fp.description || "",
      });
      setSelectedFile(null);
    } else {
      setEditingId(null);
      setFormData({ name: "", floorNumber: "", configuration: "", area: "", unit: "sq.ft", description: "" });
      setSelectedFile(null);
    }
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const parsed = CreatePropertyFloorPlanSchema.safeParse(formData);
    if (!parsed.success) {
      alert(parsed.error.issues[0].message);
      return;
    }

    if (!editingId && !selectedFile) {
      alert("An image file is required for a new floor plan.");
      return;
    }

    startTransition(async () => {
      let success = false;
      
      if (editingId) {
        // Edit flow (image replacement not supported in this inline form currently, 
        // to keep it simple, or we can just update metadata)
        const result = await updateFloorPlanAction(propertyId, editingId, parsed.data);
        if (result.success) {
          showToast("Floor plan updated.");
          success = true;
        } else {
          alert(result.error);
        }
      } else {
        // Create flow
        const payload = new FormData();
        payload.append("propertyId", propertyId);
        payload.append("name", parsed.data.name);
        if (parsed.data.floorNumber) payload.append("floorNumber", parsed.data.floorNumber);
        payload.append("configuration", parsed.data.configuration);
        payload.append("area", parsed.data.area.toString());
        payload.append("unit", parsed.data.unit);
        if (parsed.data.description) payload.append("description", parsed.data.description);
        payload.append("file", selectedFile!);

        const result = await uploadFloorPlanAction(payload);
        if (result.success) {
          showToast("Floor plan added.");
          success = true;
        } else {
          alert(result.error);
        }
      }

      if (success) {
        handleCloseForm();
        fetchFloorPlans();
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this floor plan?")) return;

    startTransition(async () => {
      const result = await deleteFloorPlanAction(propertyId, id);
      if (result.success) {
        showToast("Floor plan deleted.");
        fetchFloorPlans();
      } else {
        alert(result.error);
      }
    });
  };

  // HTML5 Drag and Drop handlers for reordering
  const onDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.currentTarget.parentNode as any);
  };

  const onDragOver = (index: number) => {
    if (draggedIdx === null || draggedIdx === index) return;
    const newOrder = [...floorPlans];
    const draggedItem = newOrder[draggedIdx];
    newOrder.splice(draggedIdx, 1);
    newOrder.splice(index, 0, draggedItem);
    setDraggedIdx(index);
    setFloorPlans(newOrder);
  };

  const onDragEnd = () => {
    setDraggedIdx(null);
    startTransition(async () => {
      const updates = floorPlans.map((fp, idx) => ({ id: fp.id, displayOrder: idx }));
      const result = await updateFloorPlanOrderAction(propertyId, updates);
      if (result.success) {
        showToast("Order updated.");
      } else {
        alert(result.error);
        fetchFloorPlans(); // revert on fail
      }
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Floor Plans</h3>
            <p className="text-sm text-muted-foreground">Manage property floor plans and layouts.</p>
          </div>
          {!isFormOpen && (
            <Button onClick={() => handleOpenForm()} disabled={isPending}>
              <Plus className="w-4 h-4 mr-2" />
              Add Floor Plan
            </Button>
          )}
        </div>

        {/* Form Modal/Inline */}
        {isFormOpen && (
          <Card className="border-primary/50 shadow-md">
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>{editingId ? "Edit Floor Plan" : "Add New Floor Plan"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Floor Name <span className="text-destructive">*</span></Label>
                    <Input id="name" required placeholder="e.g. Ground Floor" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="configuration">Configuration <span className="text-destructive">*</span></Label>
                    <Input id="configuration" required placeholder="e.g. 3 BHK" value={formData.configuration} onChange={e => setFormData({ ...formData, configuration: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="area">Area <span className="text-destructive">*</span></Label>
                    <Input id="area" required type="number" placeholder="e.g. 1500" value={formData.area} onChange={e => setFormData({ ...formData, area: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit <span className="text-destructive">*</span></Label>
                    <Input id="unit" required placeholder="e.g. sq.ft" value={formData.unit} onChange={e => setFormData({ ...formData, unit: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="floorNumber">Floor Number</Label>
                    <Input id="floorNumber" placeholder="e.g. 1, 2, Ground" value={formData.floorNumber} onChange={e => setFormData({ ...formData, floorNumber: e.target.value })} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Optional details..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                </div>

                {!editingId && (
                  <div className="space-y-2">
                    <Label>Floor Plan Image <span className="text-destructive">*</span></Label>
                    <div 
                      className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg transition-colors ${
                        isDraggingOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:bg-muted/50'
                      }`}
                      onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
                      onDragLeave={(e) => { e.preventDefault(); setIsDraggingOver(false); }}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDraggingOver(false);
                        const files = e.dataTransfer.files;
                        if (files && files.length > 0) setSelectedFile(files[0]);
                      }}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            setSelectedFile(e.target.files[0]);
                          }
                        }}
                      />
                      {selectedFile ? (
                        <div className="text-center">
                          <p className="font-medium text-primary">{selectedFile.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                          <Button type="button" variant="link" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}>Remove</Button>
                        </div>
                      ) : (
                        <>
                          <div className="rounded-full bg-primary/10 p-3 mb-2">
                            <UploadCloud className="h-6 w-6 text-primary" />
                          </div>
                          <p className="text-sm font-medium">Click or drag image here</p>
                          <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WEBP (Max 10MB)</p>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardContent className="flex justify-end gap-3 pt-0">
                <Button type="button" variant="outline" onClick={handleCloseForm} disabled={isPending}>Cancel</Button>
                <Button type="submit" disabled={isPending}>
                  {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingId ? "Save Changes" : "Upload Floor Plan"}
                </Button>
              </CardContent>
            </form>
          </Card>
        )}

        {/* Grid List */}
        {!isFormOpen && (
          floorPlans.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {floorPlans.map((fp, idx) => (
                <div 
                  key={fp.id}
                  draggable={!isPending}
                  onDragStart={(e) => onDragStart(e, idx)}
                  onDragOver={(e) => { e.preventDefault(); onDragOver(idx); }}
                  onDragEnd={onDragEnd}
                  className={`transition-all duration-200 ${draggedIdx === idx ? 'opacity-50 scale-95' : 'opacity-100'}`}
                >
                  <FloorPlanCard 
                    floorPlan={fp}
                    onEdit={handleOpenForm}
                    onDelete={handleDelete}
                    onPreview={() => setLightboxIndex(idx)}
                    disabled={isPending}
                  />
                </div>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                <div className="rounded-full bg-muted p-4 mb-4">
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No floor plans added yet</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-4 max-w-sm">
                  Add floor plans to show the layout and configurations available in this property.
                </p>
                <Button onClick={() => handleOpenForm()} disabled={isPending}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Floor Plan
                </Button>
              </CardContent>
            </Card>
          )
        )}
      </div>

      {/* Lightbox for floor plans */}
      {lightboxIndex !== null && (
        <ImageLightbox 
          images={floorPlans.map(fp => ({ 
            id: fp.id, 
            url: fp.imageUrl, 
            fileName: fp.name, 
            fileSize: null, 
            createdAt: fp.createdAt, 
            propertyId: fp.propertyId, 
            mediaType: 'GALLERY_IMAGE' as any, 
            displayOrder: fp.displayOrder, 
            isFeatured: false,
            mimeType: 'image/jpeg',
            updatedAt: fp.updatedAt
          })) as any}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}

      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 rounded-md bg-zinc-900 px-4 py-3 text-sm font-medium text-white shadow-lg transition-all animate-in fade-in slide-in-from-bottom-4">
          {toastMessage}
        </div>
      )}
    </>
  );
}
