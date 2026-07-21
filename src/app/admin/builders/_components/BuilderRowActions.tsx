"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MoreHorizontal, Eye, Edit, Ban, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deactivateBuilderAction, activateBuilderAction } from "@/modules/builders/actions";
import { ConfirmDialog } from "@/components/common/confirm-dialog";

interface BuilderRowActionsProps {
  builderId: string;
  isActive: boolean;
}

export function BuilderRowActions({ builderId, isActive }: BuilderRowActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [dialogConfig, setDialogConfig] = useState<{ isOpen: boolean; action: "activate" | "deactivate" | null }>({
    isOpen: false,
    action: null,
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleConfirm = () => {
    startTransition(async () => {
      if (dialogConfig.action === "deactivate") {
        const result = await deactivateBuilderAction(builderId);
        if (!result.success) {
          alert(`Error: ${result.error}`);
        } else {
          showToast("Builder deactivated successfully.");
        }
      } else if (dialogConfig.action === "activate") {
        const result = await activateBuilderAction(builderId);
        if (!result.success) {
          alert(`Error: ${result.error}`);
        } else {
          showToast("Builder activated successfully.");
        }
      }
      setDialogConfig({ isOpen: false, action: null });
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" disabled={isPending} data-testid="row-actions-trigger">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={`/admin/builders/${builderId}`} className="cursor-pointer">
              <Eye className="mr-2 h-4 w-4" />
              View
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/admin/builders/${builderId}/edit`} className="cursor-pointer" data-testid="action-edit">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          {isActive ? (
            <DropdownMenuItem 
              onClick={() => setDialogConfig({ isOpen: true, action: "deactivate" })} 
              className="text-destructive focus:bg-destructive/10 cursor-pointer"
              data-testid="action-deactivate"
            >
              <Ban className="mr-2 h-4 w-4" />
              Deactivate
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem 
              onClick={() => setDialogConfig({ isOpen: true, action: "activate" })} 
              className="text-green-600 focus:bg-green-600/10 cursor-pointer"
              data-testid="action-activate"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Activate
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        isOpen={dialogConfig.isOpen}
        onClose={() => setDialogConfig({ isOpen: false, action: null })}
        onConfirm={handleConfirm}
        title={dialogConfig.action === "activate" ? "Activate Builder" : "Deactivate Builder"}
        description={
          dialogConfig.action === "activate" 
            ? "Are you sure you want to activate this builder?"
            : "Are you sure you want to deactivate this builder?"
        }
        confirmText={dialogConfig.action === "activate" ? "Activate" : "Deactivate"}
        destructive={dialogConfig.action === "deactivate"}
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
