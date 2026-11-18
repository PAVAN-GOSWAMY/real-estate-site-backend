"use client";

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Star, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { createTestimonialSubmissionAction } from "@/modules/testimonials/actions/testimonials.actions";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export function FeedbackForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [rating, setRating] = useState<number>(5);
  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!name.trim()) return setError("Name is required");
    if (!message.trim()) return setError("Message is required");
    if (!consent) return setError("You must agree to publish this feedback");
    if (rating < 1 || rating > 5) return setError("Invalid rating");

    setIsLoading(true);

    let profileImageUrl = "";

    try {
      if (imageFile) {
        const supabase = createClient();
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('testimonials')
          .upload(`submissions/${fileName}`, imageFile);
        
        if (uploadError) {
          throw new Error("Failed to upload image: " + uploadError.message);
        }
        
        const { data: publicUrlData } = supabase.storage
          .from('testimonials')
          .getPublicUrl(`submissions/${fileName}`);
          
        profileImageUrl = publicUrlData.publicUrl;
      }

      const result = await createTestimonialSubmissionAction({
        name,
        email: email || undefined,
        location: location || undefined,
        rating,
        message,
        profileImageUrl: profileImageUrl || undefined,
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-brand-slate/20 p-6 text-center space-y-3 max-w-md mx-auto">
        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-brand-navy">Thank You!</h3>
        <p className="text-xs sm:text-sm text-brand-navy/70">
          Your feedback has been submitted successfully. We appreciate your time and support!
        </p>
        <Link href="/properties">
          <Button 
            className="mt-3 h-9 text-xs sm:text-sm bg-brand-red hover:bg-brand-red-hover text-white rounded-full px-6"
          >
            Explore the Projects
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-brand-slate/20 p-5 sm:p-6 space-y-3.5 max-w-lg mx-auto">
      <div className="text-center mb-3">
        <h2 className="text-xl md:text-2xl font-bold text-brand-navy">Share Your Experience</h2>
        <p className="text-xs sm:text-sm text-brand-navy/70 mt-1">We value your feedback to improve our services.</p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs sm:text-sm font-medium">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label htmlFor="name" className="text-xs sm:text-sm font-semibold text-brand-navy">Full Name <span className="text-brand-red">*</span></label>
          <Input 
            id="name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="h-9 text-xs sm:text-sm rounded-lg border-brand-slate/50 focus-visible:ring-brand-red"
            placeholder="John Doe"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="email" className="text-xs sm:text-sm font-semibold text-brand-navy">Email Address</label>
          <Input 
            id="email" 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-9 text-xs sm:text-sm rounded-lg border-brand-slate/50 focus-visible:ring-brand-red"
            placeholder="john@example.com"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="location" className="text-xs sm:text-sm font-semibold text-brand-navy">Location</label>
        <Input 
          id="location" 
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="h-9 text-xs sm:text-sm rounded-lg border-brand-slate/50 focus-visible:ring-brand-red"
          placeholder="e.g., Sector 150, Noida"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs sm:text-sm font-semibold text-brand-navy">Your Rating <span className="text-brand-red">*</span></label>
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="focus:outline-none transition-transform hover:scale-110"
            >
              <Star 
                className={cn(
                  "w-6 h-6", 
                  rating >= star ? "fill-amber-400 text-amber-400" : "fill-transparent text-brand-slate/50"
                )} 
              />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="message" className="text-xs sm:text-sm font-semibold text-brand-navy">Your Feedback <span className="text-brand-red">*</span></label>
        <Textarea 
          id="message" 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={3}
          className="rounded-lg border-brand-slate/50 focus-visible:ring-brand-red min-h-[85px] resize-none text-xs sm:text-sm py-2"
          placeholder="Tell us about your experience..."
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs sm:text-sm font-semibold text-brand-navy">Profile Photo (Optional)</label>
        <div className="flex items-center gap-3">
          {imagePreview ? (
            <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-brand-slate/20 shrink-0">
              <Image unoptimized src={imagePreview} alt="Preview" fill className="object-cover" />
            </div>
          ) : (
            <div className="w-11 h-11 rounded-full bg-brand-surface border-2 border-dashed border-brand-slate/30 flex items-center justify-center shrink-0">
              <span className="text-[10px] text-brand-navy/50">No Image</span>
            </div>
          )}
          <Input 
            id="photo" 
            type="file" 
            accept="image/jpeg, image/png, image/webp"
            onChange={handleImageChange}
            className="file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-brand-red/10 file:text-brand-red hover:file:bg-brand-red/20 text-xs h-auto py-1.5 rounded-lg border-brand-slate/40"
          />
        </div>
      </div>

      <div className="flex items-start gap-2.5 p-3 bg-brand-surface rounded-lg border border-brand-slate/20">
        <div className="flex items-center h-5">
          <input
            id="consent"
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="w-4 h-4 rounded border-brand-slate text-brand-red focus:ring-brand-red/20"
          />
        </div>
        <div className="text-xs sm:text-sm">
          <label htmlFor="consent" className="font-medium text-brand-navy cursor-pointer">
            I agree to share my feedback <span className="text-brand-red">*</span>
          </label>
          <p className="text-brand-navy/70 mt-1">
            By submitting this form, you consent to allow us to publish your name, location, photo, and feedback on our website.
          </p>
        </div>
      </div>

      <Button 
        type="submit" 
        disabled={isLoading || !consent} 
        className="w-full h-10 sm:h-11 text-xs sm:text-sm font-semibold rounded-full bg-brand-red hover:bg-brand-red-hover text-white shadow-md shadow-brand-red/20 transition-all cursor-pointer"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Submitting Feedback...
          </>
        ) : (
          "Submit Feedback"
        )}
      </Button>
    </form>
  );
}
