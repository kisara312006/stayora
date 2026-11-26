import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BadgeCheck, BedDouble, Building2, Heart, MapPin } from 'lucide-react'
import { formatDate, formatLKR } from '../../utils/format'
import {
  facilityLabel,
  getAvailability,
  propertyTypeLabel,
  roomTypeLabel,
} from '../../utils/listingHelpers'

const availabilityStyles = {
  available: 'bg-navy/10 text-ink',
  limited: 'bg-gold/40 text-ink',
  full: 'bg-taupe text-charcoal',
}

export default function ListingCard({ listing, view = 'grid' }) {
  // For now the heart only changes colour on screen. Phase 7 saves favourites.
  const [saved, setSaved] = useState(false)
  const availability = getAvailability(listing)
  const isList = view === 'list'
  const roomTypesText = (listing.roomTypes ?? []).map(roomTypeLabel).join(' / ')

  return (
    <article
      className={`flex overflow-hidden rounded-2xl border border-taupe bg-surface shadow-sm transition-shadow duration-200 hover:shadow-md ${
        isList ? 'flex-col sm:flex-row' : 'flex-col'
      }`}
    >
      <div
        className={`relative shrink-0 bg-taupe/50 ${
          isList ? 'h-48 sm:h-auto sm:w-64' : 'h-44'
        }`}
      >
        {listing.coverPhoto ? (
          <img
            src={listing.coverPhoto}
            alt={`Photo of ${listing.title}`}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-1 text-ink/50">
            <Building2 className="h-10 w-10" aria-hidden="true" />
            <span className="text-xs">No photo yet</span>
          </div>
        )}

        <span className="absolute left-3 top-3 rounded-full bg-navy px-3 py-1 text-xs font-semibold text-white">
          {listing.isDemo ? 'Demo data' : propertyTypeLabel(listing.propertyType)}
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
            {propertyTypeLabel(listing.propertyType)}
          </span>
          {listing.verified && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gold/30 px-2 py-0.5 text-xs font-semibold text-ink">
              <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
              Verified
            </span>
          )}
        </div>

        <h3 className="mt-2 text-lg leading-snug">{listing.title}</h3>

        <p className="mt-1 flex items-center gap-1 text-sm text-charcoal/80">
          <MapPin className="h-4 w-4 text-gold" aria-hidden="true" />
          {[listing.area, listing.city].filter(Boolean).join(', ')}
        </p>

        <p className="mt-3 text-xl font-bold text-ink">
          {formatLKR(listing.monthlyRent)}
          <span className="text-sm font-medium text-charcoal/70"> / month</span>
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
          {roomTypesText && (
            <span className="inline-flex items-center gap-1 text-charcoal/80">
              <BedDouble className="h-4 w-4 text-gold" aria-hidden="true" />
              {roomTypesText}
            </span>
          )}
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${availabilityStyles[availability.key]}`}
          >
            {availability.label}
          </span>
          {listing.availableRooms > 0 && (
            <span className="text-xs text-charcoal/70">
              {listing.availableRooms} room{listing.availableRooms > 1 ? 's' : ''}{' '}
              available
            </span>
          )}
        </div>

        {(listing.facilities ?? []).length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2">
            {listing.facilities.slice(0, 3).map((id) => (
              <li
                key={id}
                className="rounded-lg bg-cream px-2.5 py-1 text-xs text-charcoal"
              >
                {facilityLabel(id)}
              </li>
            ))}
            {listing.facilities.length > 3 && (
              <li className="px-1 py-1 text-xs text-charcoal/70">
                +{listing.facilities.length - 3} more
              </li>
            )}
          </ul>
        )}

        <p className="mt-3 text-xs text-charcoal/60">
          Availability updated: {formatDate(listing.availabilityUpdatedAt)}
        </p>

        <Link
          to={`/accommodation/${listing.id}`}
          className="mt-4 inline-flex items-center justify-center rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy/90 dark:bg-gold dark:text-navy dark:hover:bg-gold/85"
        >
          View Details
        </Link>
      </div>
    </article>
  )
}