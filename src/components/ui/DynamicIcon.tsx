import * as LucideIcons from "lucide-react";
import { LucideProps } from "lucide-react";

interface DynamicIconProps extends LucideProps {
  name: string;
}

export function DynamicIcon({ name, ...props }: DynamicIconProps) {
  const IconComponent = (LucideIcons as any)[name];

  if (!IconComponent) {
    const FallbackIcon = LucideIcons.Check;
    return <FallbackIcon {...props} />;
  }

  return <IconComponent {...props} />;
}
