import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({ message = "Loading...", className }: LoadingStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-12 min-h-[200px] text-muted-foreground", className)}>
      <Loader2 className="w-8 h-8 animate-spin mb-4" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}
