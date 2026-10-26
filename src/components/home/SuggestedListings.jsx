import Container from '../ui/Container'
import SectionHeading from '../ui/SectionHeading'
import Button from '../ui/Button'
import ListingCard from '../listings/ListingCard'
import { demoListings } from '../../data/demoListings'

export default function SuggestedListings() {
  return (
    <section className="py-16">
      <Container>
        <SectionHeading
          eyebrow="Suggested accommodation"
          title="Places worth a look"
          subtitle="Selected listings approved for public display."
        />

        <p className="mx-auto mt-6 max-w-2xl rounded-xl border border-gold bg-white px-4 py-3 text-center text-sm text-charcoal">
          <strong className="text-navy">Development notice:</strong> the cards below
          are sample demo records, not real properties. Real, approved listings will
          appear here once the database is connected.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {demoListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
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