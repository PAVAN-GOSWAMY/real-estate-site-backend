"use client";

import { useTransition } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, MessageSquare, Mail, CheckCircle, XCircle, Clock, CalendarIcon, User, RefreshCw, AlertCircle } from "lucide-react";
import Link from "next/link";
import { logCommunicationAction, updateLeadFollowUpStatusAction } from "@/modules/leads/actions/leads.actions";
import { toast } from "sonner";
import { generateWhatsAppLink, generateEmailLink, generateCallLink } from "@/modules/leads/utils/communication";
import { useRouter } from "next/navigation";

interface FollowUpListProps {
  followUps: any[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  filters: any;
}

export function FollowUpList({ followUps, totalPages, currentPage }: FollowUpListProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleStatusUpdate = (id: string, leadId: string, status: string) => {
    startTransition(async () => {
      const result = await updateLeadFollowUpStatusAction(id, leadId, status);
      if (result.success) {
        toast.success(`Follow-up marked as ${status}`);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update status");
      }
    });
  };

  const logComm = (leadId: string, type: "Phone Call Initiated" | "WhatsApp Opened" | "Email Draft Opened") => {
    startTransition(async () => {
      await logCommunicationAction(leadId, type, `Initiated via Follow-ups List`);
    });
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "Urgent": return <Badge variant="destructive" className="bg-rose-500 hover:bg-rose-600">Urgent</Badge>;
      case "High": return <Badge variant="outline" className="text-orange-500 border-orange-200 bg-orange-50">High</Badge>;
      case "Medium": return <Badge variant="outline" className="text-blue-500 border-blue-200 bg-blue-50">Medium</Badge>;
      case "Low": return <Badge variant="outline" className="text-slate-500 border-slate-200 bg-slate-50">Low</Badge>;
      default: return null;
    }
  };

  const getStatusDisplay = (status: string, date: string) => {
    if (status === 'Completed') return <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
    if (status === 'Cancelled') return <Badge variant="outline" className="text-slate-500 border-slate-200 bg-slate-50"><XCircle className="h-3 w-3 mr-1" />Cancelled</Badge>;
    if (status === 'Missed') return <Badge variant="outline" className="text-rose-500 border-rose-200 bg-rose-50"><AlertCircle className="h-3 w-3 mr-1" />Missed</Badge>;
    
    // Scheduled logic
    const fDate = new Date(date);
    const now = new Date();
    const today = new Date();
    today.setHours(0,0,0,0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (fDate < now) {
      return <Badge variant="outline" className="text-rose-600 border-rose-200 bg-rose-50"><AlertCircle className="h-3 w-3 mr-1" />Overdue</Badge>;
    } else if (fDate >= today && fDate < tomorrow) {
      return <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50"><Clock className="h-3 w-3 mr-1" />Today</Badge>;
    } else {
      return <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50"><CalendarIcon className="h-3 w-3 mr-1" />Upcoming</Badge>;
    }
  };

  return (
    <div className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground bg-muted/50 uppercase border-b border-border/50">
            <tr>
              <th className="px-6 py-4 font-medium">Lead / Property</th>
              <th className="px-6 py-4 font-medium">Follow-up Details</th>
              <th className="px-6 py-4 font-medium">Schedule</th>
              <th className="px-6 py-4 font-medium">Status / Priority</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {followUps.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                  No follow-ups found for the selected filters.
                </td>
              </tr>
            ) : (
              followUps.map((f) => (
                <tr key={f.id} className="hover:bg-muted/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground hover:text-primary transition-colors">
                      <Link href={`/admin/leads/${f.lead_id}`}>{f.leads.full_name}</Link>
                    </div>
                    {f.leads.properties && (
                      <div className="text-xs text-muted-foreground mt-1 line-clamp-1">{f.leads.properties.title}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">{f.reminder_type}</div>
                    {f.comment && <div className="text-xs text-muted-foreground mt-1 line-clamp-1 max-w-[200px]" title={f.comment}>{f.comment}</div>}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-foreground">{format(new Date(f.follow_up_date), "MMM d, yyyy")}</div>
                    <div className="text-xs text-muted-foreground mt-1">{format(new Date(f.follow_up_date), "h:mm a")}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2 items-start">
                      {getStatusDisplay(f.status, f.follow_up_date)}
                      {getPriorityBadge(f.priority)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* Communication Actions */}
                      {f.leads.phone && (
                        <>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:bg-blue-50 hover:text-blue-600" asChild onClick={() => logComm(f.lead_id, "Phone Call Initiated")}>
                            <a href={generateCallLink(f.leads.phone)} target="_blank" rel="noopener noreferrer">
                              <Phone className="h-4 w-4" />
                            </a>
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-500 hover:bg-emerald-50 hover:text-emerald-600" asChild onClick={() => logComm(f.lead_id, "WhatsApp Opened")}>
                            <a href={generateWhatsAppLink(f.leads.phone)} target="_blank" rel="noopener noreferrer">
                              <MessageSquare className="h-4 w-4" />
                            </a>
                          </Button>
                        </>
                      )}
                      
                      {/* State Actions */}
                      {f.status === 'Scheduled' && (
                        <>
                          <div className="w-px h-4 bg-border mx-1"></div>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700" onClick={() => handleStatusUpdate(f.id, f.lead_id, 'Completed')} disabled={isPending} title="Mark Completed">
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground" onClick={() => handleStatusUpdate(f.id, f.lead_id, 'Cancelled')} disabled={isPending} title="Cancel">
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination - omitted for brevity but should use standard pagination component */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-border/50 flex items-center justify-between text-sm text-muted-foreground">
          <div>Page {currentPage} of {totalPages}</div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={currentPage <= 1} asChild>
              <Link href={`?page=${currentPage - 1}`}>Previous</Link>
            </Button>
            <Button variant="outline" size="sm" disabled={currentPage >= totalPages} asChild>
              <Link href={`?page=${currentPage + 1}`}>Next</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
