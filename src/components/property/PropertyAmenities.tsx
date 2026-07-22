"use client";

import { motion, Variants } from "framer-motion";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { PublicAmenityGroup } from "@/modules/public/types/property";

interface PropertyAmenitiesProps {
  groups: PublicAmenityGroup[];
}

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'community': return 'Users';
    case 'convenience': return 'Settings2';
    case 'fitness': return 'Dumbbell';
    case 'kids': return 'Baby';
    case 'luxury': return 'Gem';
    case 'outdoor': return 'TreePine';
    case 'parking': return 'Car';
    case 'security': return 'ShieldCheck';
    default: return 'Star';
  }
};

export function PropertyAmenities({ groups }: PropertyAmenitiesProps) {
  if (!groups || groups.length === 0) return null;

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="space-y-10">
      <div className="text-center md:text-left">
        <h3 className="font-heading text-3xl font-bold text-primary mb-3">World-Class Amenities</h3>
        <p className="text-muted-foreground text-lg max-w-2xl">Thoughtfully curated amenities for a comfortable, convenient and elevated lifestyle.</p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch"
      >
        {groups.map((group, idx) => (
          <motion.div
            variants={cardVariants}
            key={idx}
            className="h-full bg-card rounded-2xl border border-border/50 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-start"
          >
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="h-12 w-12 rounded-full bg-primary/10 text-primary shadow-sm flex items-center justify-center shrink-0">
                <DynamicIcon name={getCategoryIcon(group.category)} className="h-6 w-6" />
              </div>
              <h4 className="font-bold text-base sm:text-lg text-primary flex-1">
                {group.category}
              </h4>
            </div>

            {/* List */}
            <ul className="space-y-0 flex-1">
              {group.items.map((item, itemIdx) => (
                <li
                  key={itemIdx}
                  className="flex items-start gap-3 py-3 border-b border-border/40 last:border-0 last:pb-0"
                >
                  <DynamicIcon name={item.iconKey || "Check"} className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors leading-snug flex-1">
                    {item.name}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>

      {/* Highlights Bar */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="mt-16 bg-card rounded-[2rem] border border-border/50 shadow-sm p-8 md:p-12"
      >
        <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col items-center">
          <p className="text-accent font-medium text-sm mb-2">Built for a Better Life</p>
          <div className="h-0.5 w-12 bg-accent/40 rounded-full mb-6" />
          <h3 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">Thoughtfully Designed For You</h3>
          <p className="text-muted-foreground">
            Experience the perfect blend of luxury, sustainability, and community<br className="hidden md:block"/> in every aspect of your living.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-0 lg:divide-x divide-border/50">
          <HighlightCard 
            icon="ShieldCheck" 
            title="Safe & Secure" 
            desc="Advanced security for complete peace of mind." 
            iconBg="bg-amber-50" 
            iconColor="text-amber-500" 
          />
          <HighlightCard 
            icon="Leaf" 
            title="Green Living" 
            desc="Sustainable spaces for a healthier lifestyle." 
            iconBg="bg-green-50" 
            iconColor="text-green-600" 
          />
          <HighlightCard 
            icon="Gem" 
            title="Premium Lifestyle" 
            desc="Luxury amenities for modern and elevated living." 
            iconBg="bg-indigo-50" 
            iconColor="text-indigo-500" 
          />
          <HighlightCard 
            icon="Users" 
            title="Community Living" 
            desc="Spaces designed for connection and togetherness." 
            iconBg="bg-orange-50" 
            iconColor="text-orange-500" 
          />
        </div>
      </motion.div>
    </div>
  );
}

function HighlightCard({ icon, title, desc, iconBg, iconColor }: { icon: string, title: string, desc: string, iconBg: string, iconColor: string }) {
  return (
    <div className="flex flex-col items-center text-center px-4 md:px-8 group">
      <div className={`h-20 w-20 rounded-full ${iconBg} ${iconColor} flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300`}>
        <DynamicIcon name={icon} className="h-8 w-8" />
      </div>
      <h5 className="font-bold text-foreground text-lg mb-3">{title}</h5>
      <div className="h-0.5 w-8 bg-accent mb-4 rounded-full" />
      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}
