"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Banner } from "@/modules/banners/types";
import { createBannerAction, updateBannerAction } from "@/modules/banners/actions/banners.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/components/ui/image-upload";
import { createClient } from "@/lib/supabase/client";
import { Edit, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function BannerFormDialog({ bannerToEdit }: { bannerToEdit?: Banner }) {
  const isEditing = !!bannerToEdit;
  const [open, setOpen] = useState(false);
  
  const [title, setTitle] = useState(bannerToEdit?.title || "");
  const [linkUrl, setLinkUrl] = useState(bannerToEdit?.linkUrl || "");
  const [displayOrder, setDisplayOrder] = useState<number>(bannerToEdit?.displayOrder ?? 0);
  const [isActive, setIsActive] = useState<boolean>(bannerToEdit?.isActive ?? true);
  
  const [imageUrl, setImageUrl] = useState(bannerToEdit?.imageUrl || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setTitle(bannerToEdit?.title || "");
    setLinkUrl(bannerToEdit?.linkUrl || "");
    setDisplayOrder(bannerToEdit?.displayOrder ?? 0);
    setIsActive(bannerToEdit?.isActive ?? true);
    setImageUrl(bannerToEdit?.imageUrl || "");
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
    if (!title.trim()) {
      return toast.error("Title is required");
    }
    if (!imageUrl && !imageFile) {
      return toast.error("Banner image is required");
    }

    setIsSubmitting(true);
    
    let finalImageUrl = imageUrl;

    if (imageFile) {
      const supabase = createClient();
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage.from('property-media').upload(`banners/${fileName}`, imageFile);
      
      if (!uploadError) {
        const { data: publicUrlData } = supabase.storage.from('property-media').getPublicUrl(`banners/${fileName}`);
        finalImageUrl = publicUrlData.publicUrl;
      } else {
        setIsSubmitting(false);
        return toast.error("Failed to upload image: " + uploadError.message);
      }
    }

    const payload = {
      title,
      imageUrl: finalImageUrl,
      linkUrl: linkUrl || null,
      isActive,
      displayOrder
    };

    let result;
    if (isEditing && bannerToEdit) {
      result = await updateBannerAction(bannerToEdit.id, payload);
    } else {
      result = await createBannerAction(payload);
    }

    setIsSubmitting(false);

    if (result.success) {
      toast.success(`Banner ${isEditing ? 'updated' : 'created'} successfully.`);
      setOpen(false);
    } else {
      toast.error("Error: " + result.error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {isEditing ? (
          <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
            <Edit className="h-4 w-4" />
          </Button>
        ) : (
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Banner
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Banner' : 'Add Banner'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
            <Input 
              id="title" 
              placeholder="e.g. Festive Season Offer" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label>Banner Image <span className="text-red-500">*</span></Label>
            <ImageUpload 
              name="coverImage" 
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
            <Label htmlFor="linkUrl">Link URL</Label>
            <Input 
              id="linkUrl" 
              placeholder="https://example.com/property-offer" 
              value={linkUrl} 
              onChange={(e) => setLinkUrl(e.target.value)} 
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="displayOrder">Display Order</Label>
              <Input 
                id="displayOrder" 
                type="number" 
                value={displayOrder} 
                onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)} 
                disabled={isSubmitting}
              />
            </div>
            
            <div className="space-y-2 flex flex-col justify-end">
              <div className="flex items-center space-x-2 h-10">
                <Switch 
                  id="isActive" 
                  checked={isActive} 
                  onCheckedChange={setIsActive} 
                  disabled={isSubmitting}
                />
                <Label htmlFor="isActive" className="cursor-pointer">Active</Label>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">
                Active banners can appear on the public website.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (isEditing ? 'Updating...' : 'Saving...') : (isEditing ? 'Save Banner' : 'Create Banner')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

