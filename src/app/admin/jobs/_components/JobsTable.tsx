"use client"

import { useState } from "react"
import { Job } from "@/modules/jobs/models/job.model"
import { deleteJobAction } from "@/modules/jobs/actions/jobs.actions"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash, Copy, Eye, MoreHorizontal, Briefcase } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface JobsTableProps {
  jobs: Job[]
  total: number
  currentPage: number
  pageSize: number
}

export function JobsTable({ jobs, total, currentPage, pageSize }: JobsTableProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return
    setIsDeleting(id)
    try {
      const res = await deleteJobAction(id)
      if (res.success) {
        toast.success("Job Deleted", {
          description: "The job has been successfully deleted.",
        })
      } else {
        toast.error("Error", {
          description: res.error || "Failed to delete job.",
        })
      }
    } catch (e: any) {
      toast.error("Error", {
        description: e.message || "Failed to delete job.",
      })
    } finally {
      setIsDeleting(null)
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Published": return "default"
      case "Draft": return "secondary"
      case "Closed": return "destructive"
      default: return "outline"
    }
  }

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white border border-dashed rounded-xl shadow-sm text-center">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Briefcase className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No Jobs Found</h3>
        <p className="text-muted-foreground mb-6 max-w-sm">
          You haven&apos;t created any job postings yet. Get started by creating your first job.
        </p>
        <Button asChild>
          <Link href="/admin/jobs/create">Create First Job</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Published On</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job) => (
            <TableRow key={job.id}>
              <TableCell className="font-medium">{job.title}</TableCell>
              <TableCell>{job.department}</TableCell>
              <TableCell>{job.location}</TableCell>
              <TableCell>{job.employment_type}</TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(job.status)}>
                  {job.status}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground whitespace-nowrap">
                {format(new Date(job.created_at), "MMM dd, yyyy")}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link href={`/career`} target="_blank">
                        <Eye className="mr-2 h-4 w-4" />
                        View Live
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/jobs/${job.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Job
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => handleDelete(job.id)}
                      disabled={isDeleting === job.id}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      {isDeleting === job.id ? "Deleting..." : "Delete"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
