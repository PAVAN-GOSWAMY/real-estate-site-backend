"use client";

import { useState, Suspense } from 'react';
import { login } from '@/lib/auth/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Checkbox } from '@/components/ui/checkbox';

function LoginForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  
  const [isPending, setIsPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // Let the native form submission proceed, but just show loading state
    setIsPending(true);
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md rounded-2xl border bg-card text-card-foreground shadow-lg overflow-hidden">
        <div className="bg-primary p-6 text-primary-foreground text-center">
          <h2 className="text-2xl font-bold tracking-tight">Admin Portal</h2>
          <p className="text-primary-foreground/80 text-sm mt-1">
            Welcome back. Please sign in to your account.
          </p>
        </div>
        
        <div className="p-8">
          <form className="space-y-5" action={login} onSubmit={handleSubmit}>
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
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-xs text-primary hover:underline font-medium">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input 
                  id="password" 
                  name="password" 
                  type={showPassword ? "text" : "password"} 
                  required 
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
            
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" name="remember" value="on" />
              <label
                htmlFor="remember"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember me for 30 days
              </label>
            </div>

            <Button type="submit" className="w-full h-11 text-base font-medium" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex h-screen w-full items-center justify-center bg-muted/40 p-4"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
