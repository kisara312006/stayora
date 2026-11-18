import { Loader2 } from 'lucide-react'

export default function LoadingScreen({ label = 'Loading…' }) {
  return (
    <div
      role="status"
      className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-charcoal"
    >
      <Loader2 className="h-8 w-8 animate-spin text-gold" aria-hidden="true" />
      <span className="text-sm">{label}</span>
    </div>
  )
}