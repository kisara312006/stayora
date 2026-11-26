import { useCallback, useEffect, useState } from 'react'
import { fetchListing, fetchPublishedListings } from '../services/listingService'

// Loads published listings. "loading" is worked out by comparing which request
// the stored result belongs to, so there is no flicker of old data.
export function usePublishedListings(sortBy = 'newest') {
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState({ key: null, listings: [], error: false })
  const key = `${sortBy}:${attempt}`

  useEffect(() => {
    let cancelled = false
    fetchPublishedListings({ sortBy })
      .then((listings) => {
        if (!cancelled) setResult({ key, listings, error: false })
      })
      .catch((error) => {
        console.error('Could not load listings:', error.code ?? error.message)
        if (!cancelled) setResult({ key, listings: [], error: true })
      })
    return () => {
      cancelled = true
    }
  }, [key, sortBy])

  const retry = useCallback(() => setAttempt((count) => count + 1), [])
  const loading = result.key !== key

  return {
    listings: loading ? [] : result.listings,
    loading,
    error: !loading && result.error,
    retry,
  }
}

export function useListing(id) {
  const [result, setResult] = useState({ id: null, listing: null, error: false })

  useEffect(() => {
    let cancelled = false
    fetchListing(id)
      .then((listing) => {
        if (!cancelled) setResult({ id, listing, error: false })
      })
      .catch((error) => {
        console.error('Could not load listing:', error.code ?? error.message)
        if (!cancelled) setResult({ id, listing: null, error: true })
      })
    return () => {
      cancelled = true
    }
  }, [id])

  const loading = result.id !== id
  return {
    listing: loading ? null : result.listing,
    loading,
    error: !loading && result.error,
    notFound: !loading && !result.error && result.listing === null,
  }
}