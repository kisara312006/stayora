import { useLocation } from 'react-router-dom'
import { Plus } from 'lucide-react'
import Container from '../components/ui/Container'
import Button from '../components/ui/Button'
import Alert from '../components/ui/Alert'
import LoadingScreen from '../components/ui/LoadingScreen'
import OwnerListingRow from '../components/owner/OwnerListingRow'
import { useAuth } from '../hooks/useAuth'
import { useOwnerListings } from '../hooks/useOwnerListings'

export default function OwnerDashboard() {
  const { user, profile } = useAuth()
  const location = useLocation()
  const { listings, loading, error } = useOwnerListings(user.uid)
  const notice = location.state?.notice

  const current = listings.filter((listing) => listing.status !== 'archived')
  const archived = listings.filter((listing) => listing.status === 'archived')

  const tiles = [
    {
      label: 'Live',
      value: listings.filter((l) => l.status === 'published' && !l.isPaused).length,
    },
    { label: 'In review', value: listings.filter((l) => l.status === 'pending').length },
    { label: 'Drafts', value: listings.filter((l) => l.status === 'draft').length },
    {
      label: 'Need attention',
      value: listings.filter((l) => ['changesRequested', 'rejected'].includes(l.status)).length,
    },
  ]

  return (
    <Container className="max-w-5xl py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl">Owner dashboard</h1>
          <p className="mt-1 text-charcoal/80">
            Welcome, {profile.displayName}. Manage your listings and room availability.
          </p>
        </div>
        <Button to="/owner/listings/new">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add a listing
        </Button>
      </div>

      {notice && (
        <div className="mt-6">
          <Alert variant={notice.type}>{notice.text}</Alert>
        </div>
      )}

      <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {tiles.map((tile) => (
          <div key={tile.label} className="rounded-2xl border border-taupe bg-surface p-4">
            <dt className="text-sm text-charcoal/70">{tile.label}</dt>
            <dd className="mt-1 text-2xl font-bold text-ink">{loading ? '–' : tile.value}</dd>
          </div>
        ))}
      </dl>

      <section className="mt-10" aria-labelledby="my-listings">
        <h2 id="my-listings" className="text-2xl">
          My listings
        </h2>

        {loading && <LoadingScreen label="Loading your listings…" />}

        {error && (
          <div className="mt-4">
            <Alert variant="error">
              We couldn’t load your listings. Check your connection and refresh. If you
              just deployed indexes, wait a few minutes for them to finish building.
            </Alert>
          </div>
        )}

        {!loading && !error && listings.length === 0 && (
          <div className="mt-4 rounded-2xl border border-taupe bg-surface p-10 text-center">
            <h3 className="text-xl">You haven’t added a listing yet</h3>
            <p className="mt-2 text-charcoal/80">
              Add your first boarding place or hostel. It stays private until it has
              been reviewed and approved.
            </p>
            <Button to="/owner/listings/new" className="mt-5">
              Add your first listing
            </Button>
          </div>
        )}

        {!loading && !error && current.length > 0 && (
          <div className="mt-4 space-y-4">
            {current.map((listing) => (
              <OwnerListingRow key={listing.id} listing={listing} />
            ))}
          </div>
        )}

        {!loading && !error && archived.length > 0 && (
          <details className="mt-8">
            <summary className="cursor-pointer text-lg font-semibold text-ink">
              Archived ({archived.length})
            </summary>
            <div className="mt-4 space-y-4">
              {archived.map((listing) => (
                <OwnerListingRow key={listing.id} listing={listing} />
              ))}
            </div>
          </details>
        )}
      </section>

      <section className="mt-10 rounded-2xl border border-dashed border-taupe p-6 text-charcoal/80">
        <h2 className="text-xl">Reservations</h2>
        <p className="mt-1 text-sm">
          Reservation requests from people who want to view your property will appear
          here once the reservation feature is added.
        </p>
      </section>
    </Container>
  )
}