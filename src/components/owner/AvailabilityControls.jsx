import { useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import { adjustAvailability } from '../../services/listingService'
import { formatDate } from '../../utils/format'

const roundButton =
  'rounded-lg border border-taupe p-2 text-ink hover:bg-cream disabled:cursor-not-allowed disabled:opacity-50'
const textButton =
  'rounded-lg border border-taupe px-3 py-1.5 text-xs font-semibold text-ink hover:bg-cream disabled:cursor-not-allowed disabled:opacity-50'

export default function AvailabilityControls({ listing }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const available = listing.availableRooms ?? 0
  const total = listing.totalRooms ?? 0

  async function change(options) {
    setBusy(true)
    setError('')
    try {
      await adjustAvailability(listing.id, options)
    } catch (caught) {
      console.error('Availability update failed:', caught.code ?? caught.message)
      setError('Could not update availability. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <p className="text-sm font-semibold text-ink">Room availability</p>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => change({ delta: -1 })}
          disabled={busy || available <= 0}
          aria-label="One fewer room available"
          className={roundButton}
        >
          <Minus className="h-4 w-4" aria-hidden="true" />
        </button>
        <span role="status" className="min-w-[8rem] text-center text-sm text-charcoal">
          <strong className="text-lg text-ink">{available}</strong> of {total} available
        </span>
        <button
          type="button"
          onClick={() => change({ delta: 1 })}
          disabled={busy || available >= total}
          aria-label="One more room available"
          className={roundButton}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={() => change({ set: 0 })}
          disabled={busy || available === 0}
          className={textButton}
        >
          Mark all occupied
        </button>
        <button
          type="button"
          onClick={() => change({ set: total })}
          disabled={busy || available === total}
          className={textButton}
        >
          Mark all available
        </button>
      </div>
      <p className="mt-2 text-xs text-charcoal/70">
        Last updated {formatDate(listing.availabilityUpdatedAt)}
      </p>
      {error && (
        <p role="alert" className="mt-2 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  )
}