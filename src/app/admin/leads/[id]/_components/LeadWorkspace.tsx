"use client";

import { useState } from "react";
import Link from "next/link";
import { Lead, LeadActivity, LeadNote, LeadFollowUp, LeadAttachment } from "@/modules/leads/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Phone, Mail, Calendar, Briefcase, Plus, MessageSquare, Clock, MapPin, CheckCircle, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from "@/components/ui/dropdown-menu";
import { LEAD_STATUSES } from "@/modules/leads/types";
import { updateLeadStatusAction, logCommunicationAction, updateLeadPriorityAction } from "@/modules/leads/actions/leads.actions";
import { toast } from "sonner";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { OverviewTab } from "./tabs/OverviewTab";
import { NotesTab } from "./tabs/NotesTab";
import { ActivityTab } from "./tabs/ActivityTab";
import { FollowUpsTab } from "./tabs/FollowUpsTab";
import { FollowUpNoteModal } from "./FollowUpNoteModal";
import { isValidPhone, isValidEmail, generateCallLink, generateWhatsAppLink, generateEmailLink } from "@/modules/leads/utils/communication";
import { format } from "date-fns";

interface LeadWorkspaceProps {
  lead: Lead;
  activities: LeadActivity[];
  notes: LeadNote[];
  followUps: LeadFollowUp[];
  attachments: LeadAttachment[];
}

