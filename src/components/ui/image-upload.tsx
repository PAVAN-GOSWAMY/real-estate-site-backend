"use client";

import { useState, useRef, useEffect } from "react";
import { UploadCloud, X, Image as ImageIcon } from "lucide-react";
import { Button } from "./button";

interface ImageUploadProps {
  name: string;
  defaultValue?: string | null;
  onRemove?: () => void;
  disabled?: boolean;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];

export function ImageUpload({ name, defaultValue, onRemove, disabled }: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(defaultValue || null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Sync default value if it changes
    if (defaultValue) setPreviewUrl(defaultValue);
  }, [defaultValue]);

  // Clean up object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFile = (file: File) => {
    setError(null);

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Please select a PNG, JPEG, or WEBP image.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("File size must be less than 5MB.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Check dimensions (optional, just throwing a warning or assuming it's valid if it passes size)
    const img = new Image();
    img.onload = () => {
      if (img.width < 200 || img.height < 200) {
        // We'll still allow it but could add a warning here
      }
    };
    
    const objectUrl = URL.createObjectURL(file);
    img.src = objectUrl;
    setPreviewUrl(objectUrl);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (fileInputRef.current) {
        // We cannot securely set the file list programmatically in all browsers 
        // without DataTransfer object tricks, so we manually assign it if possible
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInputRef.current.files = dataTransfer.files;
      }
      handleFile(file);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (onRemove) onRemove();
  };

  return (
    <div className="space-y-4">
      <div 
        className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${
          disabled ? "opacity-50 cursor-not-allowed bg-muted" : "hover:bg-muted/50"
        } ${error ? "border-destructive/50 bg-destructive/5" : "border-muted-foreground/25"}`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id={name}
          name={name}
          ref={fileInputRef}
          onChange={onChange}
          disabled={disabled}
          accept="image/png, image/jpeg, image/webp"
          className="absolute inset-0 z-50 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
          aria-invalid={!!error}
          data-testid="image-upload-input"
        />
        
        {previewUrl ? (
          <div className="relative flex w-full flex-col items-center justify-center space-y-4">
            <div className="relative h-32 w-32 overflow-hidden rounded-lg border bg-background shadow-sm">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="h-full w-full object-contain"
              />
            </div>
            <div className="flex gap-2 z-50">
              <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                Replace
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-2 text-center">
            <div className="rounded-full bg-primary/10 p-3">
              <UploadCloud className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Click or drag image to upload</p>
              <p className="text-xs text-muted-foreground">PNG, JPEG or WEBP (max 5MB)</p>
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      
      {/* If there is a preview and we want a remove button outside the drag area */}
      {previewUrl && (
        <div className="flex justify-between items-center bg-muted/50 p-3 rounded-md">
          <div className="flex items-center gap-2 text-sm text-muted-foreground overflow-hidden">
            <ImageIcon className="h-4 w-4 shrink-0" />
            <span className="truncate">Image ready to upload</span>
          </div>
          <Button 
            type="button" 
            variant="ghost" 
            size="sm" 
            onClick={handleRemove}
            className="h-8 text-destructive hover:bg-destructive/10 hover:text-destructive shrink-0"
            disabled={disabled}
            data-testid="image-upload-remove"
          >
            <X className="mr-2 h-4 w-4" />
            Remove
          </Button>
        </div>
      )}
    </div>
  );
}
