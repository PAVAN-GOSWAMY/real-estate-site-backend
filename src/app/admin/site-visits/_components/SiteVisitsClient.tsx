"use client";

import { useState } from "react";
import { SiteVisit, SiteVisitStatus } from "@/types/site-visit";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { updateSiteVisitStatusAction } from "@/modules/site-visits/actions/admin-site-visit.actions";

interface SiteVisitsClientProps {
  initialVisits: SiteVisit[];
}

export function SiteVisitsClient({ initialVisits }: SiteVisitsClientProps) {
  const [visits, setVisits] = useState(initialVisits);

  const handleStatusChange = async (visitId: string, newStatus: string) => {
    // Optimistic update
    setVisits((prev) =>
      prev.map((v) => (v.id === visitId ? { ...v, status: newStatus as SiteVisitStatus } : v))
    );

    const result = await updateSiteVisitStatusAction(visitId, newStatus as SiteVisitStatus);
    if (!result.success) {
      toast.error(result.error || "Failed to update status.");
      // Revert optimism
      setVisits(initialVisits);
    } else {
      toast.success("Status updated successfully.");
      // In a real app we might re-fetch from server to guarantee sync
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Pending":
        return "secondary";
      case "Scheduled":
        return "default";
      case "Completed":
        return "outline"; // Ideally a green variant, using outline as fallback
      case "Cancelled":
      case "No Show":
        return "destructive";
      default:
        return "default";
    }
  };

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Property / Builder</TableHead>
            <TableHead>Requested Date</TableHead>
            <TableHead>Requested Time</TableHead>
            <TableHead>Visitors</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {visits.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No site visits found.
              </TableCell>
            </TableRow>
          ) : (
            visits.map((visit) => (
              <TableRow key={visit.id}>
                <TableCell>
                  <div className="font-medium">{visit.lead?.fullName || "Unknown"}</div>
                  <div className="text-xs text-muted-foreground">{visit.lead?.phone || ""}</div>
                  {visit.lead?.email && <div className="text-xs text-muted-foreground">{visit.lead.email}</div>}
                </TableCell>
                <TableCell>
                  <div className="font-medium">{visit.property?.title || "Any Property"}</div>
                  <div className="text-xs text-muted-foreground">{visit.builder?.name || "Any Builder"}</div>
                </TableCell>
                <TableCell>
                  {format(new Date(visit.preferredDate), "MMM dd, yyyy")}
                </TableCell>
                <TableCell>
                  {visit.preferredTime}
                </TableCell>
                <TableCell>
                  {visit.visitorsCount}
                </TableCell>
                <TableCell>
                  <Select
                    defaultValue={visit.status}
                    onValueChange={(val) => handleStatusChange(visit.id, val)}
                  >
                    <SelectTrigger className="w-[130px] h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Scheduled">Scheduled</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                      <SelectItem value="No Show">No Show</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