export function LeadWorkspace({ lead, activities, notes, followUps, attachments }: LeadWorkspaceProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [showNoteModal, setShowNoteModal] = useState(false);

  const hasUrgentNote = notes.some(n => n.priority === "Urgent" || n.priority === "High");

  const handleCommunication = async (type: "Phone Call Initiated" | "WhatsApp Opened" | "Email Draft Opened") => {
    try {
      await logCommunicationAction(lead.id, type, `Initiated via Lead Workspace`);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header / Breadcrumb */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <Link href="/admin/leads" className="flex items-center hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Leads
        </Link>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Main Content Area */}
        <div className="xl:col-span-3 space-y-6">
          
          {/* Header Card */}
          <div className="bg-card border border-border/50 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center text-primary text-2xl font-bold shrink-0">
                {lead.fullName.charAt(0).toUpperCase()}
              </div>
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-foreground">{lead.fullName}</h1>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  {lead.phone && (
                    <span className="flex items-center"><Phone className="h-3 w-3 mr-1" /> {lead.phone}</span>
                  )}
                  {lead.email && (
                    <span className="flex items-center"><Mail className="h-3 w-3 mr-1" /> {lead.email}</span>
                  )}
                  <span className="flex items-center"><MapPin className="h-3 w-3 mr-1" /> {lead.source}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <div className="flex gap-2 items-center">
                {hasUrgentNote && (
                  <Badge variant="destructive" className="animate-pulse shadow-sm">
                    🔥 Follow-up Pending
                  </Badge>
                )}
                <StatusBadge status={lead.status} />
              </div>
              <Badge variant="outline" className="text-xs">
                Priority: {lead.priority}
              </Badge>
            </div>
          </div>

          {/* Workspace Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="bg-card border border-border/50 rounded-xl overflow-hidden mb-6">
              <div className="overflow-x-auto p-1 border-b border-border/50 bg-muted/20">
                <TabsList className="bg-transparent border-0 h-12 w-full justify-start gap-2">
                  <TabsTrigger value="overview" className="data-[state=active]:bg-background px-4 py-2">Overview</TabsTrigger>
                  <TabsTrigger value="activity" className="data-[state=active]:bg-background px-4 py-2">Activity</TabsTrigger>
                  <TabsTrigger value="notes" className="data-[state=active]:bg-background px-4 py-2">Notes</TabsTrigger>
                  <TabsTrigger value="follow-ups" className="data-[state=active]:bg-background px-4 py-2">Follow-ups</TabsTrigger>
                  {/* <TabsTrigger value="property" className="data-[state=active]:bg-background px-4 py-2">Property</TabsTrigger>
                  <TabsTrigger value="communication" className="data-[state=active]:bg-background px-4 py-2">Communication</TabsTrigger>
                  <TabsTrigger value="attachments" className="data-[state=active]:bg-background px-4 py-2">Attachments</TabsTrigger> */}
                </TabsList>
              </div>

              <div className="p-6">
                <TabsContent value="overview" className="m-0 focus-visible:outline-none">
                  <OverviewTab lead={lead} />
                </TabsContent>
                <TabsContent value="activity" className="m-0 focus-visible:outline-none">
                  <ActivityTab activities={activities} />
                </TabsContent>
                <TabsContent value="notes" className="m-0 focus-visible:outline-none">
                  <NotesTab leadId={lead.id} notes={notes} />
                </TabsContent>
                <TabsContent value="follow-ups" className="m-0 focus-visible:outline-none">
                  <FollowUpsTab leadId={lead.id} followUps={followUps} />
                </TabsContent>
                {/* <TabsContent value="property" className="m-0 focus-visible:outline-none">
                  <div className="text-center py-12 text-muted-foreground">Property Tab (Coming Soon)</div>
                </TabsContent>
                <TabsContent value="communication" className="m-0 focus-visible:outline-none">
                  <div className="text-center py-12 text-muted-foreground">Communication Module (Coming Soon)</div>
                </TabsContent>
                <TabsContent value="attachments" className="m-0 focus-visible:outline-none">
                  <div className="text-center py-12 text-muted-foreground">Attachments Tab (Coming Soon)</div>
                </TabsContent> */}
              </div>
            </div>
          </Tabs>
        </div>

        {/* Right Sidebar */}
        <div className="xl:col-span-1 space-y-6">
          
          {/* Communication Center */}
          <div className="bg-card border border-border/50 rounded-xl p-6">
            <h3 className="font-semibold text-foreground mb-4">Communication</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <span className="text-xs text-muted-foreground block mb-1">Customer Phone</span>
                <span className="font-medium text-sm text-foreground">{lead.phone || "Not provided"}</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block mb-1">Customer Email</span>
                <span className="font-medium text-sm text-foreground">{lead.email || "Not provided"}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start hover:text-amber-500 disabled:opacity-50" 
                disabled={!isValidPhone(lead.phone)}
                title={!isValidPhone(lead.phone) ? "No valid phone number" : "Call Customer"}
                asChild={isValidPhone(lead.phone)}
              >
                {isValidPhone(lead.phone) ? (
                  <a href={generateCallLink(lead.phone!)} onClick={() => handleCommunication("Phone Call Initiated")}>
                    <Phone className="mr-2 h-4 w-4 text-amber-500" />
                    Call
                  </a>
                ) : (
                  <div>
                    <Phone className="mr-2 h-4 w-4" />
                    Call
                  </div>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start hover:text-emerald-500 disabled:opacity-50" 
                disabled={!isValidPhone(lead.phone)}
                title={!isValidPhone(lead.phone) ? "No valid phone number" : "WhatsApp Customer"}
                asChild={isValidPhone(lead.phone)}
              >
                {isValidPhone(lead.phone) ? (
                  <a 
                    href={generateWhatsAppLink(lead.phone!, lead.propertyName)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={() => handleCommunication("WhatsApp Opened")}
                  >
                    <MessageSquare className="mr-2 h-4 w-4 text-emerald-500" />
                    WhatsApp
                  </a>
                ) : (
                  <div>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    WhatsApp
                  </div>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start hover:text-blue-500 disabled:opacity-50" 
                disabled={!isValidEmail(lead.email)}
                title={!isValidEmail(lead.email) ? "No valid email" : "Email Customer"}
                asChild={isValidEmail(lead.email)}
              >
                {isValidEmail(lead.email) ? (
                  <a href={generateEmailLink(lead.email!, lead.propertyName)} onClick={() => handleCommunication("Email Draft Opened")}>
                    <Mail className="mr-2 h-4 w-4 text-blue-500" />
                    Email
                  </a>
                ) : (
                  <div>
                    <Mail className="mr-2 h-4 w-4" />
                    Email
                  </div>
                )}
              </Button>
            </div>
          </div>

          <div className="bg-card border border-border/50 rounded-xl p-6 sticky top-6">
            <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
            
            <div className="space-y-3">
              <Button className="w-full justify-start bg-primary text-primary-foreground hover:bg-primary/90">
                <User className="mr-2 h-4 w-4" />
                Assign User
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-emerald-500" />
                    Change Status
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuRadioGroup 
                    value={lead.status} 
                    onValueChange={(val) => {
                      toast.promise(updateLeadStatusAction(lead.id, val), {
                        loading: "Updating status...",
                        success: "Status updated successfully",
                        error: "Failed to update status",
                      });
                    }}
                  >
                    {LEAD_STATUSES.map(status => (
                      <DropdownMenuRadioItem key={status} value={status}>
                        {status}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-orange-500" />
                    Change Priority
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuRadioGroup 
                    value={lead.priority} 
                    onValueChange={(val) => {
                      toast.promise(updateLeadPriorityAction(lead.id, val), {
                        loading: "Updating priority...",
                        success: "Priority updated successfully",
                        error: "Failed to update priority",
                      });
                    }}
                  >
                    {["Low", "Medium", "High", "Urgent"].map(p => (
                      <DropdownMenuRadioItem key={p} value={p}>{p}</DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setShowNoteModal(true)}
              >
                <FileText className="mr-2 h-4 w-4 text-blue-500" />
                Add Follow-up Note
              </Button>

              <div className="pt-4 border-t border-border/50">
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                  onClick={() => {
                    toast.promise(updateLeadStatusAction(lead.id, "Won"), {
                      loading: "Marking as won...",
                      success: "Congratulations! Lead won.",
                      error: "Failed to update status",
                    });
                  }}
                >
                  <Briefcase className="mr-2 h-4 w-4" />
                  Mark as Won
                </Button>
              </div>
            </div>
            
            {/* Meta summary */}
            <div className="mt-8 space-y-4 pt-6 border-t border-border/50">
              <div className="text-sm">
                <span className="text-muted-foreground block mb-1">Assigned To</span>
                <span className="font-medium text-foreground">{lead.assignedToEmail || "Unassigned"}</span>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground block mb-1">Created</span>
                <span className="font-medium text-foreground">{format(new Date(lead.createdAt), "MMM d, yyyy")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {showNoteModal && (
        <FollowUpNoteModal 
          leadId={lead.id} 
          onClose={() => setShowNoteModal(false)} 
        />
      )}
    </div>
  );
}
