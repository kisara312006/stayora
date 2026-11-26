// One key per state an owner sees. A published listing is either live or paused.
export function listingStatusKey(listing) {
  if (listing.status === 'published') return listing.isPaused ? 'paused' : 'live'
  return listing.status
}