"use client";

import { useState, useTransition } from "react";
import { LeadNote } from "@/modules/leads/types";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createLeadNoteAction } from "@/modules/leads/actions/leads.actions";
import { toast } from "sonner";
import { FileText, User } from "lucide-react";

interface NotesTabProps {
  leadId: string;
  notes: LeadNote[];
}

export function NotesTab({ leadId, notes }: NotesTabProps) {
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleAddNote = () => {
    if (!content.trim()) return;

    startTransition(async () => {
      const formData = new FormData();
      formData.append("leadId", leadId);
      formData.append("content", content);

      const result = await createLeadNoteAction(formData);
      if (result.success) {
        toast.success("Note added successfully");
        setContent("");
      } else {
        toast.error(result.error || "Failed to add note");
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Add Note Section */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg text-foreground">Add Note</h3>
        <Textarea 
          placeholder="Write your note here..." 
          className="min-h-[120px] bg-background/50"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isPending}
        />
        <div className="flex justify-end">
          <Button onClick={handleAddNote} disabled={isPending || !content.trim()}>
            {isPending ? "Adding..." : "Add Note"}
          </Button>
        </div>
      </div>

      {/* Notes List */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg text-foreground border-b border-border/50 pb-2">Previous Notes</h3>
        
        {notes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-lg border border-border/50 border-dashed">
            No notes added yet.
          </div>
        ) : (
          <div className="space-y-4">
            {notes.map((note) => (
              <div key={note.id} className="bg-card border border-border/50 rounded-lg p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span className="font-medium text-foreground">{note.createdByEmail.split('@')[0]}</span>
                    <span>added a note</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(note.createdAt), "MMM d, yyyy 'at' h:mm a")}
                  </span>
                </div>
                <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                  {note.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
