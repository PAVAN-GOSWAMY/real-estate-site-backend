'use client'
 
import { useEffect } from 'react'
import { AlertCircle } from 'lucide-react'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])
 
  return (
    <div className="flex min-h-[400px] w-full flex-col items-center justify-center space-y-4 p-8 text-center bg-background/50 rounded-xl border border-border/50">
      <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h2 className="text-xl font-semibold text-foreground">Something went wrong</h2>
      <p className="text-sm text-muted-foreground max-w-md">
        We encountered an unexpected error while loading this section. Please try again.
      </p>
      <button
        className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-md font-medium hover:bg-primary/90 transition-colors mt-4"
        onClick={() => {
          reset()
          window.location.href = '/login'
        }}
      >
        Try again
      </button>
    </div>
  )
}
