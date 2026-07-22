import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type StatusType = string;

interface StatusBadgeProps {
  status: StatusType | boolean;
  label?: string;
  className?: string;
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  // If boolean is passed (e.g., isActive)
  if (typeof status === "boolean") {
    return (
      <Badge 
        variant={status ? "default" : "secondary"}
        className={cn(className)}
      >
        {label || (status ? "Active" : "Inactive")}
      </Badge>
    );
  }

  switch (status) {
    case "active":
    case "success":
    case "won":
    case "Won":
      return (
        <Badge variant="default" className={cn("bg-emerald-600 hover:bg-emerald-700", className)}>
          {label || status}
        </Badge>
      );
    case "inactive":
    case "archived":
    case "Archived":
      return (
        <Badge variant="secondary" className={cn(className)}>
          {label || status}
        </Badge>
      );
    case "pending":
    case "New":
    case "new":
      return (
        <Badge variant="outline" className={cn("text-amber-600 border-amber-200 bg-amber-50", className)}>
          {label || status}
        </Badge>
      );
    case "featured":
    case "Qualified":
    case "qualified":
      return (
        <Badge variant="outline" className={cn("text-blue-600 border-blue-200 bg-blue-50", className)}>
          {label || status}
        </Badge>
      );
    case "destructive":
    case "Lost":
    case "lost":
      return (
        <Badge variant="destructive" className={cn(className)}>
          {label || status}
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className={cn(className)}>
          {label || status}
        </Badge>
      );
  }
}
