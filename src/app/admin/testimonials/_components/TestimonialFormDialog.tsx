"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Testimonial } from "@/modules/testimonials/types";
import { createTestimonialAction, updateTestimonialAction } from "@/modules/testimonials/actions/testimonials.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/components/ui/image-upload";
import { createClient } from "@/lib/supabase/client";
import { Edit, Plus, Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function TestimonialFormDialog({ testimonialToEdit }: { testimonialToEdit?: Testimonial }) {
  const isEditing = !!testimonialToEdit;
  const [open, setOpen] = useState(false);
  
  const [name, setName] = useState(testimonialToEdit?.name || "");
  const [message, setMessage] = useState(testimonialToEdit?.message || "");
  const [location, setLocation] = useState(testimonialToEdit?.location || "");
  const [rating, setRating] = useState<number>(testimonialToEdit?.rating ?? 5);
  const [displayOrder, setDisplayOrder] = useState<number>(testimonialToEdit?.displayOrder ?? 0);
  const [isFeatured, setIsFeatured] = useState<boolean>(testimonialToEdit?.isFeatured ?? false);
  const [isActive, setIsActive] = useState<boolean>(testimonialToEdit?.isActive ?? true);
  
  const [imageUrl, setImageUrl] = useState(testimonialToEdit?.profileImageUrl || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setName(testimonialToEdit?.name || "");
    setMessage(testimonialToEdit?.message || "");
    setLocation(testimonialToEdit?.location || "");
    setRating(testimonialToEdit?.rating ?? 5);
    setDisplayOrder(testimonialToEdit?.displayOrder ?? 0);
    setIsFeatured(testimonialToEdit?.isFeatured ?? false);
    setIsActive(testimonialToEdit?.isActive ?? true);
    setImageUrl(testimonialToEdit?.profileImageUrl || "");
    setImageFile(null);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      resetForm();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Name is required");
    if (!message.trim()) return toast.error("Message is required");
    if (rating < 1 || rating > 5) return toast.error("Rating must be between 1 and 5");

    setIsSubmitting(true);
    
    let finalImageUrl = imageUrl;

    if (imageFile) {
      const supabase = createClient();
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage.from('testimonials').upload(`profiles/${fileName}`, imageFile);
      
      if (!uploadError) {
        const { data: publicUrlData } = supabase.storage.from('testimonials').getPublicUrl(`profiles/${fileName}`);
        finalImageUrl = publicUrlData.publicUrl;
      } else {
        setIsSubmitting(false);
        return toast.error("Failed to upload profile image: " + uploadError.message);
      }
    }

    const payload = {
      name,
      message,
      rating,
      location: location || undefined,
      profileImageUrl: finalImageUrl || undefined,
      source: isEditing && testimonialToEdit?.source ? testimonialToEdit.source : "admin",
      isActive,
      isFeatured,
      displayOrder
    };

    let result;
    if (isEditing && testimonialToEdit) {
      result = await updateTestimonialAction({ ...payload, id: testimonialToEdit.id });
    } else {
      result = await createTestimonialAction(payload);
    }

    setIsSubmitting(false);

    if (result.success) {
      toast.success(`Testimonial ${isEditing ? 'updated' : 'created'} successfully.`);
      setOpen(false);
    } else {
      toast.error("Error: " + result.error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {isEditing ? (
          <Button variant="ghost" size="icon" className="h-8 w-8 text-brand-navy hover:text-brand-navy-hover hover:bg-brand-surface">
            <Edit className="h-4 w-4" />
          </Button>
        ) : (
          <Button className="flex items-center gap-2 bg-brand-red hover:bg-brand-red-hover text-white">
            <Plus className="w-4 h-4" />
            Add Testimonial
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Testimonial' : 'Add Testimonial'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label className="text-brand-navy">Profile Image</Label>
            <ImageUpload 
              name="profileImageUrl" 
              defaultValue={imageUrl} 
              onFileSelect={(file) => {
                setImageFile(file);
                if (!file && !imageUrl) {
                  setImageUrl("");
                }
              }}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-brand-navy">Name <span className="text-brand-red">*</span></Label>
            <Input 
              id="name" 
              placeholder="John Doe" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              disabled={isSubmitting}
              className="focus-visible:ring-brand-red border-brand-slate/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-brand-navy">Location</Label>
            <Input 
              id="location" 
              placeholder="e.g. Sector 150, Noida" 
              value={location} 
              onChange={(e) => setLocation(e.target.value)} 
              disabled={isSubmitting}
              className="focus-visible:ring-brand-red border-brand-slate/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rating" className="text-brand-navy flex items-center gap-1">
              Rating <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
            </Label>
            <Input 
              id="rating" 
              type="number" 
              min="1"
              max="5"
              value={rating} 
              onChange={(e) => setRating(parseInt(e.target.value) || 5)} 
              disabled={isSubmitting}
              className="focus-visible:ring-brand-red border-brand-slate/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-brand-navy">Message <span className="text-brand-red">*</span></Label>
            <Textarea 
              id="message" 
              placeholder="Amazing experience..." 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              disabled={isSubmitting}
              className="min-h-[100px] focus-visible:ring-brand-red border-brand-slate/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="displayOrder" className="text-brand-navy">Display Order</Label>
              <Input 
                id="displayOrder" 
                type="number" 
                value={displayOrder} 
                onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)} 
                disabled={isSubmitting}
                className="focus-visible:ring-brand-red border-brand-slate/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="flex items-center space-x-2">
              <Switch 
                id="isActive" 
                checked={isActive} 
                onCheckedChange={setIsActive} 
                disabled={isSubmitting}
                className="data-[state=checked]:bg-brand-red"
              />
              <Label htmlFor="isActive" className="cursor-pointer text-brand-navy">Active</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                id="isFeatured" 
                checked={isFeatured} 
                onCheckedChange={setIsFeatured} 
                disabled={isSubmitting}
                className="data-[state=checked]:bg-brand-red"
              />
              <Label htmlFor="isFeatured" className="cursor-pointer text-brand-navy">Featured</Label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-brand-slate/40">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting} className="border-brand-slate/50 text-brand-navy hover:bg-brand-surface hover:text-brand-navy-hover">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-brand-red hover:bg-brand-red-hover text-white">
              {isSubmitting ? (isEditing ? 'Updating...' : 'Saving...') : (isEditing ? 'Save' : 'Create')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
