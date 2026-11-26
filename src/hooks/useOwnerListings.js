import { useEffect, useState } from 'react'
import { fetchOwnListing, subscribeOwnerListings } from '../services/listingService'

// All of the owner's listings, kept up to date live.
export function useOwnerListings(uid) {
  const [result, setResult] = useState({ uid: null, listings: [], error: false })

  useEffect(() => {
    if (!uid) return undefined
    return subscribeOwnerListings(
      uid,
      (listings) => setResult({ uid, listings, error: false }),
      (error) => {
        console.error('Could not load your listings:', error.code)
        setResult({ uid, listings: [], error: true })
      },
    )
  }, [uid])

  const loading = Boolean(uid) && result.uid !== uid
  return {
    listings: loading ? [] : result.listings,
    loading,
    error: !loading && result.error,
  }
}

// One listing for the edit page. "notFound" also covers listings owned by someone else.
export function useOwnListing(id, uid) {
  const key = `${id}:${uid}`
  const [result, setResult] = useState({ key: null, listing: null, error: false })

  useEffect(() => {
    let cancelled = false
    fetchOwnListing(id, uid)
      .then((listing) => {
        if (!cancelled) setResult({ key, listing, error: false })
      })
      .catch((error) => {
        console.error('Could not load the listing:', error.code ?? error.message)
        if (!cancelled) setResult({ key, listing: null, error: true })
      })
    return () => {
      cancelled = true
    }
  }, [id, uid, key])

  const loading = result.key !== key
  return {
    listing: loading ? null : result.listing,
    loading,
    error: !loading && result.error,
    notFound: !loading && !result.error && result.listing === null,
  }
}