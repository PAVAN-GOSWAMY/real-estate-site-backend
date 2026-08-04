"use client";

import { useState, useTransition } from "react";
import { LeadNote } from "@/modules/leads/types";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { deleteLeadNoteAction } from "@/modules/leads/actions/lead-notes.actions";
import { toast } from "sonner";
import { User, Search, MoreVertical, Calendar, AlertCircle } from "lucide-react";
import { FollowUpNoteModal } from "../FollowUpNoteModal";

interface NotesTabProps {
  leadId: string;
  notes: LeadNote[];
}

export function NotesTab({ leadId, notes }: NotesTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Sort notes newest first (assuming they already are, but just in case)
  const sortedNotes = [...notes].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Filter notes based on search query
  const filteredNotes = sortedNotes.filter(note => 
    note.note.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this note?")) return;

    startTransition(async () => {
      const res = await deleteLeadNoteAction(id, leadId);
      if (res.success) {
        toast.success("Note deleted successfully");
      } else {
        toast.error(res.error || "Failed to delete note");
      }
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Low": return "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
      case "High": return "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800/50";
      case "Urgent": return "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50";
      case "Medium":
      default:
        return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search notes..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          Add Note
        </Button>
      </div>

      {/* Notes Timeline */}
      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border/50 before:to-transparent pt-4">
        {filteredNotes.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground relative z-10 bg-card rounded-lg border border-border/50 border-dashed">
            {searchQuery ? "No notes found matching your search." : "No follow-up notes recorded yet."}
          </div>
        ) : (
          <div className="space-y-8 relative z-10">
            {filteredNotes.map((note) => (
              <div key={note.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                {/* Timeline Icon */}
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-primary/10 text-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <User className="h-4 w-4" />
                </div>
                
                {/* Note Card */}
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-card border border-border/50 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-foreground text-sm">
                          {note.userId.includes('@') ? note.userId.split('@')[0] : "Admin User"}
                        </span>
                        <Badge variant="outline" className={`text-[10px] uppercase font-bold tracking-wider ${getPriorityColor(note.priority)}`}>
                          {note.priority}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(note.createdAt), "MMM d, yyyy 'at' h:mm a")}
                      </div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-muted-foreground hover:text-foreground">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {/* <DropdownMenuItem disabled>Edit Note (Coming Soon)</DropdownMenuItem> */}
                        <DropdownMenuItem 
                          className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                          onClick={() => handleDelete(note.id)}
                          disabled={isPending}
                        >
                          Delete Note
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                    {note.note}
                  </div>
                  
                  {note.followUpDate && (
                    <div className="mt-4 pt-3 border-t border-border/50 flex items-center text-xs font-medium text-emerald-600 dark:text-emerald-500">
                      <Calendar className="mr-1.5 h-3.5 w-3.5" />
                      Follow-up scheduled for: {format(new Date(note.followUpDate), "MMM d, yyyy h:mm a")}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showCreateModal && (
        <FollowUpNoteModal 
          leadId={leadId} 
          onClose={() => setShowCreateModal(false)} 
        />
      )}
    </div>
  );
}
