"use client";

import * as React from "react";
import { LeadForm } from "./LeadForm";
import { Button } from "@/components/ui/button";
import { Loader2, Check, ChevronsUpDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";

import { PropertyType } from "@/modules/properties/types/enums";
import { getActiveCitiesAction } from "@/modules/locations/locations.actions";

const PROPERTY_TYPES = Object.values(PropertyType);



const BUDGETS = [
  "₹0 - ₹50 Lacs",
  "₹50 Lacs - ₹1 Cr",
  "₹1 Cr - ₹1.5 Cr",
  "₹1.5 Cr - ₹3 Cr",
  "₹3 Cr - ₹5 Cr",
  "₹5 Cr - ₹10 Cr",
  "₹10 Cr+"
];

export function GeneralEnquiryForm() {
  const [cities, setCities] = React.useState<{id: string, name: string}[]>([]);
  
  React.useEffect(() => {
    getActiveCitiesAction().then(res => setCities(res || []));
  }, []);

  const [openLocation, setOpenLocation] = React.useState(false);
  const [locationValue, setLocationValue] = React.useState("");
  
  const [openProperty, setOpenProperty] = React.useState(false);
  const [propertyValue, setPropertyValue] = React.useState("");
  
  const [openBudget, setOpenBudget] = React.useState(false);
  const [budgetValue, setBudgetValue] = React.useState("");

  return (
    <LeadForm type="General">
      {({ isLoading, error, onSubmit }) => (
        <form onSubmit={onSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="name" className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Full Name *</label>
              <input id="name" name="name" type="text" required className="w-full px-3 h-10 rounded-xl border border-border/50 bg-background outline-none focus:border-primary transition-colors text-foreground shadow-sm text-xs" placeholder="John Doe" />
            </div>
            <div className="space-y-1">
              <label htmlFor="phone" className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Phone Number *</label>
              <input id="phone" name="phone" type="tel" required className="w-full px-3 h-10 rounded-xl border border-border/50 bg-background outline-none focus:border-primary transition-colors text-foreground shadow-sm text-xs" placeholder="+91 98765 43210" />
            </div>
          </div>
          
          <div className="space-y-1">
            <label htmlFor="email" className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Email Address *</label>
            <input id="email" name="email" type="email" required className="w-full px-3 h-10 rounded-xl border border-border/50 bg-background outline-none focus:border-primary transition-colors text-foreground shadow-sm text-xs" placeholder="john@example.com" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1 flex flex-col">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">City</label>
              
              <input type="hidden" name="location" value={locationValue} />
              
              <Popover open={openLocation} onOpenChange={setOpenLocation}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openLocation}
                    className="w-full justify-between px-3 h-10 rounded-xl border border-border/50 bg-background hover:bg-background hover:text-foreground outline-none focus:border-primary transition-colors text-foreground shadow-sm text-xs font-normal"
                  >
                    {locationValue ? locationValue : "Select City"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search city..." className="h-9 text-xs" />
                    <CommandList>
                      <CommandEmpty>No city found.</CommandEmpty>
                      <CommandGroup>
                        {cities.map((city) => (
                          <CommandItem
                            key={city.id}
                            value={city.name}
                            onSelect={(currentValue) => {
                              const originalCase = cities.find(c => c.name.toLowerCase() === currentValue.toLowerCase())?.name || city.name;
                              setLocationValue(originalCase === locationValue ? "" : originalCase);
                              setOpenLocation(false);
                            }}
                            className="text-xs"
                          >
                            <Check className={cn("mr-2 h-4 w-4", locationValue === city.name ? "opacity-100" : "opacity-0")} />
                            {city.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-1 flex flex-col">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Property Type</label>
              
              <input type="hidden" name="propertyType" value={propertyValue} />
              
              <Popover open={openProperty} onOpenChange={setOpenProperty}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openProperty}
                    className="w-full justify-between px-3 h-10 rounded-xl border border-border/50 bg-background hover:bg-background hover:text-foreground outline-none focus:border-primary transition-colors text-foreground shadow-sm text-xs font-normal"
                  >
                    {propertyValue ? propertyValue : "Select Type"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                  <Command>
                    <CommandList>
                      <CommandGroup>
                        {PROPERTY_TYPES.map((type) => (
                          <CommandItem
                            key={type}
                            value={type}
                            onSelect={(currentValue) => {
                              const originalCase = PROPERTY_TYPES.find(t => t.toLowerCase() === currentValue.toLowerCase()) || type;
                              setPropertyValue(originalCase === propertyValue ? "" : originalCase);
                              setOpenProperty(false);
                            }}
                            className="text-xs"
                          >
                            <Check className={cn("mr-2 h-4 w-4", propertyValue === type ? "opacity-100" : "opacity-0")} />
                            {type}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-1 flex flex-col">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Approximate Budget</label>
            
            <input type="hidden" name="budget" value={budgetValue} />
            
            <Popover open={openBudget} onOpenChange={setOpenBudget}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openBudget}
                  className="w-full justify-between px-3 h-10 rounded-xl border border-border/50 bg-background hover:bg-background hover:text-foreground outline-none focus:border-primary transition-colors text-foreground shadow-sm text-xs font-normal"
                >
                  {budgetValue ? budgetValue : "Select Budget Range"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command>
                  <CommandList>
                    <CommandGroup>
                      {BUDGETS.map((budget) => (
                        <CommandItem
                          key={budget}
                          value={budget}
                          onSelect={(currentValue) => {
                            const originalCase = BUDGETS.find(b => b.toLowerCase() === currentValue.toLowerCase()) || budget;
                            setBudgetValue(originalCase === budgetValue ? "" : originalCase);
                            setOpenBudget(false);
                          }}
                          className="text-xs"
                        >
                          <Check className={cn("mr-2 h-4 w-4", budgetValue === budget ? "opacity-100" : "opacity-0")} />
                          {budget}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-1">
            <label htmlFor="message" className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Message</label>
            <textarea id="message" name="message" rows={2} className="w-full px-3 py-2 rounded-xl border border-border/50 bg-background outline-none focus:border-primary transition-colors text-foreground resize-none shadow-sm min-h-[50px] max-h-[80px] text-xs" placeholder="How can we assist with your property search?" />
          </div>

          {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

          <Button type="submit" disabled={isLoading} className="w-full rounded-full h-10 bg-primary text-primary-foreground font-bold hover:bg-primary/90 text-sm shadow-lg shadow-primary/20 mt-1">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {isLoading ? "Submitting..." : "Submit Enquiry"}
          </Button>
        </form>
      )}
    </LeadForm>
  );
}

