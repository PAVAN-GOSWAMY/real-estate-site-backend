"use client";

import React, { useState, useTransition } from "react";
import { LEAD_PRIORITIES } from "@/modules/leads/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, Loader2 } from "lucide-react";
import { createLeadNoteAction } from "@/modules/leads/actions/lead-notes.actions";
import { toast } from "sonner";

interface FollowUpNoteModalProps {
  leadId: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export function FollowUpNoteModal({ leadId, onClose, onSuccess }: FollowUpNoteModalProps) {
  const [isPending, startTransition] = useTransition();
  const [note, setNote] = useState("");
  const [priority, setPriority] = useState<typeof LEAD_PRIORITIES[number]>("Medium");
  const [followUpDate, setFollowUpDate] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (note.trim().length < 10) {
      setError("Note must be at least 10 characters long.");
      return;
    }
    if (note.trim().length > 2000) {
      setError("Note cannot exceed 2000 characters.");
      return;
    }

    startTransition(async () => {
      setError(null);
      const res = await createLeadNoteAction({
        leadId,
        note: note.trim(),
        priority,
        followUpDate: followUpDate ? new Date(followUpDate).toISOString() : null,
      });

      if (res.success) {
        toast.success("Follow-up note added successfully");
        if (onSuccess) onSuccess();
        onClose();
      } else {
        setError(res.error || "Failed to create note.");
      }
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-lg bg-background shadow-xl border overflow-hidden">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold">Add Follow-up Note</h2>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose} disabled={isPending}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-destructive/15 text-destructive text-sm px-4 py-3 rounded-md font-medium">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <Label htmlFor="noteContent">Note <span className="text-destructive">*</span></Label>
            <Textarea
              id="noteContent"
              autoFocus
              placeholder="E.g. Customer requested a call next Monday. Interested in 3 BHK around Sector 150."
              className="min-h-[120px]"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              disabled={isPending}
            />
            <div className="text-xs text-muted-foreground text-right">
              {note.length}/2000
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label>Priority</Label>
              <select
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={priority}
                onChange={(e) => setPriority(e.target.value as typeof LEAD_PRIORITIES[number])}
                disabled={isPending}
              >
                {LEAD_PRIORITIES.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="followUpDate">Follow-up Date (Optional)</Label>
              <Input
                id="followUpDate"
                type="datetime-local"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                disabled={isPending}
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-border/50 pt-6">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Note
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
