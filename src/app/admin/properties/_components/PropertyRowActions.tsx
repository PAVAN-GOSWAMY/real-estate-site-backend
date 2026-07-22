"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Edit, Power, PowerOff, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { togglePropertyStatusAction, deletePropertyAction } from "@/modules/properties/actions";
import { PropertyStatus } from "@/modules/properties/types/enums";
import Link from "next/link";

interface PropertyRowActionsProps {
  propertyId: string;
  status: PropertyStatus;
}

export function PropertyRowActions({ propertyId, status }: PropertyRowActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const isActive = status === PropertyStatus.ACTIVE;
  const isInactive = status === PropertyStatus.INACTIVE;

  const handleStatusToggle = () => {
    const newStatus = isActive ? PropertyStatus.INACTIVE : PropertyStatus.ACTIVE;
    
    startTransition(async () => {
      try {
        const result = await togglePropertyStatusAction(propertyId, newStatus);
        
        if (result.success) {
          showToast(`Property is now ${newStatus.toLowerCase()}.`);
        } else {
          alert(`Error: ${result.error}`);
        }
      } catch (error) {
        alert("An unexpected error occurred.");
      } finally {
        setShowStatusDialog(false);
      }
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" disabled={isPending}>
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          
          <DropdownMenuItem asChild>
            <Link href={`/admin/properties/${propertyId}`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Property
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          {(isActive || isInactive) && (
            <DropdownMenuItem 
              onClick={() => setShowStatusDialog(true)}
              className={isActive ? "text-destructive focus:text-destructive" : "text-primary focus:text-primary"}
            >
              {isActive ? (
                <>
                  <PowerOff className="mr-2 h-4 w-4" />
                  Deactivate
                </>
              ) : (
                <>
                  <Power className="mr-2 h-4 w-4" />
                  Activate
                </>
              )}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        isOpen={showStatusDialog}
        onClose={() => setShowStatusDialog(false)}
        onConfirm={handleStatusToggle}
        title={isActive ? "Deactivate Property" : "Activate Property"}
        description={
          isActive
            ? "Are you sure you want to deactivate this property? It will not be visible on the public site."
            : "Are you sure you want to activate this property? It will be visible on the public site."
        }
        confirmText={isActive ? "Deactivate" : "Activate"}
        destructive={isActive}
        isPending={isPending}
      />

      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 rounded-md bg-zinc-900 px-4 py-3 text-sm font-medium text-white shadow-lg transition-all animate-in fade-in slide-in-from-bottom-4">
          {toastMessage}
        </div>
      )}
    </>
  );
}
