import { listingStatusKey } from '../../utils/ownerStatus'

const styles = {
  draft: { label: 'Draft', classes: 'bg-taupe text-charcoal' },
  pending: { label: 'In review', classes: 'bg-gold/40 text-ink' },
  changesRequested: { label: 'Changes requested', classes: 'bg-gold/40 text-ink' },
  live: { label: 'Live', classes: 'bg-navy/10 text-ink' },
  paused: { label: 'Paused', classes: 'bg-taupe text-charcoal' },
  rejected: { label: 'Rejected', classes: 'bg-taupe text-danger' },
  archived: { label: 'Archived', classes: 'bg-taupe text-charcoal' },
  removed: { label: 'Removed', classes: 'bg-taupe text-danger' },
}

export default function StatusChip({ listing }) {
  const style = styles[listingStatusKey(listing)] ?? styles.draft
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${style.classes}`}
    >
      {style.label}
    </span>
  )
}