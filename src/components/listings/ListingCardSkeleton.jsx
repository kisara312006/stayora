export default function ListingCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="animate-pulse overflow-hidden rounded-2xl border border-taupe bg-surface"
    >
      <div className="h-44 bg-taupe/50" />
      <div className="space-y-3 p-5">
        <div className="h-3 w-1/3 rounded bg-taupe/60" />
        <div className="h-5 w-3/4 rounded bg-taupe/60" />
        <div className="h-4 w-1/2 rounded bg-taupe/60" />
        <div className="h-6 w-1/3 rounded bg-taupe/60" />
        <div className="h-10 rounded-xl bg-taupe/60" />
      </div>
    </div>
  )
}