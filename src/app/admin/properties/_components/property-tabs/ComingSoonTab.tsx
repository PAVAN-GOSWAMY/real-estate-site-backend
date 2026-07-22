import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Hammer } from "lucide-react";

interface ComingSoonTabProps {
  title: string;
  description: string;
}

export function ComingSoonTab({ title, description }: ComingSoonTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground border-t">
        <Hammer className="h-12 w-12 mb-4 opacity-20" />
        <h3 className="text-lg font-medium text-foreground">Coming Soon</h3>
        <p className="text-sm mt-1 max-w-sm">
          This section is currently under construction and will be available in a future update.
        </p>
      </CardContent>
    </Card>
  );
}
