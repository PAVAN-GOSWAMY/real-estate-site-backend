'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AuditService } from '@/modules/auth/services/audit.service'
import { headers } from 'next/headers'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const remember = formData.get('remember') === 'on'

  if (!email || !password) {
    redirect('/login?error=Email and password are required')
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  // If "Remember me" is NOT checked, we want a session cookie.
  // Supabase sets a persistent cookie by default. To make it session-only, 
  // we would typically pass a cookie option in middleware/server client. 
  // For simplicity, we just note that Supabase handles the session natively.
  // Real implementation for short vs long lived cookies usually involves
  // setting maxAge when configuring the createServerClient.
  
  if (data.user) {
    await AuditService.logEvent('LOGIN', data.user.id, 'User logged in successfully')
  }

  revalidatePath('/', 'layout')
  redirect('/admin')
}

export async function logout() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    await AuditService.logEvent('LOGOUT', user.id, 'User logged out')
  }

  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error("Logout failed", error);
    throw new Error("Unable to logout.");
  }

  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function requestPasswordResetAction(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  
  if (!email) return { error: "Email is required" }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/reset-password`,
  })

  if (error) {
    console.error(error);
    // Do not reveal email existence
    return { success: true }
  }

  return { success: true }
}

export async function updatePasswordAction(password: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const { error } = await supabase.auth.updateUser({ password })
  
  if (error) {
    return { error: error.message }
  }

  await AuditService.logEvent('PASSWORD_CHANGED', user.id, 'User reset password')

  return { success: true }
}
