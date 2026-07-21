"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Ban } from "lucide-react";
import { deactivateBuilderAction } from "@/modules/builders/actions";
import { ConfirmDialog } from "@/components/common/confirm-dialog";

interface DeactivateButtonProps {
  builderId: string;
}

export function DeactivateButton({ builderId }: DeactivateButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleDeactivate = () => {
    startTransition(async () => {
      const result = await deactivateBuilderAction(builderId);
      if (!result.success) {
        alert(`Error: ${result.error}`);
        setIsOpen(false);
      } else {
        setIsOpen(false);
        router.refresh();
      }
    });
  };

  return (
    <>
      <Button 
        variant="destructive" 
        onClick={() => setIsOpen(true)} 
        disabled={isPending}
        data-testid="deactivate-button"
      >
        <Ban className="mr-2 h-4 w-4" />
        {isPending ? "Deactivating..." : "Deactivate Builder"}
      </Button>

      <ConfirmDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleDeactivate}
        title="Deactivate Builder"
        description="This builder will become inactive and will no longer appear in active listings.\n\nThis action can be reversed later."
        confirmText="Deactivate"
        destructive={true}
        isPending={isPending}
      />
    </>
  );
}
