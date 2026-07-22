import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Download, Maximize2 } from "lucide-react";

import { PropertyFloorPlan } from "@/modules/properties/types/assets";

interface PropertyFloorPlansProps {
  floorPlans: PropertyFloorPlan[];
}

export function PropertyFloorPlans({ floorPlans }: PropertyFloorPlansProps) {
  if (!floorPlans || floorPlans.length === 0) return null;

  return (
    <div className="space-y-6">
      <h3 className="font-heading text-2xl font-bold text-primary">Master & Floor Plans</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {floorPlans.map((plan) => (
          <div key={plan.id} className="group relative bg-surface rounded-2xl overflow-hidden border border-border/50">
            <div className="relative h-64 w-full bg-white p-4">
              <Image 
                src={plan.imageUrl}
                alt={plan.name}
                fill
                className="object-contain"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                <Button variant="secondary" size="icon" className="rounded-full bg-white text-primary hover:bg-primary hover:text-primary-foreground">
                  <Maximize2 className="h-4 w-4" />
                </Button>
                <Button variant="secondary" size="icon" className="rounded-full bg-white text-primary hover:bg-primary hover:text-primary-foreground">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="p-4 border-t border-border/50 bg-background flex justify-between items-center">
              <div>
                <h4 className="font-semibold text-foreground">{plan.name}</h4>
                {plan.area && plan.unit && <p className="text-sm text-muted-foreground">{plan.area} {plan.unit}</p>}
              </div>
              <Button variant="ghost" size="sm" className="text-accent hover:text-accent-foreground hover:bg-accent/10">
                Enquire
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
