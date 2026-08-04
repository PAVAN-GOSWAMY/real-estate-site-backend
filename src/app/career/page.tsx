import * as React from "react";
import { Metadata } from "next";
import { CareerHero } from "@/components/career/CareerHero";
import { CareerWhyJoin } from "@/components/career/CareerWhyJoin";
import { CareerBenefits } from "@/components/career/CareerBenefits";
import { CareerJobs } from "@/components/career/CareerJobs";
import { CareerServicesGrid } from "@/components/career/CareerServicesGrid";
import { CareerSuccessStories } from "@/components/career/CareerSuccessStories";
import { CareerFAQ } from "@/components/career/CareerFAQ";
import { CareerCTA } from "@/components/career/CareerCTA";

import { siteConfig } from "@/config/site";
import { JobsRepository } from "@/modules/jobs/repository/jobs.repository";

export const metadata: Metadata = {
  title: `Careers & Job Openings | ${siteConfig.name}`,
  description: "Explore career opportunities at Square AR Spaces. We are hiring talented professionals for pre-sales, sales, and leadership roles in Noida and Greater Noida.",
  alternates: {
    canonical: "/career",
  },
  openGraph: {
    title: `Careers & Job Openings | ${siteConfig.name}`,
    description: "Explore career opportunities at Square AR Spaces. We are hiring talented professionals for pre-sales, sales, and leadership roles in Noida and Greater Noida.",
  },
};

export default async function CareerPage() {
  const jobs = await JobsRepository.findAll(true); // activeOnly = true

  return (
    <main className="min-h-screen">
      <CareerHero />
      <CareerWhyJoin />
      <CareerBenefits />
      <CareerJobs jobs={jobs} />
      
      {/* Retained legacy sections for future career-specific content substitution */}
      <CareerServicesGrid />
      <CareerSuccessStories />
      <CareerFAQ />
      <CareerCTA />
    </main>
  );
}
