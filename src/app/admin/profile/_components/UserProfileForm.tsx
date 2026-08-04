"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle, Eye, EyeOff } from "lucide-react";
import { updatePasswordAction } from "@/lib/auth/actions";
import { toast } from "sonner";

export function UserProfileForm() {
  const [isPending, startTransition] = useTransition();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Password validation rules
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const passwordsMatch = password === confirmPassword && password.length > 0;
  
  const isValid = hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecial && passwordsMatch;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    startTransition(async () => {
      const result = await updatePasswordAction(password);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Password updated successfully");
        setPassword("");
        setConfirmPassword("");
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-3">
        <div className="space-y-2">
          <Label>New Password</Label>
          <div className="relative">
            <Input 
              type={showPassword ? "text" : "password"} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isPending}
              placeholder="••••••••"
              className="pr-10"
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
          <Label>Confirm Password</Label>
          <Input 
            type={showPassword ? "text" : "password"} 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isPending}
            placeholder="••••••••"
          />
        </div>
      </div>

      <div className="bg-muted/50 rounded-lg p-4 space-y-2 border">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <ValidationItem isValid={hasMinLength} text="At least 8 characters" />
          <ValidationItem isValid={hasUppercase} text="One uppercase letter" />
          <ValidationItem isValid={hasLowercase} text="One lowercase letter" />
          <ValidationItem isValid={hasNumber} text="One number" />
          <ValidationItem isValid={hasSpecial} text="One special character" />
          <ValidationItem isValid={passwordsMatch} text="Passwords match" />
        </div>
      </div>

      <Button type="submit" disabled={isPending || !isValid} className="w-full">
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Updating...
          </>
        ) : (
          "Update Password"
        )}
      </Button>
    </form>
  );
}
