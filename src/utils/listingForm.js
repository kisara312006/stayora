import { Timestamp } from 'firebase/firestore'
import { toDate } from './format'
import { validateEmail, validatePhone } from './validators'

// The Security Rules allow at most 10 photos per listing.
export const MAX_PHOTOS = 10

export const emptyForm = {
  title: '',
  propertyType: 'boarding',
  description: '',
  publicAddress: '',
  city: '',
  area: '',
  monthlyRent: '',
  depositAmount: '',
  additionalCharges: '',
  totalRooms: '1',
  availableRooms: '1',
  roomTypes: [],
  facilities: [],
  genderPolicy: 'any',
  availableFrom: '',
  houseRules: '',
  nearUniversities: '',
  nearWorkplaces: '',
  publishPhone: false,
  contactPhone: '',
  whatsappEnabled: false,
  publicContactEmail: '',
  photos: [],
}

function pad(number) {
  return String(number).padStart(2, '0')
}

// Turns a Firestore Timestamp into "2026-12-31" for a date input.
function dateToInput(value) {
  const date = toDate(value)
  if (!date) return ''
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

function splitList(text, separator, maxItems, maxLength) {
  return text
    .split(separator)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, maxItems)
    .map((item) => item.slice(0, maxLength))
}

// Firestore listing -> form values (all inputs hold text).
export function listingToForm(listing) {
  return {
    title: listing.title ?? '',
    propertyType: listing.propertyType ?? 'boarding',
    description: listing.description ?? '',
    publicAddress: listing.publicAddress ?? '',
    city: listing.city ?? '',
    area: listing.area ?? '',
    monthlyRent: listing.monthlyRent != null ? String(listing.monthlyRent) : '',
    depositAmount: listing.depositAmount ? String(listing.depositAmount) : '',
    additionalCharges: listing.additionalCharges ?? '',
    totalRooms: String(listing.totalRooms ?? 1),
    availableRooms: String(listing.availableRooms ?? 0),
    roomTypes: listing.roomTypes ?? [],
    facilities: listing.facilities ?? [],
    genderPolicy: listing.genderPolicy ?? 'any',
    availableFrom: dateToInput(listing.availableFrom),
    houseRules: (listing.houseRules ?? []).join('\n'),
    nearUniversities: (listing.nearUniversities ?? []).join(', '),
    nearWorkplaces: (listing.nearWorkplaces ?? []).join(', '),
    publishPhone: Boolean(listing.showPhonePublicly && listing.contactPhone),
    contactPhone: listing.contactPhone ?? '',
    whatsappEnabled: Boolean(listing.whatsappEnabled),
    publicContactEmail: listing.publicContactEmail ?? '',
    photos: listing.photos ?? [],
  }
}

// Returns an object of error messages. An empty object means "all good".
// Even a draft must pass the basic checks, because the Security Rules require them.
// Submitting for review has extra requirements.
export function validateListingForm(values, { forSubmit = false } = {}) {
  const errors = {}
  const title = values.title.trim()
  const description = values.description.trim()
  const city = values.city.trim()
  const rent = Number(values.monthlyRent)
  const total = Number(values.totalRooms)
  const available = Number(values.availableRooms)

  if (title.length < 3 || title.length > 100) {
    errors.title = 'Enter a title of 3 to 100 characters.'
  }
  if (!city || city.length > 60) errors.city = 'Enter the city (up to 60 characters).'
  if (values.area.trim().length > 60) errors.area = 'Area must be 60 characters or fewer.'
  if (values.publicAddress.trim().length > 200) {
    errors.publicAddress = 'Address must be 200 characters or fewer.'
  }
  if (description.length > 3000) {
    errors.description = 'Description must be 3,000 characters or fewer.'
  }

  if (
    values.monthlyRent === '' ||
    !Number.isFinite(rent) ||
    rent <= 0 ||
    rent > 1000000
  ) {
    errors.monthlyRent = 'Enter a monthly rent between 1 and 1,000,000 LKR.'
  }
  if (values.depositAmount !== '') {
    const deposit = Number(values.depositAmount)
    if (!Number.isFinite(deposit) || deposit < 0 || deposit > 10000000) {
      errors.depositAmount = 'Enter a deposit of 0 or more.'
    }
  }
  if (values.additionalCharges.trim().length > 200) {
    errors.additionalCharges = 'Keep this under 200 characters.'
  }

  if (
    values.totalRooms === '' ||
    !Number.isInteger(total) ||
    total < 1 ||
    total > 500
  ) {
    errors.totalRooms = 'Enter a whole number from 1 to 500.'
  }
  if (values.availableRooms === '' || !Number.isInteger(available) || available < 0) {
    errors.availableRooms = 'Enter a whole number, 0 or more.'
  } else if (!errors.totalRooms && available > total) {
    errors.availableRooms = 'Available rooms cannot be more than the total rooms.'
  }

  if (values.publicContactEmail.trim()) {
    const problem = validateEmail(values.publicContactEmail)
    if (problem) errors.publicContactEmail = problem
  }
  if (values.publishPhone) {
    const problem = validatePhone(values.contactPhone, { required: true })
    if (problem) errors.contactPhone = problem
  }
  if (values.photos.length > MAX_PHOTOS) {
    errors.photos = `You can add up to ${MAX_PHOTOS} photos.`
  }

  if (forSubmit) {
    if (description.length < 30) {
      errors.description = 'Describe the property in at least 30 characters.'
    }
    if (!values.area.trim()) errors.area = 'Enter the area or neighbourhood.'
    if (values.roomTypes.length === 0) errors.roomTypes = 'Choose at least one room type.'
    if (values.photos.length === 0) errors.photos = 'Add at least one photo.'
  }

  return errors
}

// Form values -> the fields we store in Firestore.
// The contact phone is only stored when the owner agrees to publish it,
// because every field on a listing can be read by anyone who can see the listing.
export function formToListingData(values, ownerDisplayName) {
  const phone = values.publishPhone ? values.contactPhone.trim() : ''

  return {
    title: values.title.trim(),
    propertyType: values.propertyType,
    description: values.description.trim(),
    roomTypes: values.roomTypes,
    facilities: values.facilities,
    genderPolicy: values.genderPolicy,
    monthlyRent: Number(values.monthlyRent),
    depositAmount: values.depositAmount === '' ? 0 : Number(values.depositAmount),
    additionalCharges: values.additionalCharges.trim(),
    totalRooms: Number(values.totalRooms),
    availableRooms: Number(values.availableRooms),
    availableFrom: values.availableFrom
      ? Timestamp.fromDate(new Date(`${values.availableFrom}T00:00:00`))
      : null,
    city: values.city.trim(),
    area: values.area.trim(),
    publicAddress: values.publicAddress.trim(),
    nearUniversities: splitList(values.nearUniversities, ',', 10, 80),
    nearWorkplaces: splitList(values.nearWorkplaces, ',', 10, 80),
    houseRules: splitList(values.houseRules, /\r?\n/, 15, 160),
    photos: values.photos,
    coverPhoto: values.photos[0] ?? null,
    contactPhone: phone || null,
    showPhonePublicly: Boolean(phone),
    whatsappEnabled: Boolean(phone) && values.whatsappEnabled,
    publicContactEmail: values.publicContactEmail.trim() || null,
    ownerDisplayName,
  }
}