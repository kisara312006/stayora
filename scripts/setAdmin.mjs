// Gives (or removes) administrator access using a Firebase custom claim.
//   node scripts/setAdmin.mjs you@example.com
//   node scripts/setAdmin.mjs you@example.com --remove
// The person must already have registered on the site. After running it they
// must log out and log in again for the change to take effect.
import { readFileSync } from 'node:fs'
import { initializeApp, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

const email = process.argv[2]
const remove = process.argv.includes('--remove')

if (!email || email.startsWith('--')) {
  console.error('Usage: node scripts/setAdmin.mjs <email> [--remove]')
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

// Safety check: only the dev project unless you explicitly say otherwise
if (!serviceAccount.project_id.includes('dev') && !process.argv.includes('--allow-prod')) {
  console.error(
    `Refusing to run on "${serviceAccount.project_id}". It does not look like a dev project. ` +
      'Add --allow-prod only when you really mean it.',
  )
  process.exit(1)
}

initializeApp({ credential: cert(serviceAccount) })
const auth = getAuth()

async function run() {
  const user = await auth.getUserByEmail(email)
  const claims = { ...(user.customClaims ?? {}) }

  if (remove) {
    delete claims.admin
  } else {
    claims.admin = true
  }

  await auth.setCustomUserClaims(user.uid, Object.keys(claims).length > 0 ? claims : null)
  if (remove) await auth.revokeRefreshTokens(user.uid) // ends their access quickly

  console.log(
    `${remove ? 'Removed admin access from' : 'Granted admin access to'} ${email} (${serviceAccount.project_id}).`,
  )
  console.log('They must log out and log in again for this to take effect.')
}

run().catch((error) => {
  if (error.code === 'auth/user-not-found') {
    console.error('No account with that email. Register on the site first.')
  } else {
    console.error('Failed:', error.message)
  }
  process.exit(1)
})