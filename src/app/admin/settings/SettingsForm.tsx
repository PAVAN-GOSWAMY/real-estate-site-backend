"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { updateSiteStatsAction } from "@/modules/settings/actions/settings.actions";
import { SiteStatsSettings } from "@/modules/settings/services/settings.service";

export function SettingsForm({ initialStats }: { initialStats: SiteStatsSettings }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    try {
      await updateSiteStatsAction(formData);
      toast.success("Settings saved successfully.");
    } catch (error: any) {
      toast.error(error.message || "Failed to save settings.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form action={handleSubmit} ref={formRef} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="happyClients" className="text-sm font-medium text-foreground">Happy Clients</label>
          <input 
            id="happyClients"
            name="happyClients" 
            defaultValue={initialStats.happyClients} 
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="yearsExperience" className="text-sm font-medium text-foreground">Years of Experience</label>
          <input 
            id="yearsExperience"
            name="yearsExperience" 
            defaultValue={initialStats.yearsExperience} 
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>

      <div className="space-y-2 mt-4">
        <label htmlFor="popularLocations" className="text-sm font-medium text-foreground">Footer Popular Locations (One per line)</label>
        <textarea 
          id="popularLocations"
          name="popularLocations" 
          defaultValue={initialStats.popularLocations} 
          rows={4}
          placeholder="Sector 150, Noida&#10;Sector 128, Noida&#10;Greater Noida West&#10;Yamuna Expressway"
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <p className="text-xs text-muted-foreground">These locations will be displayed in the footer under &quot;Popular Locations&quot;. Enter one location per line.</p>
      </div>

      <div className="pt-4">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
