import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore'
import { db } from '../config/firebase'

const sortOptions = {
  newest: { field: 'createdAt', direction: 'desc' },
  priceLow: { field: 'monthlyRent', direction: 'asc' },
  priceHigh: { field: 'monthlyRent', direction: 'desc' },
}

// Publicly visible listings only. The Security Rules require BOTH conditions
// below, which is why the query includes them.
export async function fetchPublishedListings({ sortBy = 'newest', max = 60 } = {}) {
  if (!db) throw new Error('Firebase is not configured.')
  const { field, direction } = sortOptions[sortBy] ?? sortOptions.newest

  const listingsQuery = query(
    collection(db, 'accommodations'),
    where('status', '==', 'published'),
    where('isPaused', '==', false),
    orderBy(field, direction),
    limit(max),
  )
  const snapshot = await getDocs(listingsQuery)
  return snapshot.docs.map((document) => ({ id: document.id, ...document.data() }))
}

// Returns the listing, or null if it does not exist or is not public.
// (For a visitor, a draft or paused listing is refused by the rules, so we
// treat that the same as "not found".)
export async function fetchListing(id) {
  if (!db) throw new Error('Firebase is not configured.')
  try {
    const snapshot = await getDoc(doc(db, 'accommodations', id))
    return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null
  } catch (error) {
    if (error.code === 'permission-denied') return null
    throw error
  }
}