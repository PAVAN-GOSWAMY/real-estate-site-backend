"use client";

import { useState } from "react";
import Image from "next/image";
import { Edit, Trash2, User, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteTestimonialAction } from "@/modules/testimonials/actions/testimonials.actions";
import { Testimonial } from "@/modules/testimonials/types";
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
import { TestimonialFormDialog } from "./TestimonialFormDialog";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { MessageSquare } from "lucide-react";

export function TestimonialsList({ testimonials }: { testimonials: Testimonial[] }) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    const result = await deleteTestimonialAction(id);
    setIsDeleting(null);
    if (result.success) {
      toast.success("Testimonial deleted successfully.");
    } else {
      toast.error("Error: " + result.error);
    }
  };

  if (!testimonials || testimonials.length === 0) {
    return (
      <EmptyState 
        title="No testimonials yet" 
        description="Add a testimonial manually or approve submissions to show them on the website." 
        icon={MessageSquare} 
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
              <th className="px-4 py-3 text-left font-medium text-brand-navy/70">Client</th>
              <th className="px-4 py-3 text-left font-medium text-brand-navy/70">Rating</th>
              <th className="px-4 py-3 text-left font-medium text-brand-navy/70">Message</th>
              <th className="px-4 py-3 text-left font-medium text-brand-navy/70">Status</th>
              <th className="px-4 py-3 text-left font-medium text-brand-navy/70">Order</th>
              <th className="px-4 py-3 text-right font-medium text-brand-navy/70">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-slate/50">
            {testimonials.map((testimonial) => (
              <tr key={testimonial.id} className="hover:bg-brand-surface/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 bg-brand-surface rounded-full overflow-hidden border border-brand-slate/20 shrink-0">
                      {testimonial.profileImageUrl ? (
                        <Image src={testimonial.profileImageUrl} alt={testimonial.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-brand-blue/50">
                          <User className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-brand-navy">{testimonial.name}</p>
                      {testimonial.location && (
                        <p className="text-xs text-brand-navy/60">{testimonial.location}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 text-amber-500">
                    <span className="font-medium text-brand-navy mr-1">{testimonial.rating}</span>
                    <Star className="w-4 h-4 fill-amber-500" />
                  </div>
                </td>
                <td className="px-4 py-3 text-brand-navy/70 max-w-[200px] truncate">
                  {testimonial.message}
                </td>
                <td className="px-4 py-3 space-x-1">
                  <Badge variant={testimonial.isActive ? "default" : "secondary"} className={testimonial.isActive ? "bg-green-100 text-green-800 hover:bg-green-100 border-green-200" : ""}>
                    {testimonial.isActive ? "Active" : "Inactive"}
                  </Badge>
                  {testimonial.isFeatured && (
                    <Badge variant="outline" className="border-brand-red text-brand-red">
                      Featured
                    </Badge>
                  )}
                </td>
                <td className="px-4 py-3 text-brand-navy/70">{testimonial.displayOrder}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <TestimonialFormDialog testimonialToEdit={testimonial} />
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50" disabled={isDeleting === testimonial.id}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete testimonial?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. The testimonial will be removed from the website.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDelete(testimonial.id)}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            {isDeleting === testimonial.id ? "Deleting..." : "Delete"}
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
