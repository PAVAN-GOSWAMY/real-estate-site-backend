"use client";

import { useEffect, useState, useTransition } from "react";
import { Property } from "@/modules/properties/types/property";
import { PropertyMedia, MediaType } from "@/modules/properties/types/media";
import { getPropertyMediaAction } from "@/modules/properties/actions/media.actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { CoverImageSection } from "./media/CoverImageSection";
import { GallerySection } from "./media/GallerySection";

interface MediaTabProps {
  property: Property;
}

export function MediaTab({ property }: MediaTabProps) {
  const [media, setMedia] = useState<PropertyMedia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMedia = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getPropertyMediaAction(property.id);
      if (result.success) {
        setMedia(result.data);
      } else {
        setError(result.error);
      }
    } catch (e: any) {
      setError(e.message || "Failed to load media");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [property.id]);

  const coverImage = media.find(m => m.mediaType === MediaType.COVER_IMAGE);
  const galleryImages = media.filter(m => m.mediaType === MediaType.GALLERY_IMAGE).sort((a, b) => a.displayOrder - b.displayOrder);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md text-sm font-medium" role="alert">
            {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <CoverImageSection 
        propertyId={property.id} 
        coverImage={coverImage} 
        onMediaUpdated={fetchMedia} 
      />
      <GallerySection 
        propertyId={property.id} 
        galleryImages={galleryImages} 
        onMediaUpdated={fetchMedia} 
      />
    </div>
  );
}
