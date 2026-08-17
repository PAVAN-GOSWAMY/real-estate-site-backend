import { LucideProps } from "lucide-react";
import { getAmenityIcon } from "@/lib/icons/amenity-icons";

interface DynamicIconProps extends LucideProps {
  name: string;
}

export function DynamicIcon({ name, ...props }: DynamicIconProps) {
  const IconComponent = getAmenityIcon(name);
  return <IconComponent {...props} />;
}
