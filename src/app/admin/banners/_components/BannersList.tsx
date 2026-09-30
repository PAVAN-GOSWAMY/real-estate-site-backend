"use client";

import { useState } from "react";
import Image from "next/image";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteBannerAction, updateBannerAction } from "@/modules/banners/actions/banners.actions";
import { Banner } from "@/modules/banners/types";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { BannerFormDialog } from "./BannerFormDialog";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { ImageIcon } from "lucide-react";

export function BannersList({ banners }: { banners: Banner[] }) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    const result = await deleteBannerAction(id);
    setIsDeleting(null);
    if (result.success) {
      toast.success("Banner deleted successfully.");
    } else {
      toast.error("Error: " + result.error);
    }
  };

  if (!banners || banners.length === 0) {
    return (
      <EmptyState 
        title="No deals or offers yet" 
        description="Create your first promotional banner to display it on the website." 
        icon={ImageIcon} 
        className="bg-card shadow-sm" 
      />
    );
  }

  return (
    <div className="rounded-md border border-brand-slate/50 bg-white overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-brand-slate/50 text-sm">
          <thead className="bg-brand-surface">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-brand-navy/70">Preview</th>
              <th className="px-4 py-3 text-left font-medium text-brand-navy/70">Title</th>
              <th className="px-4 py-3 text-left font-medium text-brand-navy/70">Status</th>
              <th className="px-4 py-3 text-left font-medium text-brand-navy/70">Order</th>
              <th className="px-4 py-3 text-left font-medium text-brand-navy/70">Link</th>
              <th className="px-4 py-3 text-right font-medium text-brand-navy/70">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-slate/50">
            {banners.map((banner) => (
              <tr key={banner.id} className="hover:bg-brand-surface/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="relative w-24 h-12 bg-brand-surface rounded overflow-hidden border border-brand-slate/20">
                    {banner.imageUrl ? (
                      <Image src={banner.imageUrl} alt={banner.title} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-brand-blue/50">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 font-medium text-brand-navy">{banner.title}</td>
                <td className="px-4 py-3">
                  <Badge variant={banner.isActive ? "default" : "secondary"} className={banner.isActive ? "bg-green-100 text-green-800 hover:bg-green-100 border-green-200" : ""}>
                    {banner.isActive ? "Active" : "Inactive"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-brand-navy/70">{banner.displayOrder}</td>
                <td className="px-4 py-3 text-brand-navy/70 max-w-[150px] truncate">
                  {banner.linkUrl ? (
                    <a href={banner.linkUrl} target="_blank" rel="noreferrer" className="text-brand-red hover:text-brand-red-hover hover:underline">{banner.linkUrl}</a>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <BannerFormDialog bannerToEdit={banner} />
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50" disabled={isDeleting === banner.id}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete banner?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. The banner will be removed from the Deals & Offers collection.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDelete(banner.id)}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            {isDeleting === banner.id ? "Deleting..." : "Delete"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
