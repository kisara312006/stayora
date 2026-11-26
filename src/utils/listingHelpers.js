import { facilities, propertyTypes, roomTypes } from '../config/listingOptions'

const toLabelMap = (list) => Object.fromEntries(list.map((item) => [item.id, item.label]))
const facilityLabels = toLabelMap(facilities)
const propertyTypeLabels = toLabelMap(propertyTypes)
const roomTypeLabels = toLabelMap(roomTypes)

export const facilityLabel = (id) => facilityLabels[id] ?? id
export const propertyTypeLabel = (id) => propertyTypeLabels[id] ?? id
export const roomTypeLabel = (id) => roomTypeLabels[id] ?? id

// Availability comes ONLY from the owner's latest room count.
// A listing existing in the database never means it is available.
export function getAvailability(listing) {
  const rooms = listing.availableRooms ?? 0
  if (rooms <= 0) return { key: 'full', label: 'Currently full' }
  if (rooms === 1) return { key: 'limited', label: 'Few rooms left' }
  return { key: 'available', label: 'Available' }
}

// Builds a wa.me link only when the number looks valid. Returns null otherwise.
export function buildWhatsAppLink(phone) {
  if (!phone) return null
  let digits = String(phone).replace(/\D/g, '')
  if (digits.startsWith('0') && digits.length === 10) digits = `94${digits.slice(1)}`
  if (digits.length < 9 || digits.length > 15) return null
  return `https://wa.me/${digits}`
}