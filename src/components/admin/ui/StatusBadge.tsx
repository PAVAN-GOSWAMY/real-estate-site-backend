import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type StatusType = "active" | "inactive" | "pending" | "featured" | "archived" | "success" | "destructive" | "default" | "secondary" | "outline";

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
      return (
        <Badge variant="default" className={cn("bg-emerald-600 hover:bg-emerald-700", className)}>
          {label || "Active"}
        </Badge>
      );
    case "inactive":
    case "archived":
      return (
        <Badge variant="secondary" className={cn(className)}>
          {label || "Inactive"}
        </Badge>
      );
    case "pending":
      return (
        <Badge variant="outline" className={cn("text-amber-600 border-amber-200 bg-amber-50", className)}>
          {label || "Pending"}
        </Badge>
      );
    case "featured":
      return (
        <Badge variant="outline" className={cn("text-blue-600 border-blue-200 bg-blue-50", className)}>
          {label || "Featured"}
        </Badge>
      );
    case "destructive":
      return (
        <Badge variant="destructive" className={cn(className)}>
          {label || "Error"}
        </Badge>
      );
    default:
      return (
        <Badge variant={status as "default" | "secondary" | "destructive" | "outline"} className={cn(className)}>
          {label || status}
        </Badge>
      );
  }
}
