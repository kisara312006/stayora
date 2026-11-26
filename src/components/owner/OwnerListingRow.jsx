import { useState } from 'react'
import { Building2, MapPin } from 'lucide-react'
import Button from '../ui/Button'
import ConfirmDialog from '../ui/ConfirmDialog'
import StatusChip from './StatusChip'
import AvailabilityControls from './AvailabilityControls'
import { formatLKR } from '../../utils/format'
import { propertyTypeLabel } from '../../utils/listingHelpers'
import { listingStatusKey } from '../../utils/ownerStatus'
import { setListingPaused, setListingStatus } from '../../services/listingService'

const statusNotes = {
  draft: 'Only you can see this. Submit it for review when it is ready.',
  pending: 'Waiting for review. It is not public yet.',
  changesRequested: 'The reviewer asked for changes. Edit the listing and submit it again.',
  live: 'Visible to everyone in search results.',
  paused: 'Hidden from search until you resume it.',
  rejected: 'This listing was not approved. You can edit it and submit it again.',
  archived: 'Hidden and kept for your records. Restore it to edit it again.',
  removed: 'This listing was removed by an administrator.',
}

export default function OwnerListingRow({ listing }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [confirmArchive, setConfirmArchive] = useState(false)

  const key = listingStatusKey(listing)
  const isPublished = listing.status === 'published'
  const canEdit = listing.status !== 'archived' && listing.status !== 'removed'
  const showNote = listing.moderationNote && ['rejected', 'changesRequested'].includes(key)

  async function run(action) {
    setBusy(true)
    setError('')
    try {
      await action()
    } catch (caught) {
      console.error('Listing action failed:', caught.code ?? caught.message)
      setError('That did not work. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  async function handleArchive() {
    await run(() => setListingStatus(listing.id, 'archived'))
    setConfirmArchive(false)
  }

  return (
    <article className="rounded-2xl border border-taupe bg-surface p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="h-32 w-full shrink-0 overflow-hidden rounded-xl bg-taupe/50 sm:h-28 sm:w-40">
          {listing.coverPhoto ? (
            <img src={listing.coverPhoto} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-ink/50">
              <Building2 className="h-8 w-8" aria-hidden="true" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <StatusChip listing={listing} />
            <span className="text-xs font-semibold uppercase tracking-wide text-charcoal/70">
              {propertyTypeLabel(listing.propertyType)}
            </span>
          </div>
          <h3 className="mt-2 text-lg leading-snug">{listing.title}</h3>
          <p className="mt-1 flex items-center gap-1 text-sm text-charcoal/80">
            <MapPin className="h-4 w-4 text-gold" aria-hidden="true" />
            {[listing.area, listing.city].filter(Boolean).join(', ')}
          </p>
          <p className="mt-1 font-bold text-ink">
            {formatLKR(listing.monthlyRent)}
            <span className="text-sm font-medium text-charcoal/70"> / month</span>
          </p>
          <p className="mt-2 text-sm text-charcoal/80">{statusNotes[key]}</p>
          {showNote && (
            <p className="mt-2 rounded-lg border border-gold bg-cream/60 p-3 text-sm text-charcoal">
              <strong className="text-ink">Reviewer note:</strong> {listing.moderationNote}
            </p>
          )}
        </div>
      </div>

      {isPublished && (
        <div className="mt-4 border-t border-taupe pt-4">
          <AvailabilityControls listing={listing} />
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {canEdit && (
          <Button to={`/owner/listings/${listing.id}/edit`} variant="outline">
            {isPublished ? 'Edit (needs re-approval)' : 'Edit'}
          </Button>
        )}
        {listing.status !== 'removed' && (
          <Button to={`/accommodation/${listing.id}`} variant="outline">
            {isPublished && !listing.isPaused ? 'View public page' : 'Preview page'}
          </Button>
        )}
        {isPublished && (
          <Button
            variant="outline"
            disabled={busy}
            onClick={() => run(() => setListingPaused(listing.id, !listing.isPaused))}
          >
            {listing.isPaused ? 'Resume listing' : 'Pause listing'}
          </Button>
        )}
        {canEdit && (
          <Button variant="outline" disabled={busy} onClick={() => setConfirmArchive(true)}>
            Archive
          </Button>
        )}
        {listing.status === 'archived' && (
          <Button
            variant="outline"
            disabled={busy}
            onClick={() => run(() => setListingStatus(listing.id, 'draft'))}
          >
            Restore as draft
          </Button>
        )}
      </div>

      {error && (
        <p role="alert" className="mt-3 text-sm text-danger">
          {error}
        </p>
      )}

      <ConfirmDialog
        open={confirmArchive}
        title="Archive this listing?"
        confirmLabel="Archive listing"
        busy={busy}
        onConfirm={handleArchive}
        onCancel={() => setConfirmArchive(false)}
      >
        <p>
          “{listing.title}” will be hidden from everyone
          {isPublished ? ' straight away' : ''} and kept in your archive. It is not
          deleted, and you can restore it as a draft later.
        </p>
      </ConfirmDialog>
    </article>
  )
}