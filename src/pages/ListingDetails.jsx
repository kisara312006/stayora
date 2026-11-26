import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  BadgeCheck,
  Building2,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldAlert,
} from 'lucide-react'
import Container from '../components/ui/Container'
import Button from '../components/ui/Button'
import Alert from '../components/ui/Alert'
import LoadingScreen from '../components/ui/LoadingScreen'
import { useListing } from '../hooks/useListings'
import { formatDate, formatLKR } from '../utils/format'
import {
  buildWhatsAppLink,
  facilityLabel,
  getAvailability,
  propertyTypeLabel,
  roomTypeLabel,
} from '../utils/listingHelpers'
import { genderPolicies } from '../config/listingOptions'

const availabilityStyles = {
  available: 'bg-navy/10 text-ink',
  limited: 'bg-gold/40 text-ink',
  full: 'bg-taupe text-charcoal',
}

function Section({ title, children }) {
  return (
    <section className="rounded-2xl border border-taupe bg-surface p-6 shadow-sm">
      <h2 className="text-xl">{title}</h2>
      <div className="mt-3 text-charcoal/90">{children}</div>
    </section>
  )
}

function Gallery({ listing }) {
  const photos = listing.photos ?? []
  const [index, setIndex] = useState(0)

  if (photos.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-2xl border border-taupe bg-taupe/40 text-ink/60 sm:h-80">
        <Building2 className="h-12 w-12" aria-hidden="true" />
        <span className="text-sm">The owner has not added photos yet</span>
      </div>
    )
  }

  return (
    <div>
      <img
        src={photos[index]}
        alt={`${listing.title}, photo ${index + 1} of ${photos.length}`}
        className="h-64 w-full rounded-2xl border border-taupe object-cover sm:h-96"
      />
      {photos.length > 1 && (
        <ul className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {photos.map((url, photoIndex) => (
            <li key={url}>
              <button
                type="button"
                onClick={() => setIndex(photoIndex)}
                aria-label={`Show photo ${photoIndex + 1}`}
                aria-pressed={photoIndex === index}
                className={`overflow-hidden rounded-lg border-2 ${
                  photoIndex === index ? 'border-ink' : 'border-transparent'
                }`}
              >
                <img src={url} alt="" className="h-16 w-24 object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function ListingView({ listing }) {
  const availability = getAvailability(listing)
  const whatsapp = listing.whatsappEnabled ? buildWhatsAppLink(listing.contactPhone) : null
  const phoneIsPublic = listing.showPhonePublicly && listing.contactPhone
  const genderLabel = genderPolicies.find((policy) => policy.id === listing.genderPolicy)?.label

  return (
    <Container className="py-8">
      <Link
        to="/explore"
        className="inline-flex items-center gap-2 text-sm font-medium text-ink hover:underline"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to results
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-navy px-3 py-1 text-xs font-semibold text-white">
          {propertyTypeLabel(listing.propertyType)}
        </span>
        {listing.verified && (
          <span className="inline-flex items-center gap-1 rounded-full bg-gold/30 px-3 py-1 text-xs font-semibold text-ink">
            <BadgeCheck className="h-4 w-4" aria-hidden="true" />
            Verified listing
          </span>
        )}
        {listing.isDemo && (
          <span className="rounded-full bg-gold px-3 py-1 text-xs font-semibold text-navy">
            Demo data
          </span>
        )}
      </div>

      <h1 className="mt-3 text-3xl sm:text-4xl">{listing.title}</h1>
      <p className="mt-2 flex items-center gap-1 text-charcoal/80">
        <MapPin className="h-5 w-5 text-gold" aria-hidden="true" />
        {[listing.publicAddress, listing.area, listing.city].filter(Boolean).join(', ')}
      </p>

      {listing.isDemo && (
        <div className="mt-4">
          <Alert variant="info">
            This is a sample demo record used during development. It is not a real
            property.
          </Alert>
        </div>
      )}

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-6">
          <Gallery listing={listing} />

          <Section title="About this place">
            <p className="whitespace-pre-line">
              {listing.description || 'The owner has not added a description.'}
            </p>
          </Section>

          <Section title="Rooms and facilities">
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-charcoal/70">Room types</dt>
                <dd className="font-medium text-ink">
                  {(listing.roomTypes ?? []).map(roomTypeLabel).join(', ') || 'Not specified'}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-charcoal/70">Total rooms</dt>
                <dd className="font-medium text-ink">{listing.totalRooms ?? 'Not specified'}</dd>
              </div>
              {genderLabel && (
                <div>
                  <dt className="text-sm text-charcoal/70">Who it is open to</dt>
                  <dd className="font-medium text-ink">{genderLabel}</dd>
                </div>
              )}
            </dl>
            {(listing.facilities ?? []).length > 0 ? (
              <ul className="mt-4 flex flex-wrap gap-2">
                {listing.facilities.map((id) => (
                  <li key={id} className="rounded-lg bg-cream px-3 py-1.5 text-sm text-charcoal">
                    {facilityLabel(id)}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm">No facilities listed.</p>
            )}
          </Section>

          {(listing.houseRules ?? []).length > 0 && (
            <Section title="House rules">
              <ul className="list-disc space-y-1 pl-6">
                {listing.houseRules.map((rule) => (
                  <li key={rule}>{rule}</li>
                ))}
              </ul>
            </Section>
          )}

          <Section title="Location">
            <p>
              {[listing.publicAddress, listing.area, listing.city].filter(Boolean).join(', ') ||
                'Location not specified.'}
            </p>
            {(listing.nearUniversities ?? []).length > 0 && (
              <p className="mt-2 text-sm">Near: {listing.nearUniversities.join(', ')}</p>
            )}
            {(listing.nearWorkplaces ?? []).length > 0 && (
              <p className="mt-2 text-sm">Near workplaces: {listing.nearWorkplaces.join(', ')}</p>
            )}
            <p className="mt-3 rounded-xl border border-dashed border-taupe p-4 text-sm text-charcoal/70">
              An interactive map and directions will appear here once Google Maps is
              connected (Phase 7).
            </p>
          </Section>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-taupe bg-surface p-6 shadow-sm">
            <p className="text-3xl font-bold text-ink">
              {formatLKR(listing.monthlyRent)}
              <span className="text-base font-medium text-charcoal/70"> / month</span>
            </p>

            <dl className="mt-4 space-y-2 text-sm">
              {listing.depositAmount > 0 && (
                <div className="flex justify-between gap-3">
                  <dt className="text-charcoal/70">Deposit</dt>
                  <dd className="font-medium text-ink">{formatLKR(listing.depositAmount)}</dd>
                </div>
              )}
              {listing.additionalCharges && (
                <div className="flex justify-between gap-3">
                  <dt className="text-charcoal/70">Extra charges</dt>
                  <dd className="text-right font-medium text-ink">{listing.additionalCharges}</dd>
                </div>
              )}
              <div className="flex justify-between gap-3">
                <dt className="text-charcoal/70">Availability</dt>
                <dd>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${availabilityStyles[availability.key]}`}
                  >
                    {availability.label}
                  </span>
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-charcoal/70">Rooms available</dt>
                <dd className="font-medium text-ink">{listing.availableRooms ?? 0}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-charcoal/70">Available from</dt>
                <dd className="font-medium text-ink">{formatDate(listing.availableFrom)}</dd>
              </div>
            </dl>

            <p className="mt-4 flex items-center gap-2 text-xs text-charcoal/70">
              <Clock className="h-4 w-4" aria-hidden="true" />
              Availability last updated {formatDate(listing.availabilityUpdatedAt)}
            </p>
          </div>

          <div className="rounded-2xl border border-taupe bg-surface p-6 shadow-sm">
            <h2 className="text-lg">Contact</h2>
            <p className="mt-1 text-sm text-charcoal/80">
              Listed by {listing.ownerDisplayName || 'the owner'}
            </p>
            <div className="mt-4 space-y-3 text-sm">
              {phoneIsPublic && (
                <a
                  href={`tel:${listing.contactPhone}`}
                  className="flex items-center gap-2 font-medium text-ink hover:underline"
                >
                  <Phone className="h-4 w-4 text-gold" aria-hidden="true" />
                  {listing.contactPhone}
                </a>
              )}
              {whatsapp && phoneIsPublic && (
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-medium text-ink hover:underline"
                >
                  <MessageCircle className="h-4 w-4 text-gold" aria-hidden="true" />
                  Message on WhatsApp
                </a>
              )}
              {listing.publicContactEmail && (
                <a
                  href={`mailto:${listing.publicContactEmail}`}
                  className="flex items-center gap-2 font-medium text-ink hover:underline"
                >
                  <Mail className="h-4 w-4 text-gold" aria-hidden="true" />
                  {listing.publicContactEmail}
                </a>
              )}
              {!phoneIsPublic && !listing.publicContactEmail && (
                <p className="text-charcoal/80">
                  The owner has not made contact details public. Reservation and
                  enquiry options will be added soon.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-gold bg-surface p-5 text-sm">
            <p className="flex items-center gap-2 font-semibold text-ink">
              <ShieldAlert className="h-5 w-5 text-gold" aria-hidden="true" />
              Stay safe
            </p>
            <p className="mt-2 text-charcoal/90">
              A verification badge does not guarantee that a property or owner is
              risk-free. Visit in person and verify the owner before paying any
              deposit.{' '}
              <Link to="/safety" className="font-semibold text-ink underline">
                Safety guidance
              </Link>
            </p>
          </div>
        </aside>
      </div>
    </Container>
  )
}

export default function ListingDetails() {
  const { id } = useParams()
  const { listing, loading, error, notFound } = useListing(id)

  if (loading) return <LoadingScreen label="Loading listing…" />

  if (error) {
    return (
      <Container className="max-w-xl py-24 text-center">
        <h1 className="text-3xl">We couldn’t load this listing</h1>
        <p className="mt-3 text-charcoal/80">Check your connection and refresh the page.</p>
        <Button to="/explore" className="mt-8">
          Back to Explore
        </Button>
      </Container>
    )
  }

  if (notFound) {
    return (
      <Container className="max-w-xl py-24 text-center">
        <h1 className="text-3xl">Listing not available</h1>
        <p className="mt-3 text-charcoal/80">
          This listing does not exist, or it is no longer available to the public.
        </p>
        <Button to="/explore" className="mt-8">
          Browse accommodation
        </Button>
      </Container>
    )
  }

  // "key" resets the photo gallery when you move to a different listing
  return <ListingView key={listing.id} listing={listing} />
}