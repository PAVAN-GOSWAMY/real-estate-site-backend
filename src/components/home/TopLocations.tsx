"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Section, Container, SectionHeader, SectionTitle, SectionDescription } from "@/components/layout/wrappers";

// Wrap custom typography components with motion for animation
const MotionSectionTitle = motion.create(SectionTitle);
const MotionSectionDescription = motion.create(SectionDescription);

interface LocationItem {
  name: string;
  slug: string;
  image: string;
  propertyCount: number;
}

export function TopLocations({ locations }: { locations: LocationItem[] }) {
  if (!locations || locations.length === 0) return null;

  return (
    <Section className="bg-surface pt-4 md:pt-6">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 gap-4">
          <SectionHeader className="mb-0">
            <MotionSectionTitle 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Premium Locations
            </MotionSectionTitle>
            <MotionSectionDescription 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Explore luxury properties in Noida and Greater Noida&apos;s most sought-after neighborhoods.
            </MotionSectionDescription>
          </SectionHeader>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {locations.map((location, index) => (
            <motion.div
              key={location.slug}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/properties?location=${location.slug}`} className="group block relative h-80 rounded-2xl overflow-hidden cursor-pointer">
                <Image
                  src={location.image}
                  alt={location.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent transition-opacity duration-300 group-hover:opacity-90" />
                
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <div className="flex justify-between items-end">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1 font-heading group-hover:text-accent transition-colors">
                        {location.name}
                      </h3>
                      <p className="text-white/80 text-sm">
                        {location.propertyCount} Properties
                      </p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-md rounded-full p-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <ArrowUpRight className="text-white h-5 w-5" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
