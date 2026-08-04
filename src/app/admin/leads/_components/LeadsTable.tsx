"use client";

import { Lead } from "@/modules/leads/types";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ExternalLink, Calendar, Phone, Mail, MessageSquare } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { LEAD_STATUSES } from "@/modules/leads/types";
import { updateLeadStatusAction, logCommunicationAction } from "@/modules/leads/actions/leads.actions";
import { toast } from "sonner";
import { isValidPhone, isValidEmail, generateCallLink, generateWhatsAppLink, generateEmailLink } from "@/modules/leads/utils/communication";

interface LeadsTableProps {
  leads: Lead[];
}

export function LeadsTable({ leads }: LeadsTableProps) {
  const handleStatusChange = async (leadId: string, status: string) => {
    toast.promise(updateLeadStatusAction(leadId, status), {
      loading: "Updating status...",
      success: "Status updated successfully",
      error: "Failed to update status",
    });
  };

  const handleCommunication = async (leadId: string, type: "Phone Call Initiated" | "WhatsApp Opened" | "Email Draft Opened") => {
    try {
      await logCommunicationAction(leadId, type, `Initiated via Leads Table`);
    } catch (e) {
      console.error(e);
    }
  };

  if (leads.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No leads found matching your criteria.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border/50">
          <tr>
            <th className="px-6 py-4 font-medium">Customer</th>
            <th className="px-6 py-4 font-medium">Contact</th>
            <th className="px-6 py-4 font-medium">Interest / Source</th>
            <th className="px-6 py-4 font-medium">Status / Priority</th>
            <th className="px-6 py-4 font-medium">Date</th>
            <th className="px-6 py-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {leads.map((lead) => (
            <tr key={lead.id} className="hover:bg-muted/30 transition-colors group">
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    <Link href={`/admin/leads/${lead.id}`}>
                      {lead.fullName}
                    </Link>
                  </span>
                  {lead.assignedToEmail ? (
                    <span className="text-xs text-muted-foreground mt-1">Assigned: {lead.assignedToEmail.split('@')[0]}</span>
                  ) : (
                    <span className="text-xs text-amber-600 mt-1">Unassigned</span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col gap-1.5 text-muted-foreground text-xs">
                  {lead.phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="h-3 w-3" />
                      <span>{lead.phone}</span>
                    </div>
                  )}
                  {lead.email && (
                    <div className="flex items-center gap-1.5">
                      <Mail className="h-3 w-3" />
                      <span>{lead.email}</span>
                    </div>
                  )}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col gap-1.5 items-start">
                  {lead.propertyName ? (
                    <span className="font-medium text-xs text-foreground truncate max-w-[200px]" title={lead.propertyName}>
                      {lead.propertyName}
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-xs">General Inquiry</span>
                  )}
                  <Badge variant="outline" className="text-[10px] bg-background/50 font-normal">
                    {lead.source}
                  </Badge>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col gap-2 items-start">
                  <StatusBadge status={lead.status} />
                  <Badge 
                    variant="outline" 
                    className={`text-[10px] ${
                      lead.priority === 'High' ? 'text-destructive border-destructive/20 bg-destructive/5' :
                      lead.priority === 'Medium' ? 'text-amber-600 border-amber-500/20 bg-amber-500/5' :
                      'text-muted-foreground'
                    }`}
                  >
                    {lead.priority}
                  </Badge>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3 w-3" />
                    <span>{format(new Date(lead.createdAt), "MMM d, yyyy")}</span>
                  </div>
                  {lead.nextFollowUp && (
                    <span className="text-[10px] text-primary">
                      Next: {format(new Date(lead.nextFollowUp), "MMM d")}
                    </span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:text-amber-500 disabled:opacity-30"
                    disabled={!isValidPhone(lead.phone)}
                    title={!isValidPhone(lead.phone) ? "No valid phone number" : "Call Customer"}
                    asChild={isValidPhone(lead.phone)}
                  >
                    {isValidPhone(lead.phone) ? (
                      <a 
                        href={generateCallLink(lead.phone!)} 
                        onClick={() => handleCommunication(lead.id, "Phone Call Initiated")}
                      >
                        <Phone className="h-4 w-4" />
                      </a>
                    ) : (
                      <Phone className="h-4 w-4" />
                    )}
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:text-emerald-500 disabled:opacity-30"
                    disabled={!isValidPhone(lead.phone)}
                    title={!isValidPhone(lead.phone) ? "No valid phone number" : "WhatsApp Customer"}
                    asChild={isValidPhone(lead.phone)}
                  >
                    {isValidPhone(lead.phone) ? (
                      <a 
                        href={generateWhatsAppLink(lead.phone!, lead.propertyName)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={() => handleCommunication(lead.id, "WhatsApp Opened")}
                      >
                        <MessageSquare className="h-4 w-4" />
                      </a>
                    ) : (
                      <MessageSquare className="h-4 w-4" />
                    )}
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:text-blue-500 disabled:opacity-30"
                    disabled={!isValidEmail(lead.email)}
                    title={!isValidEmail(lead.email) ? "No valid email" : "Email Customer"}
                    asChild={isValidEmail(lead.email)}
                  >
                    {isValidEmail(lead.email) ? (
                      <a 
                        href={generateEmailLink(lead.email!, lead.propertyName)}
                        onClick={() => handleCommunication(lead.id, "Email Draft Opened")}
                      >
                        <Mail className="h-4 w-4" />
                      </a>
                    ) : (
                      <Mail className="h-4 w-4" />
                    )}
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 ml-1">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/leads/${lead.id}`}>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View Workspace
                        </Link>
                      </DropdownMenuItem>
                      
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                          <span>Change Status</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                          <DropdownMenuRadioGroup value={lead.status} onValueChange={(val) => handleStatusChange(lead.id, val)}>
                            {LEAD_STATUSES.map(status => (
                              <DropdownMenuRadioItem key={status} value={status}>
                                {status}
                              </DropdownMenuRadioItem>
                            ))}
                          </DropdownMenuRadioGroup>
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
