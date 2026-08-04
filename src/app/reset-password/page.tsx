"use client";

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Eye, EyeOff, CheckCircle2, XCircle } from 'lucide-react';
import { updatePasswordAction } from '@/lib/auth/actions';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password validation rules
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const passwordsMatch = password === confirmPassword && password.length > 0;
  
  const isValid = hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecial && passwordsMatch;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValid) return;

    startTransition(async () => {
      setError(null);
      const result = await updatePasswordAction(password);
      if (result?.error) {
        setError(result.error);
      } else {
        toast.success("Password updated successfully!");
        router.push('/login');
      }
    });
  };

  const ValidationItem = ({ isValid, text }: { isValid: boolean, text: string }) => (
    <div className={`flex items-center space-x-2 text-sm ${isValid ? 'text-emerald-600' : 'text-muted-foreground'}`}>
      {isValid ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4 opacity-50" />}
      <span>{text}</span>
    </div>
  );

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-muted/40 p-4 py-12">
      <div className="w-full max-w-md rounded-2xl border bg-card text-card-foreground shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight">Reset Password</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Please enter your new password below.
            </p>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-destructive/15 text-destructive text-sm px-4 py-3 rounded-md font-medium border border-destructive/20">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isPending}
                    className="h-11 pr-10"
                    placeholder="••••••••"
                  />
                  <button 
                    type="button" 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input 
                  id="confirmPassword" 
                  type={showPassword ? "text" : "password"} 
                  required 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isPending}
                  className="h-11"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 space-y-2 border">
              <p className="text-sm font-medium mb-2">Password must contain:</p>
              <div className="grid grid-cols-2 gap-2">
                <ValidationItem isValid={hasMinLength} text="At least 8 characters" />
                <ValidationItem isValid={hasUppercase} text="One uppercase letter" />
                <ValidationItem isValid={hasLowercase} text="One lowercase letter" />
                <ValidationItem isValid={hasNumber} text="One number" />
                <ValidationItem isValid={hasSpecial} text="One special character" />
                <ValidationItem isValid={passwordsMatch} text="Passwords match" />
              </div>
            </div>

            <Button type="submit" className="w-full h-11 text-base font-medium" disabled={isPending || !isValid}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Updating...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
