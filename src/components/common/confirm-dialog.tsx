"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isPending?: boolean;
  destructive?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isPending = false,
  destructive = false,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [mounted, setMounted] = useState(false);

  // Prevent SSR hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Use the native HTML dialog element for built-in accessibility and focus trapping
  useEffect(() => {
    const dialogNode = dialogRef.current;
    if (!dialogNode) return;

    if (isOpen) {
      if (!dialogNode.open) {
        dialogNode.showModal();
        // Prevent body scrolling
        document.body.style.overflow = 'hidden';
      }
    } else {
      if (dialogNode.open) {
        dialogNode.close();
        // Restore body scrolling
        document.body.style.overflow = '';
      }
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key natively, preventing it if isPending is true
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDialogElement>) => {
    if (e.key === "Escape") {
      if (isPending) {
        e.preventDefault();
      } else {
        onClose();
      }
    }
  };

  // Close when clicking the backdrop
  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current && !isPending) {
      onClose();
    }
  };

  if (!mounted) return null;

  const dialogContent = (
    <dialog
      ref={dialogRef}
      onKeyDown={handleKeyDown}
      onClick={handleBackdropClick}
      className="backdrop:bg-background/80 backdrop:backdrop-blur-sm fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 rounded-lg open:animate-in open:fade-in-0 open:zoom-in-95"
    >
      <div className="flex flex-col space-y-2 text-center sm:text-left mb-6">
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{description}</p>
      </div>
      
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onClose} 
          disabled={isPending}
          className="mt-2 sm:mt-0"
        >
          {cancelText}
        </Button>
        <Button 
          type="button" 
          variant={destructive ? "destructive" : "default"} 
          onClick={onConfirm}
          disabled={isPending}
        >
          {isPending ? "Loading..." : confirmText}
        </Button>
      </div>
    </dialog>
  );

  return createPortal(dialogContent, document.body);
}
