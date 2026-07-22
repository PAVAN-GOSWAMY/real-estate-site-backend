"use client";

import { useState, useTransition } from "react";
import { LeadFollowUp } from "@/modules/leads/types";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createLeadFollowUpAction, updateLeadFollowUpStatusAction } from "@/modules/leads/actions/leads.actions";
import { toast } from "sonner";
import { Calendar, CheckCircle2, Clock, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FollowUpsTabProps {
  leadId: string;
  followUps: LeadFollowUp[];
}

export function FollowUpsTab({ leadId, followUps }: FollowUpsTabProps) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState("Call");
  const [comment, setComment] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSchedule = () => {
    if (!date || !time) {
      toast.error("Date and time are required");
      return;
    }

    startTransition(async () => {
      // Combine date and time into ISO string
      const dateTime = new Date(`${date}T${time}:00`).toISOString();
      
      const formData = new FormData();
      formData.append("leadId", leadId);
      formData.append("followUpDate", dateTime);
      formData.append("reminderType", type);
      formData.append("comment", comment);

      const result = await createLeadFollowUpAction(formData);
      if (result.success) {
        toast.success("Follow-up scheduled successfully");
        setDate("");
        setTime("");
        setComment("");
        setType("Call");
      } else {
        toast.error(result.error || "Failed to schedule follow-up");
      }
    });
  };

  const handleStatusUpdate = (id: string, status: string) => {
    startTransition(async () => {
      const result = await updateLeadFollowUpStatusAction(id, leadId, status);
      if (result.success) {
        toast.success(`Follow-up marked as ${status}`);
      } else {
        toast.error(result.error || "Failed to update status");
      }
    });
  };

  const pendingFollowUps = followUps.filter(f => f.status === 'Pending');
  const pastFollowUps = followUps.filter(f => f.status !== 'Pending');

  return (
    <div className="space-y-8">
      {/* Schedule Follow-up */}
      <div className="bg-card border border-border/50 rounded-xl p-6 space-y-4">
        <h3 className="font-semibold text-lg text-foreground">Schedule Follow-up</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} disabled={isPending} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} disabled={isPending} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select value={type} onValueChange={setType} disabled={isPending}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Call">Call</SelectItem>
                <SelectItem value="Email">Email</SelectItem>
                <SelectItem value="Meeting">Meeting</SelectItem>
                <SelectItem value="Site Visit">Site Visit</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="comment">Comment (Optional)</Label>
          <Textarea id="comment" value={comment} onChange={(e) => setComment(e.target.value)} disabled={isPending} />
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSchedule} disabled={isPending || !date || !time}>
            {isPending ? "Scheduling..." : "Schedule Follow-up"}
          </Button>
        </div>
      </div>

      {/* Upcoming / Pending */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg text-foreground border-b border-border/50 pb-2">Upcoming Follow-ups</h3>
        {pendingFollowUps.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground bg-muted/20 rounded-lg border border-border/50 border-dashed">
            No pending follow-ups.
          </div>
        ) : (
          <div className="space-y-3">
            {pendingFollowUps.map(f => (
              <div key={f.id} className="bg-background border border-amber-500/30 border-l-4 border-l-amber-500 rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-amber-500/10 rounded-full text-amber-600 mt-0.5">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground flex items-center gap-2">
                      {f.reminderType}
                      <Badge variant="outline" className="text-xs font-normal">Pending</Badge>
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5" />
                      {format(new Date(f.followUpDate), "EEEE, MMM d, yyyy 'at' h:mm a")}
                    </p>
                    {f.comment && <p className="text-sm text-foreground mt-2 italic">&quot;{f.comment}&quot;</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="outline" size="sm" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50" onClick={() => handleStatusUpdate(f.id, 'Completed')} disabled={isPending}>
                    <CheckCircle2 className="h-4 w-4 mr-1.5" />
                    Complete
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive" onClick={() => handleStatusUpdate(f.id, 'Cancelled')} disabled={isPending}>
                    <XCircle className="h-4 w-4 mr-1.5" />
                    Cancel
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past Follow-ups */}
      {pastFollowUps.length > 0 && (
        <div className="space-y-4 pt-4">
          <h3 className="font-semibold text-lg text-foreground border-b border-border/50 pb-2">Past Follow-ups</h3>
          <div className="space-y-3 opacity-75">
            {pastFollowUps.map(f => (
              <div key={f.id} className={`bg-background border rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${f.status === 'Completed' ? 'border-emerald-500/30 border-l-4 border-l-emerald-500' : 'border-border/50 border-l-4 border-l-muted-foreground'}`}>
                <div>
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    {f.reminderType}
                    <Badge variant="outline" className={`text-xs font-normal ${f.status === 'Completed' ? 'text-emerald-600 border-emerald-200' : 'text-muted-foreground'}`}>
                      {f.status}
                    </Badge>
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5" />
                    {format(new Date(f.followUpDate), "EEEE, MMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
