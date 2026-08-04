"use client";

import * as React from "react";
import { Job } from "@/modules/jobs/models/job.model";
import { Button } from "@/components/ui/button";
import { MapPin, Briefcase, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import { JobApplicationModal } from "./JobApplicationModal";

import Link from "next/link";

export function CareerJobs({ jobs }: { jobs: Job[] }) {
  const [selectedJob, setSelectedJob] = React.useState<Job | null>(null);

  const handleApply = (job: Job) => {
    setSelectedJob(job);
  };

  return (
    <section id="jobs" className="py-24 bg-background relative">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        {jobs.length === 0 ? (
          <div className="text-center max-w-3xl mx-auto py-16 bg-white rounded-3xl border border-border/50 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Briefcase className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
              No Open Positions
            </h2>
            <p className="text-muted-foreground text-lg mb-8 whitespace-pre-line max-w-xl mx-auto">
              Thank you for your interest in joining Square AR Spaces.{"\n\n"}
              We currently don&apos;t have any active openings. Please check back later for future career opportunities.
            </p>
            <Button asChild variant="outline" className="rounded-full px-8 h-12 border-primary text-primary hover:bg-primary/5 transition-colors">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
                Current Open Positions
              </h2>
              <p className="text-muted-foreground text-lg">
                Explore our latest career opportunities. Join us in shaping the future of premium real estate.
              </p>
            </div>

            {/* Desktop Table */}
            <div className="hidden lg:block bg-white rounded-3xl shadow-lg border border-border/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface/80 border-b border-border/50">
                      <th className="py-5 px-6 font-semibold text-foreground text-sm uppercase tracking-wider sticky top-0 bg-surface/80 backdrop-blur-md">S.No</th>
                      <th className="py-5 px-6 font-semibold text-foreground text-sm uppercase tracking-wider sticky top-0 bg-surface/80 backdrop-blur-md">Position</th>
                      <th className="py-5 px-6 font-semibold text-foreground text-sm uppercase tracking-wider sticky top-0 bg-surface/80 backdrop-blur-md">Openings</th>
                      <th className="py-5 px-6 font-semibold text-foreground text-sm uppercase tracking-wider sticky top-0 bg-surface/80 backdrop-blur-md">Location</th>
                      <th className="py-5 px-6 font-semibold text-foreground text-sm uppercase tracking-wider sticky top-0 bg-surface/80 backdrop-blur-md">Experience</th>
                      <th className="py-5 px-6 font-semibold text-foreground text-sm uppercase tracking-wider sticky top-0 bg-surface/80 backdrop-blur-md w-64">Requirements</th>
                      <th className="py-5 px-6 font-semibold text-foreground text-sm uppercase tracking-wider sticky top-0 bg-surface/80 backdrop-blur-md text-right">Apply</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((job, idx) => (
                      <motion.tr 
                        key={job.id}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.05 }}
                        className="border-b border-border/40 hover:bg-primary/5 transition-colors group"
                      >
                        <td className="py-5 px-6 text-muted-foreground font-medium">{idx + 1}</td>
                        <td className="py-5 px-6 text-foreground font-bold font-heading">{job.title}</td>
                        <td className="py-5 px-6 text-primary font-semibold">{job.openings}</td>
                        <td className="py-5 px-6 text-muted-foreground text-sm">
                          <div className="flex items-start">
                            <MapPin className="w-4 h-4 mr-1.5 mt-0.5 text-primary/70 shrink-0" />
                            <span className="whitespace-pre-line">{job.location}</span>
                          </div>
                        </td>
                        <td className="py-5 px-6 text-muted-foreground text-sm">
                          <div className="flex items-center">
                            <Briefcase className="w-4 h-4 mr-1.5 text-primary/70 shrink-0" />
                            {job.experience}
                          </div>
                        </td>
                        <td className="py-5 px-6 text-muted-foreground text-sm">
                          <div className="flex items-start">
                            <GraduationCap className="w-4 h-4 mr-1.5 mt-0.5 text-primary/70 shrink-0" />
                            <span className="whitespace-pre-line leading-relaxed line-clamp-3">{job.requirements || job.description || "See details"}</span>
                          </div>
                        </td>
                        <td className="py-5 px-6 text-right">
                          <Button onClick={() => handleApply(job)} className="rounded-full shadow-sm hover:shadow-md transition-all px-6">
                            Apply Now
                          </Button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile & Tablet Cards */}
            <div className="grid lg:hidden gap-6">
              {jobs.map((job, idx) => (
                <motion.div 
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-3xl p-6 border border-border/50 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-4 pb-4 border-b border-border/40">
                    <div>
                      <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
                        {job.openings} Openings
                      </span>
                      <h3 className="text-xl font-bold font-heading text-foreground">{job.title}</h3>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 mr-3 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Location</p>
                        <p className="text-sm font-medium whitespace-pre-line">{job.location}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Briefcase className="w-5 h-5 mr-3 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Experience</p>
                        <p className="text-sm font-medium">{job.experience}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <GraduationCap className="w-5 h-5 mr-3 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Requirements</p>
                        <p className="text-sm font-medium whitespace-pre-line leading-relaxed line-clamp-3">{job.requirements || job.description || "See details"}</p>
                      </div>
                    </div>
                  </div>

                  <Button onClick={() => handleApply(job)} className="w-full rounded-full h-12 text-base">
                    Apply Now
                  </Button>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>

      <JobApplicationModal 
        job={selectedJob} 
        isOpen={!!selectedJob} 
        onClose={() => setSelectedJob(null)} 
      />
    </section>
  );
}
