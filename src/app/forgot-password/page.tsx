"use client";

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { requestPasswordResetAction } from '@/lib/auth/actions';

export default function ForgotPasswordPage() {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      setError(null);
      const result = await requestPasswordResetAction(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess(true);
      }
    });
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md rounded-2xl border bg-card text-card-foreground shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="mb-6">
            <Link href="/login" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-4 transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to login
            </Link>
            <h2 className="text-2xl font-bold tracking-tight">Forgot Password?</h2>
            <p className="text-muted-foreground text-sm mt-1">
              {success 
                ? "Check your email for a reset link." 
                : "Enter your email address and we'll send you a link to reset your password."}
            </p>
          </div>
          
          {success ? (
            <div className="bg-emerald-50 text-emerald-600 p-6 rounded-lg border border-emerald-100 flex flex-col items-center justify-center text-center space-y-3">
              <CheckCircle2 className="h-10 w-10 text-emerald-500" />
              <p className="font-medium">
                If an account exists for that email, a password reset link has been sent.
              </p>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-destructive/15 text-destructive text-sm px-4 py-3 rounded-md font-medium border border-destructive/20">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  required 
                  placeholder="admin@example.com" 
                  disabled={isPending}
                  className="h-11"
                />
              </div>

              <Button type="submit" className="w-full h-11 text-base font-medium" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Sending link...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
