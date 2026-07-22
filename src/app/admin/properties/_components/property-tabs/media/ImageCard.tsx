"use client";

import { PropertyMedia } from "@/modules/properties/types/media";
import Image from "next/image";
import { MoreHorizontal, Image as ImageIcon, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ImageCardProps {
  media: PropertyMedia;
  onSetCover: (id: string) => void;
  onDelete: (id: string) => void;
  onPreview: (media: PropertyMedia) => void;
  disabled?: boolean;
}

function formatBytes(bytes: number | null, decimals = 2) {
  if (!bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function ImageCard({ media, onSetCover, onDelete, onPreview, disabled }: ImageCardProps) {
  return (
    <div className="group relative rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden transition-all hover:shadow-md cursor-grab active:cursor-grabbing">
      {/* Thumbnail */}
      <div 
        className="aspect-square w-full relative bg-muted cursor-pointer overflow-hidden"
        onClick={() => onPreview(media)}
      >
        {media.isFeatured && (
          <div className="absolute top-2 left-2 z-10 bg-primary/90 text-primary-foreground text-xs font-semibold px-2 py-1 rounded-md flex items-center shadow-sm">
            <Star className="w-3 h-3 mr-1 fill-current" />
            Cover
          </div>
        )}
        
        {/* Actions Dropdown */}
        <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="h-8 w-8 shadow-sm rounded-md bg-background/80 backdrop-blur-sm" disabled={disabled}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => onPreview(media)} className="cursor-pointer">
                <ImageIcon className="mr-2 h-4 w-4" />
                Preview
              </DropdownMenuItem>
              {!media.isFeatured && (
                <DropdownMenuItem onClick={() => onSetCover(media.id)} className="cursor-pointer">
                  <Star className="mr-2 h-4 w-4" />
                  Set as Cover
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDelete(media.id)} className="text-destructive focus:bg-destructive/10 cursor-pointer">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Image
          src={media.url}
          alt={media.fileName || "Property image"}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Details */}
      <div className="p-3 text-sm">
        <p className="font-medium truncate" title={media.fileName || "Image"}>
          {media.fileName || "Image"}
        </p>
        <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
          <span>{formatBytes(media.fileSize)}</span>
          <span>{new Date(media.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}
