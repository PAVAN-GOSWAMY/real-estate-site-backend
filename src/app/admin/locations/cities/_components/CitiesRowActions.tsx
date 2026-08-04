"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal, Edit, Trash2, ShieldAlert, CheckCircle } from "lucide-react";
import Link from "next/link";
import { deleteCityAction, toggleCityStatusAction } from "@/modules/locations/locations.actions";
import { useRouter } from "next/navigation";

interface CitiesRowActionsProps {
  cityId: string;
  isActive: boolean;
}

export function CitiesRowActions({ cityId, isActive }: CitiesRowActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showStatusAlert, setShowStatusAlert] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleDelete = () => {
    startTransition(async () => {
      setErrorMsg("");
      const result = await deleteCityAction(cityId);
      if (result.success) {
        setShowDeleteAlert(false);
        router.refresh();
      } else {
        setErrorMsg(result.error || "Failed to delete city");
      }
    });
  };

  const handleToggleStatus = () => {
    startTransition(async () => {
      setErrorMsg("");
      const result = await toggleCityStatusAction(cityId, !isActive);
      if (result.success) {
        setShowStatusAlert(false);
        router.refresh();
      } else {
        setErrorMsg(result.error || "Failed to update status");
      }
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem asChild>
            <Link href={`/admin/locations/cities/${cityId}/edit`} className="cursor-pointer">
              <Edit className="mr-2 h-4 w-4" /> Edit
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            className="cursor-pointer"
            onClick={() => setShowStatusAlert(true)}
          >
            {isActive ? (
              <><ShieldAlert className="mr-2 h-4 w-4" /> Deactivate</>
            ) : (
              <><CheckCircle className="mr-2 h-4 w-4" /> Activate</>
            )}
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            className="cursor-pointer text-destructive focus:text-destructive"
            onClick={() => setShowDeleteAlert(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the city.
              If this city is assigned to any properties, the deletion will be blocked.
            </AlertDialogDescription>
            {errorMsg && (
              <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md mt-2">
                {errorMsg}
              </div>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e: React.MouseEvent) => { e.preventDefault(); handleDelete(); }}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending ? "Deleting..." : "Delete City"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showStatusAlert} onOpenChange={setShowStatusAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isActive ? "Deactivate" : "Activate"} City
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isActive 
                ? "This city will no longer be available for selection on new properties."
                : "This city will become available for property assignments."}
            </AlertDialogDescription>
            {errorMsg && (
              <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md mt-2">
                {errorMsg}
              </div>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e: React.MouseEvent) => { e.preventDefault(); handleToggleStatus(); }}
              disabled={isPending}
            >
              {isPending ? "Updating..." : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
