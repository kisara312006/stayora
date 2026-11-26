import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from '../config/firebase'

function requireDb() {
  if (!db) throw new Error('Firebase is not configured.')
  return db
}

// ---------- Public reads (Explore, Home, details) ----------

const sortOptions = {
  newest: { field: 'createdAt', direction: 'desc' },
  priceLow: { field: 'monthlyRent', direction: 'asc' },
  priceHigh: { field: 'monthlyRent', direction: 'desc' },
}

// Publicly visible listings only. The Security Rules require BOTH conditions
// below, which is why the query includes them.
export async function fetchPublishedListings({ sortBy = 'newest', max = 60 } = {}) {
  const { field, direction } = sortOptions[sortBy] ?? sortOptions.newest

  const listingsQuery = query(
    collection(requireDb(), 'accommodations'),
    where('status', '==', 'published'),
    where('isPaused', '==', false),
    orderBy(field, direction),
    limit(max),
  )
  const snapshot = await getDocs(listingsQuery)
  return snapshot.docs.map((document) => ({ id: document.id, ...document.data() }))
}

// Returns the listing, or null if it does not exist or is not visible to this person.
export async function fetchListing(id) {
  try {
    const snapshot = await getDoc(doc(requireDb(), 'accommodations', id))
    return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null
  } catch (error) {
    if (error.code === 'permission-denied') return null
    throw error
  }
}

// ---------- Owner reads ----------

// Live list of the owner's own listings. The query filters by ownerId, which
// is what the Security Rules need in order to allow reading drafts.
export function subscribeOwnerListings(ownerId, onData, onError) {
  const ownerQuery = query(
    collection(requireDb(), 'accommodations'),
    where('ownerId', '==', ownerId),
    orderBy('updatedAt', 'desc'),
  )
  return onSnapshot(
    ownerQuery,
    (snapshot) =>
      onData(
        snapshot.docs.map((document) => ({
          id: document.id,
          ...document.data({ serverTimestamps: 'estimate' }),
        })),
      ),
    onError,
  )
}

// Returns the listing only if it belongs to this owner.
export async function fetchOwnListing(id, ownerId) {
  const listing = await fetchListing(id)
  return listing && listing.ownerId === ownerId ? listing : null
}

// ---------- Owner writes ----------

// New listings always start as drafts. The Security Rules refuse anything else.
export async function createListing(ownerId, data) {
  const reference = await addDoc(collection(requireDb(), 'accommodations'), {
    ...data,
    ownerId,
    status: 'draft',
    isPaused: false,
    verified: false,
    featured: false,
    isDemo: false,
    geo: null,
    publishedAt: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    availabilityUpdatedAt: serverTimestamp(),
  })
  return reference.id
}

export async function updateListing(id, changes) {
  await updateDoc(doc(requireDb(), 'accommodations', id), {
    ...changes,
    updatedAt: serverTimestamp(),
  })
}

// Saves form edits. If the room count changed, the availability time is refreshed.
export async function saveListingEdits(listing, data, status) {
  const changes = { ...data, status }
  if (data.availableRooms !== listing.availableRooms) {
    changes.availabilityUpdatedAt = serverTimestamp()
  }
  await updateListing(listing.id, changes)
}

// Owners may only move a listing to draft, pending or archived.
// Publishing is done by an administrator.
export function setListingStatus(id, status) {
  return updateListing(id, { status })
}

// Pause or resume a LIVE listing without sending it back for review.
export async function setListingPaused(id, paused) {
  await updateDoc(doc(requireDb(), 'accommodations', id), {
    isPaused: paused,
    availabilityUpdatedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

// Changes the number of available rooms inside a TRANSACTION.
// A transaction reads the current value and writes the new one as one step.
// If someone else changes the listing in between, Firestore retries with the
// fresh value, so two simultaneous "+1" clicks both count.
//   adjustAvailability(id, { delta: 1 })   add or remove rooms
//   adjustAvailability(id, { set: 0 })     set an exact number
export async function adjustAvailability(id, { delta = 0, set = null } = {}) {
  const database = requireDb()
  const reference = doc(database, 'accommodations', id)

  return runTransaction(database, async (transaction) => {
    const snapshot = await transaction.get(reference)
    if (!snapshot.exists()) throw new Error('This listing no longer exists.')

    const data = snapshot.data()
    const total = data.totalRooms ?? 0
    const requested = set === null ? (data.availableRooms ?? 0) + delta : set
    const next = Math.max(0, Math.min(total, requested))

    transaction.update(reference, {
      availableRooms: next,
      availabilityUpdatedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return next
  })
}