"use client";

import { useState, useTransition, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PropertyMedia, MediaType } from "@/modules/properties/types/media";
import { uploadMediaAction, deleteMediaAction, updateMediaOrderAction, setAsCoverAction } from "@/modules/properties/actions/media.actions";
import { ImageCard } from "./ImageCard";
import { ImageLightbox } from "./ImageLightbox";
import { UploadCloud, GripHorizontal } from "lucide-react";

interface GallerySectionProps {
  propertyId: string;
  galleryImages: PropertyMedia[];
  onMediaUpdated: () => void;
}

export function GallerySection({ propertyId, galleryImages, onMediaUpdated }: GallerySectionProps) {
  const [isPending, startTransition] = useTransition();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Drag and drop state
  const [images, setImages] = useState<PropertyMedia[]>(galleryImages);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Lightbox state
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Sync state when props change
  useState(() => {
    setImages(galleryImages);
  });
  if (images !== galleryImages && !isPending && draggedIdx === null) {
    setImages(galleryImages);
  }

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    startTransition(async () => {
      let successCount = 0;
      let errorCount = 0;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 10 * 1024 * 1024) {
          errorCount++;
          continue;
        }
        
        const formData = new FormData();
        formData.append("propertyId", propertyId);
        formData.append("mediaType", MediaType.GALLERY_IMAGE);
        formData.append("file", file);

        const result = await uploadMediaAction(formData);
        if (result.success) {
          successCount++;
        } else {
          errorCount++;
        }
      }

      if (fileInputRef.current) fileInputRef.current.value = "";
      
      if (successCount > 0) {
        showToast(`Uploaded ${successCount} image(s) successfully.` + (errorCount > 0 ? ` ${errorCount} failed.` : ''));
        onMediaUpdated();
      } else if (errorCount > 0) {
        alert(`Failed to upload ${errorCount} image(s). Check file sizes (max 10MB).`);
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    startTransition(async () => {
      const result = await deleteMediaAction(propertyId, id);
      if (result.success) {
        showToast("Image deleted.");
        onMediaUpdated();
      } else {
        alert(result.error);
      }
    });
  };

  const handleSetCover = (id: string) => {
    startTransition(async () => {
      const result = await setAsCoverAction(propertyId, id);
      if (result.success) {
        showToast("Cover image updated.");
        onMediaUpdated();
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
    e.dataTransfer.setDragImage(e.currentTarget, 20, 20);
  };

  const onDragOver = (index: number) => {
    if (draggedIdx === null || draggedIdx === index) return;
    
    // Reorder array optimistically
    const newImages = [...images];
    const draggedImage = newImages[draggedIdx];
    newImages.splice(draggedIdx, 1);
    newImages.splice(index, 0, draggedImage);
    
    setDraggedIdx(index);
    setImages(newImages);
  };

  const onDragEnd = () => {
    setDraggedIdx(null);
    
    // Persist new order to server
    startTransition(async () => {
      const updates = images.map((img, idx) => ({
        id: img.id,
        displayOrder: idx
      }));
      
      const result = await updateMediaOrderAction(propertyId, updates);
      if (result.success) {
        showToast("Gallery order updated.");
        onMediaUpdated();
      } else {
        alert(result.error);
        setImages(galleryImages); // revert on failure
      }
    });
  };

  // File dropzone handlers
  const handleDropzoneDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };
  const handleDropzoneDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };
  const handleDropzoneDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      if (fileInputRef.current) {
        // Mock the change event behavior
        const dataTransfer = new DataTransfer();
        for (let i = 0; i < files.length; i++) {
          dataTransfer.items.add(files[i]);
        }
        fileInputRef.current.files = dataTransfer.files;
        handleFilesSelected({ target: fileInputRef.current } as any);
      }
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Gallery Images</CardTitle>
            <CardDescription>
              Upload and arrange multiple photos. Drag images to reorder them.
            </CardDescription>
          </div>
          <div>
            <input
              type="file"
              multiple
              accept="image/png, image/jpeg, image/webp"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFilesSelected}
              disabled={isPending}
            />
            <Button onClick={() => fileInputRef.current?.click()} disabled={isPending}>
              <UploadCloud className="w-4 h-4 mr-2" />
              Upload Images
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {images.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image, idx) => (
                <div 
                  key={image.id}
                  draggable={!isPending}
                  onDragStart={(e) => onDragStart(e, idx)}
                  onDragOver={(e) => { e.preventDefault(); onDragOver(idx); }}
                  onDragEnd={onDragEnd}
                  className={`transition-all duration-200 ${draggedIdx === idx ? 'opacity-50 scale-95' : 'opacity-100'}`}
                >
                  <ImageCard 
                    media={image}
                    onDelete={handleDelete}
                    onSetCover={handleSetCover}
                    onPreview={() => setLightboxIndex(idx)}
                    disabled={isPending}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div 
              className={`flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg transition-colors ${
                isDraggingOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:bg-muted/50'
              }`}
              onDragOver={handleDropzoneDragOver}
              onDragLeave={handleDropzoneDragLeave}
              onDrop={handleDropzoneDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="rounded-full bg-primary/10 p-4 mb-4">
                <UploadCloud className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium">No media uploaded yet</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4 text-center max-w-sm">
                Drag and drop images here, or click to select files. JPG, PNG, WEBP up to 10MB each.
              </p>
              <Button variant="outline" type="button" disabled={isPending}>
                Browse Files
              </Button>
            </div>
          )}
          
          {isPending && images.length > 0 && (
            <p className="text-sm text-muted-foreground mt-4 animate-pulse">Syncing changes...</p>
          )}
        </CardContent>
      </Card>

      {/* Lightbox Overlay */}
      {lightboxIndex !== null && (
        <ImageLightbox 
          images={images}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 rounded-md bg-zinc-900 px-4 py-3 text-sm font-medium text-white shadow-lg transition-all animate-in fade-in slide-in-from-bottom-4">
          {toastMessage}
        </div>
      )}
    </>
  );
}
