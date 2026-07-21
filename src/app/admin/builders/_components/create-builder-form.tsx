"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CreateBuilderInput } from "@/modules/builders/types/builder";
import { createBuilderAction } from "@/modules/builders/actions";
import { BuilderForm } from "./builder-form";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export function CreateBuilderForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = (formData: FormData) => {
    setServerError(null);
    setSuccess(false);

    startTransition(async () => {
      const result = await createBuilderAction(formData);
      
      if (!result.success) {
        setServerError(result.error);
        return;
      }
      
      setSuccess(true);
      
      // Short delay so user can see success message before redirect
      setTimeout(() => {
        router.push("/admin/builders");
      }, 1000);
    });
  };

  return (
    <div className="space-y-6">
      {serverError && (
        <div className="flex items-center gap-3 rounded-md bg-destructive/15 p-4 text-sm text-destructive border border-destructive/20">
          <AlertCircle className="h-4 w-4" />
          <p>{serverError}</p>
        </div>
      )}
      
      {success && (
        <div className="flex items-center gap-3 rounded-md bg-green-500/15 p-4 text-sm text-green-600 border border-green-500/20">
          <CheckCircle2 className="h-4 w-4" />
          <p>Builder created successfully! Redirecting...</p>
        </div>
      )}

      <BuilderForm
        mode="create"
        onSubmit={handleSubmit}
        isPending={isPending || success}
        submitLabel="Create Builder"
      />
    </div>
  );
}
