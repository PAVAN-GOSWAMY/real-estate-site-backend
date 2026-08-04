"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ScheduleVisitModal } from "./ScheduleVisitModal";

interface ScheduleVisitModalContainerProps {
  propertyId?: string;
  builderId?: string;
  propertyTitle?: string;
}

export function ScheduleVisitModalContainer(props: ScheduleVisitModalContainerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isOpen = searchParams.get("modal") === "schedule-visit";

  const handleClose = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("modal");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <ScheduleVisitModal 
      isOpen={isOpen} 
      onClose={handleClose} 
      {...props} 
    />
  );
}
