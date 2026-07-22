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
import { updateLeadStatusAction } from "@/modules/leads/actions/leads.actions";
import { toast } from "sonner";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { OverviewTab } from "./tabs/OverviewTab";
import { NotesTab } from "./tabs/NotesTab";
import { ActivityTab } from "./tabs/ActivityTab";
import { FollowUpsTab } from "./tabs/FollowUpsTab";

interface LeadWorkspaceProps {
  lead: Lead;
  activities: LeadActivity[];
  notes: LeadNote[];
  followUps: LeadFollowUp[];
  attachments: LeadAttachment[];
}

export function LeadWorkspace({ lead, activities, notes, followUps, attachments }: LeadWorkspaceProps) {
  const [activeTab, setActiveTab] = useState("overview");

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
              <StatusBadge status={lead.status} />
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
                  <TabsTrigger value="property" className="data-[state=active]:bg-background px-4 py-2">Property</TabsTrigger>
                  <TabsTrigger value="communication" className="data-[state=active]:bg-background px-4 py-2">Communication</TabsTrigger>
                  <TabsTrigger value="attachments" className="data-[state=active]:bg-background px-4 py-2">Attachments</TabsTrigger>
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
                <TabsContent value="property" className="m-0 focus-visible:outline-none">
                  <div className="text-center py-12 text-muted-foreground">Property Tab (Coming Soon)</div>
                </TabsContent>
                <TabsContent value="communication" className="m-0 focus-visible:outline-none">
                  <div className="text-center py-12 text-muted-foreground">Communication Module (Coming Soon)</div>
                </TabsContent>
                <TabsContent value="attachments" className="m-0 focus-visible:outline-none">
                  <div className="text-center py-12 text-muted-foreground">Attachments Tab (Coming Soon)</div>
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </div>

        {/* Right Sidebar - Quick Actions */}
        <div className="xl:col-span-1 space-y-6">
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

              {lead.phone && (
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href={`tel:${lead.phone.replace(/[^0-9+]/g, '')}`}>
                    <Phone className="mr-2 h-4 w-4 text-amber-500" />
                    Call Customer
                  </a>
                </Button>
              )}
              {lead.email && (
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href={`mailto:${lead.email}`}>
                    <Mail className="mr-2 h-4 w-4 text-blue-500" />
                    Email Customer
                  </a>
                </Button>
              )}
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
                <span className="font-medium text-foreground">{new Date(lead.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
