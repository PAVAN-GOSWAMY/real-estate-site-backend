"use client";

import { useState } from "react";
import { format } from "date-fns";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { updateApplicationStatusAction, getResumeUrlAction, deleteApplicationAction } from "@/modules/jobs/actions/jobs.actions";
import { toast } from "sonner";
import { FileText, Loader2, Mail, Phone, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Application {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  cover_letter?: string;
  resume_url: string;
  status: string;
  created_at: string;
  jobs: {
    title: string;
    department: string;
  };
}

interface ApplicationsTableProps {
  applications: Application[];
  total: number;
}

const STATUS_COLORS: Record<string, string> = {
  "New": "bg-blue-100 text-blue-800",
  "Reviewing": "bg-purple-100 text-purple-800",
  "Shortlisted": "bg-orange-100 text-orange-800",
  "Rejected": "bg-red-100 text-red-800",
  "Hired": "bg-green-100 text-green-800"
};

export function ApplicationsTable({ applications, total }: ApplicationsTableProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setLoadingId(id);
    try {
      const res = await updateApplicationStatusAction(id, newStatus);
      if (res.success) {
        toast.success(`Status updated to ${newStatus}`);
      } else {
        toast.error("Failed to update status", { description: res.error });
      }
    } catch (error: any) {
      toast.error("Error", { description: error.message });
    } finally {
      setLoadingId(null);
    }
  };

  const handleViewResume = async (id: string, path: string) => {
    setDownloadingId(id);
    try {
      const res = await getResumeUrlAction(path);
      if (res.success && res.url) {
        window.open(res.url, '_blank');
      } else {
        toast.error("Failed to load resume", { description: res.error });
      }
    } catch (error: any) {
      toast.error("Error", { description: error.message });
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this application? This action cannot be undone.")) return;
    
    setLoadingId(id);
    try {
      const res = await deleteApplicationAction(id);
      if (res.success) {
        toast.success("Application deleted successfully");
      } else {
        toast.error("Failed to delete application", { description: res.error });
      }
    } catch (error: any) {
      toast.error("Error", { description: error.message });
    } finally {
      setLoadingId(null);
    }
  };

  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-border p-12 text-center">
        <h3 className="text-lg font-medium text-foreground">No applications found</h3>
        <p className="text-muted-foreground mt-2">There are no applications matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-4">Applicant</th>
              <th className="px-6 py-4">Position</th>
              <th className="px-6 py-4">Applied Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {applications.map((app) => (
              <tr key={app.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-foreground">{app.first_name} {app.last_name}</div>
                  <div className="text-xs text-muted-foreground flex items-center mt-1">
                    <Mail className="w-3 h-3 mr-1" />
                    {app.email}
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center mt-1">
                    <Phone className="w-3 h-3 mr-1" />
                    {app.phone}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-foreground">{app.jobs?.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">{app.jobs?.department}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                  {format(new Date(app.created_at), "MMM d, yyyy")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {loadingId === app.id && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
                    <Select
                      defaultValue={app.status}
                      onValueChange={(value) => handleStatusChange(app.id, value)}
                      disabled={loadingId === app.id}
                    >
                      <SelectTrigger className="w-[140px] h-8 text-xs font-medium border-0 p-0 hover:bg-transparent focus:ring-0 bg-transparent">
                        <Badge variant="outline" className={`w-full justify-between h-7 border-0 ${STATUS_COLORS[app.status]}`}>
                          <SelectValue />
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(STATUS_COLORS).map((statusKey) => (
                          <SelectItem key={statusKey} value={statusKey}>
                            <div className="flex items-center">
                              <div className={`w-2 h-2 rounded-full mr-2 ${STATUS_COLORS[statusKey].split(' ')[0]}`} />
                              {statusKey}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="h-8"
                      onClick={() => handleViewResume(app.id, app.resume_url)}
                      disabled={downloadingId === app.id}
                    >
                      {downloadingId === app.id ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <FileText className="w-4 h-4 mr-2" />
                      )}
                      View Resume
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => handleDelete(app.id)}
                      disabled={loadingId === app.id}
                      title="Delete Application"
                    >
                      {loadingId === app.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="bg-muted/20 px-6 py-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
        <div>
          Showing <span className="font-medium text-foreground">{applications.length}</span> of <span className="font-medium text-foreground">{total}</span> applications
        </div>
      </div>
    </div>
  );
}
