// Reviews listings on your DEV project until the admin dashboard exists.
//   node scripts/reviewListing.mjs list
//   node scripts/reviewListing.mjs approve <listingId>
//   node scripts/reviewListing.mjs reject <listingId> "Reason for the owner"
//   node scripts/reviewListing.mjs changes <listingId> "What the owner should change"
import { readFileSync } from 'node:fs'
import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'

const [command, listingId, ...noteParts] = process.argv.slice(2)
const note = noteParts.join(' ').trim()

const usage = [
  'Usage:',
  '  node scripts/reviewListing.mjs list',
  '  node scripts/reviewListing.mjs approve <listingId>',
  '  node scripts/reviewListing.mjs reject <listingId> "reason"',
  '  node scripts/reviewListing.mjs changes <listingId> "what to change"',
].join('\n')

if (!['list', 'approve', 'reject', 'changes'].includes(command)) {
  console.error(usage)
  process.exit(1)
}
if (command !== 'list' && !listingId) {
  console.error(usage)
  process.exit(1)
}

let serviceAccount
try {
  serviceAccount = JSON.parse(
    readFileSync(new URL('./serviceAccountKey.json', import.meta.url), 'utf8'),
  )
} catch {
  console.error('Could not read scripts/serviceAccountKey.json.')
  process.exit(1)
}

if (!serviceAccount.project_id.includes('dev')) {
  console.error(`Refusing to run on "${serviceAccount.project_id}": it does not look like a dev project.`)
  process.exit(1)
}

initializeApp({ credential: cert(serviceAccount) })
const db = getFirestore()

async function run() {
  if (command === 'list') {
    const snapshot = await db.collection('accommodations').where('status', '==', 'pending').get()
    if (snapshot.empty) {
      console.log('No listings are waiting for review.')
      return
    }
    snapshot.forEach((document) => {
      const data = document.data()
      console.log(`${document.id}  |  ${data.title}  |  Rs. ${data.monthlyRent}  |  owner ${data.ownerId}`)
    })
    return
  }

  const reference = db.collection('accommodations').doc(listingId)
  const snapshot = await reference.get()
  if (!snapshot.exists) {
    console.error('No listing with that ID.')
    process.exit(1)
  }
  const data = snapshot.data()
  if (data.status !== 'pending') {
    console.error(`This listing is "${data.status}", not "pending", so it cannot be reviewed.`)
    process.exit(1)
  }

  if (command === 'approve') {
    await reference.update({
      status: 'published',
      publishedAt: FieldValue.serverTimestamp(),
      moderationNote: null,
      updatedAt: FieldValue.serverTimestamp(),
    })
    console.log(`Approved "${data.title}". It is now public.`)
    return
  }

  await reference.update({
    status: command === 'reject' ? 'rejected' : 'changesRequested',
    moderationNote: note || null,
    updatedAt: FieldValue.serverTimestamp(),
  })
  console.log(`${command === 'reject' ? 'Rejected' : 'Requested changes on'} "${data.title}".`)
}

run().catch((error) => {
  console.error('Failed:', error.message)
  process.exit(1)
})