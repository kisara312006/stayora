import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, MapPin, Building2, BadgeCheck, BedDouble } from 'lucide-react'
import { formatLKR } from '../../utils/format'

const availabilityStyles = {
  available: { label: 'Available', classes: 'bg-navy/10 text-navy' },
  limited: { label: 'Few rooms left', classes: 'bg-gold/40 text-navy' },
  occupied: { label: 'Currently full', classes: 'bg-taupe text-charcoal' },
}

export default function ListingCard({ listing }) {
  // For now the heart only changes colour on screen. In Phase 6 it will
  // save the property to the user's favourites in Firestore.
  const [saved, setSaved] = useState(false)
  const status = availabilityStyles[listing.availability]

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-taupe bg-white shadow-sm transition-shadow duration-200 hover:shadow-md">
      {/* Photo area: real photos arrive in Phase 5 */}
      <div className="relative flex h-44 flex-col items-center justify-center gap-1 bg-taupe/50 text-navy/50">
        <Building2 className="h-10 w-10" aria-hidden="true" />
        <span className="text-xs">Photo coming soon</span>

        <span className="absolute left-3 top-3 rounded-full bg-navy px-3 py-1 text-xs font-semibold text-white">
          {listing.isDemo ? 'Demo data' : listing.category}
        </span>

        <button
          type="button"
          onClick={() => setSaved(!saved)}
          aria-pressed={saved}
          aria-label={saved ? 'Remove from favourites' : 'Save to favourites'}
          className="absolute right-3 top-3 rounded-full bg-white p-2 text-navy shadow transition-colors hover:bg-cream"
        >
          <Heart
            className={`h-5 w-5 ${saved ? 'fill-gold text-gold' : ''}`}
            aria-hidden="true"
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-charcoal/70">
            {listing.category}
          </span>
          {listing.verified && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gold/30 px-2 py-0.5 text-xs font-semibold text-navy">
              <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
              Verified
            </span>
          )}
        </div>

        <h3 className="mt-2 text-lg leading-snug">{listing.title}</h3>

        <p className="mt-1 flex items-center gap-1 text-sm text-charcoal/80">
          <MapPin className="h-4 w-4 text-gold" aria-hidden="true" />
          {listing.area}, {listing.city}
        </p>

        <p className="mt-3 text-xl font-bold text-navy">
          {formatLKR(listing.price)}
          <span className="text-sm font-medium text-charcoal/70"> / month</span>
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
          <span className="inline-flex items-center gap-1 text-charcoal/80">
            <BedDouble className="h-4 w-4 text-gold" aria-hidden="true" />
            {listing.roomType}
          </span>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${status.classes}`}
          >
            {status.label}
          </span>
          {listing.availableRooms > 0 && (
            <span className="text-xs text-charcoal/70">
              {listing.availableRooms} room
              {listing.availableRooms > 1 ? 's' : ''} available
            </span>
          )}
        </div>

        <ul className="mt-3 flex flex-wrap gap-2">
          {listing.facilities.slice(0, 3).map((item) => (
            <li
              key={item}
              className="rounded-lg bg-cream px-2.5 py-1 text-xs text-charcoal"
            >
              {item}
            </li>
          ))}
        </ul>

        <p className="mt-3 text-xs text-charcoal/60">
          Last updated: {listing.lastUpdated}
        </p>

        <Link
          to={`/accommodation/${listing.id}`}
          className="mt-4 inline-flex items-center justify-center rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy/90"
        >
          View Details
        </Link>
      </div>
    </article>
  )
}