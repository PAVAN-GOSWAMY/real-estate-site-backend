"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "@/components/ui/image-upload";
import { PropertyMedia, MediaType } from "@/modules/properties/types/media";
import { uploadMediaAction, deleteMediaAction } from "@/modules/properties/actions/media.actions";
import { Button } from "@/components/ui/button";

interface CoverImageSectionProps {
  propertyId: string;
  coverImage?: PropertyMedia;
  onMediaUpdated: () => void;
}

export function CoverImageSection({ propertyId, coverImage, onMediaUpdated }: CoverImageSectionProps) {
  const [isPending, startTransition] = useTransition();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    startTransition(async () => {
      const formData = new FormData();
      formData.append("propertyId", propertyId);
      formData.append("mediaType", MediaType.COVER_IMAGE);
      formData.append("file", file);

      const result = await uploadMediaAction(formData);
      if (result.success) {
        showToast("Cover image uploaded successfully.");
        onMediaUpdated();
      } else {
        alert(result.error);
      }
    });
  };

  const handleRemove = () => {
    if (!coverImage) return;

    startTransition(async () => {
      const result = await deleteMediaAction(propertyId, coverImage.id);
      if (result.success) {
        showToast("Cover image removed.");
        onMediaUpdated();
      } else {
        alert(result.error);
      }
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Cover Image</CardTitle>
          <CardDescription>
            The primary image displayed on the property listing card. Allowed: JPG, PNG, WEBP. Max 10MB.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative max-w-2xl" onChange={(e: any) => {
             if (e.target && e.target.type === 'file' && e.target.id === 'coverImageUpload') {
               handleUpload(e);
             }
          }}>
            <ImageUpload 
              name="coverImageUpload" 
              defaultValue={coverImage?.url} 
              onRemove={handleRemove}
              disabled={isPending}
            />
          </div>
          {isPending && <p className="text-sm text-muted-foreground mt-4 animate-pulse">Uploading...</p>}
        </CardContent>
      </Card>

      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 rounded-md bg-zinc-900 px-4 py-3 text-sm font-medium text-white shadow-lg transition-all animate-in fade-in slide-in-from-bottom-4">
          {toastMessage}
        </div>
      )}
    </>
  );
}
