"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PropertyGalleryProps {
  images: string[];
}

export function PropertyGallery({ images }: PropertyGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!images || images.length === 0) return null;

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <div className="space-y-4">
        {/* Main Featured Image */}
        <div 
          className="relative h-[400px] md:h-[500px] lg:h-[600px] w-full rounded-2xl overflow-hidden cursor-pointer group"
          onClick={() => setIsFullscreen(true)}
        >
          <Image
            src={images[activeIndex]}
            alt={`Property image ${activeIndex + 1}`}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="bg-black/40 backdrop-blur-md rounded-full p-4 text-white">
              <Maximize2 className="h-6 w-6" />
            </div>
          </div>
          
          <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-sm font-medium">
            {activeIndex + 1} / {images.length}
          </div>
        </div>

        {/* Thumbnail Strip */}
        <div className="grid grid-cols-4 gap-4">
          {images.slice(0, 4).map((img, idx) => (
            <div 
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative h-24 md:h-32 rounded-xl overflow-hidden cursor-pointer transition-all ${
                activeIndex === idx ? "ring-2 ring-brand-red ring-offset-2 ring-offset-brand-surface" : "opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
              {idx === 3 && images.length > 4 && (
                <div 
                  className="absolute inset-0 bg-black/60 flex items-center justify-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFullscreen(true);
                  }}
                >
                  <span className="text-white font-bold text-lg">+{images.length - 4} More</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Lightbox */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          >
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-6 right-6 text-white hover:text-brand-red hover:bg-white/20 z-50 rounded-full h-12 w-12"
              onClick={() => setIsFullscreen(false)}
            >
              <X className="h-8 w-8" />
            </Button>

            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute left-6 top-1/2 -translate-y-1/2 text-white hover:text-brand-red hover:bg-white/20 z-50 h-14 w-14 rounded-full"
              onClick={prevImage}
            >
              <ChevronLeft className="h-10 w-10" />
            </Button>

            <div className="relative w-full max-w-7xl h-[80vh] mx-auto px-16">
              <Image
                src={images[activeIndex]}
                alt={`Property image ${activeIndex + 1}`}
                fill
                className="object-contain"
                quality={100}
              />
            </div>

            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-6 top-1/2 -translate-y-1/2 text-white hover:text-brand-red hover:bg-white/20 z-50 h-14 w-14 rounded-full"
              onClick={nextImage}
            >
              <ChevronRight className="h-10 w-10" />
            </Button>
            
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white font-medium tracking-widest text-lg">
              {activeIndex + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
