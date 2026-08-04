"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

import { toast } from "sonner";

export function NewsletterCTA() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    toast.success("Thank you for subscribing to our newsletter!");
    form.reset();
  };

  return (
    <section className="py-16 bg-accent/5 my-12 rounded-3xl border border-border/40">
      <div className="container px-4 md:px-6 mx-auto text-center max-w-2xl">
        <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
          Stay Ahead of the Market
        </h2>
        <p className="text-muted-foreground mb-8 text-lg">
          Join 10,000+ investors who receive our weekly insights, property alerts, and expert analysis directly in their inbox.
        </p>
        
        <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" onSubmit={handleSubmit}>
          <input 
            type="email" 
            placeholder="Enter your email address" 
            className="flex-1 bg-white border border-border/50 rounded-full px-6 py-3 outline-none focus:border-primary transition-colors text-foreground"
            required
          />
          <Button type="submit" size="lg" className="rounded-full px-8 bg-primary text-primary-foreground hover:bg-primary/90 font-bold">
            Subscribe
          </Button>
        </form>
        <p className="text-xs text-muted-foreground mt-4">
          We care about your data in our <a href="/privacy" className="underline">privacy policy</a>.
        </p>
      </div>
    </section>
  );
}
