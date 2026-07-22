import Link from 'next/link'
import { FileQuestion, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
 
export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] w-full flex-col items-center justify-center space-y-8 text-center px-4 bg-surface">
      <div className="h-24 w-24 rounded-3xl bg-card border border-border/50 shadow-sm flex items-center justify-center text-muted-foreground/50">
        <FileQuestion className="h-10 w-10 text-primary/40" />
      </div>
      <div className="space-y-4 max-w-md mx-auto">
        <h2 className="font-heading text-4xl font-bold tracking-tight text-foreground">Page Not Found</h2>
        <p className="text-muted-foreground text-lg leading-relaxed">
          We couldn&apos;t find the page or property you&apos;re looking for. It might have been moved, sold, or deleted.
        </p>
      </div>
      <div className="pt-4">
        <Link href="/">
          <Button size="lg" className="rounded-full px-8">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
