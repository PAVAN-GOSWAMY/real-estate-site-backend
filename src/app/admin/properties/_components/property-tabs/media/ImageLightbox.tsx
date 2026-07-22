"use client";

import { useEffect, useState } from "react";
import { PropertyMedia } from "@/modules/properties/types/media";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface ImageLightboxProps {
  images: PropertyMedia[];
  initialIndex: number;
  onClose: () => void;
}

export function ImageLightbox({ images, initialIndex, onClose }: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrevious();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  if (!images.length) return null;

  const currentImage = images[currentIndex];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Header controls */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 z-10 bg-gradient-to-b from-black/60 to-transparent">
        <div className="text-white/80 text-sm">
          {currentIndex + 1} / {images.length}
        </div>
        <button 
          onClick={onClose}
          className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Navigation Areas (Left/Right clickable zones) */}
      <div className="absolute inset-y-0 left-0 w-1/4 flex items-center px-4 z-0 cursor-w-resize" onClick={handlePrevious}>
        <button 
          onClick={(e) => { e.stopPropagation(); handlePrevious(); }}
          className="text-white/80 hover:text-white bg-black/50 hover:bg-black/80 rounded-full p-3 transition-colors pointer-events-auto"
          aria-label="Previous"
        >
          <ChevronLeft className="h-8 w-8" />
        </button>
      </div>

      <div className="absolute inset-y-0 right-0 w-1/4 flex items-center justify-end px-4 z-0 cursor-e-resize" onClick={handleNext}>
        <button 
          onClick={(e) => { e.stopPropagation(); handleNext(); }}
          className="text-white/80 hover:text-white bg-black/50 hover:bg-black/80 rounded-full p-3 transition-colors pointer-events-auto"
          aria-label="Next"
        >
          <ChevronRight className="h-8 w-8" />
        </button>
      </div>

      {/* Main Image */}
      <div className="relative max-w-5xl max-h-[85vh] flex items-center justify-center p-4 z-0" onClick={onClose}>
        <Image
          src={currentImage.url}
          alt={currentImage.fileName || "Preview"}
          fill
          className="object-contain rounded-md shadow-2xl animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {/* Footer Info */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-10 bg-gradient-to-t from-black/80 to-transparent text-center pointer-events-none">
        <p className="text-white/90 text-sm font-medium drop-shadow-md">
          {currentImage.fileName}
        </p>
      </div>
    </div>
  );
}
