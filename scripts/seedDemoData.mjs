// Adds DEMO data to your Firebase DEV project.
//   node scripts/seedDemoData.mjs            -> add/overwrite demo records
//   node scripts/seedDemoData.mjs --remove   -> delete the demo records
//
// Every record is invented sample data. Nothing here is a real property.
import { readFileSync } from 'node:fs'
import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore, FieldValue, Timestamp } from 'firebase-admin/firestore'
import { facilities } from '../src/config/listingOptions.js'

// 1) Load the secret key (never committed to Git)
let serviceAccount
try {
  serviceAccount = JSON.parse(
    readFileSync(new URL('./serviceAccountKey.json', import.meta.url), 'utf8'),
  )
} catch {
  console.error('Could not read scripts/serviceAccountKey.json. See the setup steps.')
  process.exit(1)
}

// 2) Safety check: refuse to touch anything that does not look like a DEV project
if (!serviceAccount.project_id.includes('dev')) {
  console.error(
    `Refusing to run: project "${serviceAccount.project_id}" does not look like a dev project.`,
  )
  process.exit(1)
}

initializeApp({ credential: cert(serviceAccount) })
const db = getFirestore()
console.log(`Using project: ${serviceAccount.project_id}`)

const DAY = 24 * 60 * 60 * 1000
const daysAgo = (n) => Timestamp.fromMillis(Date.now() - n * DAY)

// Fields shared by every demo listing. Each demo below overrides what differs.
function makeListing(overrides) {
  return {
    ownerId: 'demo-owner',
    ownerDisplayName: 'Demo Owner (sample)',
    isDemo: true,
    description:
      'DEMO RECORD: invented sample data for development. This is not a real property.',
    propertyType: 'boarding',
    roomTypes: ['private'],
    facilities: [],
    genderPolicy: 'any',
    monthlyRent: 10000,
    depositAmount: 10000,
    additionalCharges: '',
    totalRooms: 1,
    availableRooms: 1,
    availableFrom: null,
    city: '',
    area: '',
    publicAddress: '',
    geo: null, // real coordinates arrive with the Maps feature (Phase 6)
    nearUniversities: [],
    nearWorkplaces: [],
    houseRules: [],
    photos: [],
    coverPhoto: null,
    contactPhone: null,
    showPhonePublicly: false,
    whatsappEnabled: false,
    publicContactEmail: null,
    status: 'draft',
    isPaused: false,
    verified: false,
    featured: false,
    createdAt: daysAgo(0),
    updatedAt: daysAgo(0),
    availabilityUpdatedAt: daysAgo(0),
    publishedAt: null,
    ...overrides,
  }
}

const demoListings = {
  'demo-1': makeListing({
    title: '[DEMO] Sample Boarding Room A',
    city: 'Colombo',
    area: 'Malabe',
    monthlyRent: 18000,
    depositAmount: 36000,
    roomTypes: ['private'],
    facilities: ['wifi', 'furnished', 'attachedBathroom'],
    totalRooms: 4,
    availableRooms: 2,
    nearUniversities: ['Sample University'],
    houseRules: ['No smoking', 'Quiet hours after 10 pm'],
    status: 'published',
    featured: true,
    createdAt: daysAgo(1),
    publishedAt: daysAgo(1),
  }),
  'demo-2': makeListing({
    title: '[DEMO] Sample Student Hostel B',
    propertyType: 'hostel',
    city: 'Kandy',
    area: 'Peradeniya',
    monthlyRent: 12000,
    depositAmount: 12000,
    roomTypes: ['shared'],
    facilities: ['wifi', 'studyArea', 'laundry', 'sharedBathroom'],
    genderPolicy: 'female',
    totalRooms: 12,
    availableRooms: 1,
    nearUniversities: ['Sample University'],
    status: 'published',
    verified: true, // for testing the badge design only. Not a real verification.
    createdAt: daysAgo(3),
    publishedAt: daysAgo(3),
  }),
  'demo-3': makeListing({
    title: '[DEMO] Sample Furnished Room C',
    city: 'Colombo',
    area: 'Nugegoda',
    monthlyRent: 25000,
    depositAmount: 50000,
    roomTypes: ['private'],
    facilities: ['ac', 'kitchen', 'parking', 'furnished', 'attachedBathroom'],
    totalRooms: 3,
    availableRooms: 0, // published but currently full, for testing that state
    nearWorkplaces: ['Sample Business District'],
    status: 'published',
    createdAt: daysAgo(6),
    publishedAt: daysAgo(6),
  }),
  'demo-4': makeListing({
    title: '[DEMO] Sample Paused Listing D',
    city: 'Galle',
    area: 'Sample Area',
    monthlyRent: 15000,
    facilities: ['wifi'],
    status: 'published',
    isPaused: true, // paused: must NOT be publicly readable
    createdAt: daysAgo(8),
    publishedAt: daysAgo(8),
  }),
  'demo-5': makeListing({
    title: '[DEMO] Sample Pending Listing E',
    city: 'Colombo',
    area: 'Moratuwa',
    monthlyRent: 14000,
    facilities: ['wifi', 'furnished'],
    status: 'pending', // awaiting admin review: must NOT be public
    createdAt: daysAgo(2),
  }),
  'demo-6': makeListing({
    title: '[DEMO] Sample Draft Listing F',
    city: 'Kandy',
    area: 'Sample Area',
    monthlyRent: 9000,
    status: 'draft', // owner still editing: must NOT be public
    createdAt: daysAgo(1),
  }),
}

async function run() {
  const batch = db.batch()

  if (process.argv.includes('--remove')) {
    for (const id of Object.keys(demoListings)) {
      batch.delete(db.collection('accommodations').doc(id))
    }
    await batch.commit()
    console.log(`Removed ${Object.keys(demoListings).length} demo accommodations.`)
    return
  }

  for (const [id, data] of Object.entries(demoListings)) {
    batch.set(db.collection('accommodations').doc(id), data)
  }

  // Facility list that the app and admin screens can read later
  batch.set(db.collection('platformSettings').doc('facilities'), {
    items: facilities,
    updatedAt: FieldValue.serverTimestamp(),
  })

  await batch.commit()
  console.log(
    `Seeded ${Object.keys(demoListings).length} demo accommodations and the facilities setting.`,
  )
}

run().catch((error) => {
  console.error('Seeding failed:', error.message)
  process.exit(1)
})