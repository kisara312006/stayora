import Container from '../ui/Container'
import SectionHeading from '../ui/SectionHeading'
import Button from '../ui/Button'
import Alert from '../ui/Alert'
import ListingCard from '../listings/ListingCard'
import ListingCardSkeleton from '../listings/ListingCardSkeleton'
import { usePublishedListings } from '../../hooks/useListings'

export default function SuggestedListings() {
  const { listings, loading, error, retry } = usePublishedListings('newest')

  // Featured listings first, then the newest
  const picks = [
    ...listings.filter((listing) => listing.featured),
    ...listings.filter((listing) => !listing.featured),
  ].slice(0, 3)
  const showsDemo = picks.some((listing) => listing.isDemo)

  return (
    <section className="py-16">
      <Container>
        <SectionHeading
          eyebrow="Suggested accommodation"
          title="Places worth a look"
          subtitle="Selected listings approved for public display."
        />

        {showsDemo && (
          <p className="mx-auto mt-6 max-w-2xl rounded-xl border border-gold bg-surface px-4 py-3 text-center text-sm text-charcoal">
            <strong className="text-ink">Development notice:</strong> listings marked
            “Demo data” are sample records, not real properties.
          </p>
        )}

        <div className="mt-10">
          {loading && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((item) => (
                <ListingCardSkeleton key={item} />
              ))}
            </div>
          )}

          {error && (
            <div className="mx-auto max-w-xl space-y-3 text-center">
              <Alert variant="error">We couldn’t load accommodation right now.</Alert>
              <Button variant="outline" onClick={retry}>
                Try again
              </Button>
            </div>
          )}

          {!loading && !error && picks.length === 0 && (
            <p className="text-center text-charcoal/80">
              No accommodation has been published yet. Check back soon.
            </p>
          )}

          {!loading && !error && picks.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {picks.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>

        <div className="mt-10 text-center">
          <Button to="/explore" variant="outline">
            Browse all accommodation
          </Button>
        </div>
      </Container>
    </section>
  )
}