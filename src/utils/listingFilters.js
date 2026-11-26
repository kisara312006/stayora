// Firestore can't combine many "must include" filters in one query.
// So we ask it for published listings, then narrow them down here in the browser.
const typeTests = {
  boarding: (l) => l.propertyType === 'boarding',
  hostel: (l) => l.propertyType === 'hostel',
  'private-room': (l) => l.roomTypes?.includes('private'),
  'shared-room': (l) => l.roomTypes?.includes('shared'),
}

const categoryTests = {
  'student-boarding': (l) => l.propertyType === 'boarding',
  'student-hostels': (l) => l.propertyType === 'hostel',
  'private-rooms': (l) => l.roomTypes?.includes('private'),
  'shared-rooms': (l) => l.roomTypes?.includes('shared'),
  furnished: (l) => l.facilities?.includes('furnished'),
  'near-universities': (l) => (l.nearUniversities ?? []).length > 0,
  'near-workplaces': (l) => (l.nearWorkplaces ?? []).length > 0,
}

export const typeChoices = [
  { value: 'boarding', label: 'Boarding room' },
  { value: 'hostel', label: 'Hostel' },
  { value: 'private-room', label: 'Private room' },
  { value: 'shared-room', label: 'Shared room' },
]

function matchesLocation(listing, text) {
  const needle = text.trim().toLowerCase()
  if (!needle) return true
  const haystack = [
    listing.city,
    listing.area,
    listing.publicAddress,
    ...(listing.nearUniversities ?? []),
    ...(listing.nearWorkplaces ?? []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
  return haystack.includes(needle)
}

export function applyFilters(listings, filters) {
  const maxBudget = Number(filters.maxBudget)

  return listings.filter((listing) => {
    if (!matchesLocation(listing, filters.location)) return false
    if (filters.type && typeTests[filters.type] && !typeTests[filters.type](listing)) {
      return false
    }
    if (
      filters.category &&
      categoryTests[filters.category] &&
      !categoryTests[filters.category](listing)
    ) {
      return false
    }
    if (filters.maxBudget && Number.isFinite(maxBudget) && listing.monthlyRent > maxBudget) {
      return false
    }
    if (
      filters.facilities.length > 0 &&
      !filters.facilities.every((id) => listing.facilities?.includes(id))
    ) {
      return false
    }
    if (filters.available && (listing.availableRooms ?? 0) <= 0) return false
    return true
  })
}