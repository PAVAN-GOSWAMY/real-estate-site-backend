"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createJobAction, updateJobAction } from "@/modules/jobs/actions/jobs.actions";
import { JobSchema } from "@/modules/jobs/validation/job.schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Job, JobStatus } from "@/modules/jobs/models/job.model";

interface JobFormProps {
  initialData?: Job;
}

export function JobForm({ initialData }: JobFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string>();
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [status, setStatus] = useState<JobStatus>(initialData?.status ?? "Draft");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError(undefined);
    setErrors({});
    
    const formData = new FormData(e.currentTarget);
    const payload = {
      title: formData.get("title") as string,
      department: formData.get("department") as string,
      employment_type: formData.get("employment_type") as string,
      location: formData.get("location") as string,
      experience: formData.get("experience") as string,
      salary: formData.get("salary") as string,
      openings: formData.get("openings"),
      description: formData.get("description") as string,
      requirements: formData.get("requirements") as string,
      responsibilities: formData.get("responsibilities") as string,
      benefits: formData.get("benefits") as string,
      skills: formData.get("skills") as string,
      status: status,
    };

    const result = JobSchema.safeParse(payload);
    
    if (!result.success) {
      const formattedErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        formattedErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(formattedErrors);
      return;
    }
    
    startTransition(async () => {
      try {
        let actionResult;
        if (initialData) {
          actionResult = await updateJobAction(initialData.id, result.data);
        } else {
          actionResult = await createJobAction(result.data);
        }
        
        if (actionResult.success) {
          router.push("/admin/jobs");
          router.refresh();
        } else {
          setServerError(actionResult.error);
        }
      } catch (error: any) {
        setServerError(error.message || "An unexpected error occurred.");
      }
    });
  };

  return (
    <form onSubmit={onSubmit} noValidate>
      {serverError && (
        <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md text-sm font-medium mb-6">
          {serverError}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title <span className="text-destructive">*</span></Label>
                  <Input id="title" name="title" defaultValue={initialData?.title || ""} disabled={isPending} aria-invalid={!!errors.title} />
                  {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="department">Department <span className="text-destructive">*</span></Label>
                  <Input id="department" name="department" defaultValue={initialData?.department || ""} disabled={isPending} aria-invalid={!!errors.department} />
                  {errors.department && <p className="text-sm text-destructive">{errors.department}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employment_type">Employment Type <span className="text-destructive">*</span></Label>
                  <Select name="employment_type" defaultValue={initialData?.employment_type || "Full Time"} disabled={isPending}>
                    <SelectTrigger aria-invalid={!!errors.employment_type}>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full Time">Full Time</SelectItem>
                      <SelectItem value="Part Time">Part Time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.employment_type && <p className="text-sm text-destructive">{errors.employment_type}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location <span className="text-destructive">*</span></Label>
                  <Input id="location" name="location" defaultValue={initialData?.location || ""} disabled={isPending} aria-invalid={!!errors.location} />
                  {errors.location && <p className="text-sm text-destructive">{errors.location}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="description">Short Description</Label>
                <Textarea id="description" name="description" rows={3} defaultValue={initialData?.description || ""} disabled={isPending} />
                {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Requirements</Label>
                <Textarea id="requirements" name="requirements" rows={5} defaultValue={initialData?.requirements || ""} disabled={isPending} />
                {errors.requirements && <p className="text-sm text-destructive">{errors.requirements}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="responsibilities">Responsibilities</Label>
                <Textarea id="responsibilities" name="responsibilities" rows={5} defaultValue={initialData?.responsibilities || ""} disabled={isPending} />
                {errors.responsibilities && <p className="text-sm text-destructive">{errors.responsibilities}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Skills Required</Label>
                <Textarea id="skills" name="skills" rows={3} defaultValue={initialData?.skills || ""} disabled={isPending} />
                {errors.skills && <p className="text-sm text-destructive">{errors.skills}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="benefits">Benefits</Label>
                <Textarea id="benefits" name="benefits" rows={3} defaultValue={initialData?.benefits || ""} disabled={isPending} />
                {errors.benefits && <p className="text-sm text-destructive">{errors.benefits}</p>}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Publishing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={(val: JobStatus) => setStatus(val)} disabled={isPending}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Published">Published</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 border-t px-6 py-4">
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? "Saving..." : initialData ? "Save Changes" : "Create Job"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={isPending} className="w-full">
                Cancel
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Compensation & Capacity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="experience">Experience <span className="text-destructive">*</span></Label>
                <Input id="experience" name="experience" placeholder="e.g. 2-5 Years" defaultValue={initialData?.experience || ""} disabled={isPending} aria-invalid={!!errors.experience} />
                {errors.experience && <p className="text-sm text-destructive">{errors.experience}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary">Salary (Optional)</Label>
                <Input id="salary" name="salary" placeholder="e.g. ₹5L - ₹8L per annum" defaultValue={initialData?.salary || ""} disabled={isPending} />
                {errors.salary && <p className="text-sm text-destructive">{errors.salary}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="openings">No. of Openings <span className="text-destructive">*</span></Label>
                <Input id="openings" name="openings" type="number" min="1" defaultValue={initialData?.openings || 1} disabled={isPending} aria-invalid={!!errors.openings} />
                {errors.openings && <p className="text-sm text-destructive">{errors.openings}</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
