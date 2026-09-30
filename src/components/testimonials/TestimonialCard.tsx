"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { Testimonial } from "@/modules/testimonials/types";

export function TestimonialCard({ testimonial, index }: { testimonial: Testimonial; index?: number }) {
  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };

  const cardVariants = {
    hidden: (i: number) => {
      let xOffset = 0;
      if (i % 3 === 0) xOffset = 150;
      else if (i % 3 === 2) xOffset = -150;
      return { opacity: 0, x: xOffset, y: 100, scale: 0.9 };
    },
    visible: (i: number) => ({
      opacity: 1, x: 0, y: 0, scale: 1,
      transition: { type: 'spring' as const, bounce: 0.3, duration: 0.8, delay: (i % 3) * 0.15 }
    })
  };

  const isAnimated = index !== undefined;
  
  const content = (
    <div className="bg-white rounded-3xl px-6 pb-6 pt-20 border border-brand-slate/20 shadow-sm hover:shadow-md transition-shadow flex flex-col relative mt-20 text-center h-auto">
      {/* Overlapping profile image with red border */}
      <div className="absolute -top-16 left-1/2 -translate-x-1/2">
        <div className="w-32 h-32 rounded-full border-[3px] border-white bg-white shadow-sm relative">
          <div className="w-full h-full rounded-full border-2 border-brand-red overflow-hidden flex items-center justify-center bg-brand-surface text-brand-navy font-bold text-4xl">
            {testimonial.profileImageUrl ? (
              <Image
                unoptimized
                src={testimonial.profileImageUrl}
                alt={testimonial.name}
                fill
                className="object-cover rounded-full"
              />
            ) : (
              getInitials(testimonial.name)
            )}
          </div>
        </div>
      </div>

      <div className="mb-3">
        <h4 className="font-bold text-brand-navy text-[18px]">
          {testimonial.name}
        </h4>
        {testimonial.location && (
          <p className="text-[14px] text-brand-slate mt-0.5">
            {testimonial.location}
          </p>
        )}
      </div>

      <div className="flex justify-center gap-1 mb-5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${
              i < testimonial.rating
                ? "fill-[#FFC107] text-[#FFC107]"
                : "fill-brand-slate/20 text-brand-slate/20"
            }`}
          />
        ))}
      </div>

      <div className="relative flex flex-col justify-center mb-6 px-2">
        {/* Decorative Quote Mark */}
        <span className="absolute -top-4 -left-1 text-5xl text-brand-slate/10 font-serif leading-none select-none">
          &ldquo;
        </span>
        <p className="text-brand-navy/80 text-[15px] italic leading-relaxed relative z-10">
          &ldquo;{testimonial.message}&rdquo;
        </p>
      </div>

      <div className="pt-4 border-t border-brand-slate/20 mt-auto">
        <p className="text-sm text-brand-navy/60 font-medium">Verified Customer</p>
      </div>
    </div>
  );

  if (isAnimated) {
    return (
      <motion.div 
        custom={index}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={cardVariants}
        className="w-full"
      >
        {content}
      </motion.div>
    );
  }

  return <div className="w-full">{content}</div>;
}
