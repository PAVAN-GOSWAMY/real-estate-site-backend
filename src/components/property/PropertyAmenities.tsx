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

  const allAmenities = groups.flatMap(group => group.items);

  return (
    <div className="space-y-10">
      <div className="text-center flex flex-col items-center">
        <p className="text-sm font-bold text-brand-red uppercase tracking-wider mb-2 flex items-center gap-2">
          <span className="w-8 h-[2px] bg-brand-red rounded-full"></span> Features
        </p>
        <h3 className="font-heading text-3xl md:text-4xl font-bold text-brand-navy mb-4">World-Class Amenities</h3>
        <p className="text-brand-navy/80 text-lg max-w-2xl">Thoughtfully curated amenities for a comfortable, convenient, and elevated lifestyle.</p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid gap-4"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}
      >
        {allAmenities.map((item, idx) => (
          <motion.div
            variants={cardVariants}
            key={idx}
            className="bg-white rounded-xl border border-brand-slate/50 p-4 shadow-sm hover:shadow-[0_10px_20px_rgb(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center text-center gap-3 group cursor-default"
          >
            <div className="h-12 w-12 rounded-full bg-brand-surface border border-brand-slate/30 text-brand-blue group-hover:bg-brand-slate/20 transition-all duration-300 flex items-center justify-center shrink-0">
              <DynamicIcon name={item.iconKey || "Check"} className="h-6 w-6" />
            </div>
            <span className="text-sm font-semibold text-brand-navy/70 group-hover:text-brand-navy transition-colors leading-snug">
              {item.name}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* Highlights Bar */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="mt-16 bg-brand-surface rounded-[2rem] border border-brand-slate/50 shadow-sm p-8 md:p-12 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-background/40 mix-blend-overlay pointer-events-none"></div>
        <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col items-center relative z-10">
          <p className="text-brand-navy font-bold text-sm tracking-wider uppercase mb-3">Built for a Better Life</p>
          <div className="h-1 w-12 bg-brand-navy rounded-full mb-6" />
          <h3 className="font-heading text-3xl md:text-4xl font-bold text-brand-navy mb-4">Thoughtfully Designed For You</h3>
          <p className="text-brand-navy/80 text-lg">
            Experience the perfect blend of luxury, sustainability, and community in every aspect of your living.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-0 lg:divide-x divide-brand-slate/50 relative z-10">
          <HighlightCard 
            icon="ShieldCheck" 
            title="Safe & Secure" 
            desc="Advanced security for complete peace of mind." 
            iconBg="bg-white" 
            iconColor="text-brand-blue" 
          />
          <HighlightCard 
            icon="Leaf" 
            title="Green Living" 
            desc="Sustainable spaces for a healthier lifestyle." 
            iconBg="bg-white" 
            iconColor="text-brand-blue" 
          />
          <HighlightCard 
            icon="Gem" 
            title="Premium Lifestyle" 
            desc="Luxury amenities for modern and elevated living." 
            iconBg="bg-white" 
            iconColor="text-brand-blue" 
          />
          <HighlightCard 
            icon="Users" 
            title="Community Living" 
            desc="Spaces designed for connection and togetherness." 
            iconBg="bg-white" 
            iconColor="text-brand-blue" 
          />
        </div>
      </motion.div>
    </div>
  );
}

function HighlightCard({ icon, title, desc, iconBg, iconColor }: { icon: string, title: string, desc: string, iconBg: string, iconColor: string }) {
  return (
    <div className="flex flex-col items-center text-center px-4 md:px-8 group">
      <div className={`h-20 w-20 rounded-full ${iconBg} ${iconColor} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-md border border-brand-slate/50 transition-all duration-300`}>
        <DynamicIcon name={icon} className="h-8 w-8" />
      </div>
      <h5 className="font-bold text-brand-navy text-xl mb-3">{title}</h5>
      <div className="h-0.5 w-8 bg-brand-red/30 mb-4 rounded-full group-hover:bg-brand-red group-hover:w-12 transition-all duration-300" />
      <p className="text-base text-brand-navy/80 leading-relaxed">{desc}</p>
    </div>
  );
}
