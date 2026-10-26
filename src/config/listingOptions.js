export const propertyTypes = [
  { id: 'boarding', label: 'Boarding room' },
  { id: 'hostel', label: 'Hostel' },
]

export const roomTypes = [
  { id: 'private', label: 'Private room' },
  { id: 'shared', label: 'Shared room' },
]

// Facilities and inclusions. A listing stores the ids it offers, e.g. ['wifi', 'furnished'].
export const facilities = [
  { id: 'wifi', label: 'Wi-Fi' },
  { id: 'ac', label: 'Air conditioning' },
  { id: 'attachedBathroom', label: 'Attached bathroom' },
  { id: 'sharedBathroom', label: 'Shared bathroom' },
  { id: 'kitchen', label: 'Kitchen access' },
  { id: 'laundry', label: 'Laundry facilities' },
  { id: 'parking', label: 'Parking' },
  { id: 'studyArea', label: 'Study area' },
  { id: 'furnished', label: 'Furnished' },
  { id: 'utilitiesIncluded', label: 'Electricity and water included' },
  { id: 'mealsIncluded', label: 'Meals included' },
]

// Owner-specified restriction. Used only as an optional filter.
// It is never used to rank or score listings.
export const genderPolicies = [
  { id: 'any', label: 'Open to everyone' },
  { id: 'female', label: 'Female only' },
  { id: 'male', label: 'Male only' },
]

export const listingStatuses = [
  'draft',
  'pending',
  'changesRequested',
  'published',
  'rejected',
  'archived',
  'removed',
]