import { useCallback, useEffect, useState } from 'react'
import { collection, getDocs, limit, query, where } from 'firebase/firestore'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import {
  db,
  firebaseConfig,
  isFirebaseConfigured,
  missingFirebaseKeys,
} from '../config/firebase'
import Container from '../components/ui/Container'
import Button from '../components/ui/Button'

// "expectDenied: true" means the test PASSES only if Firestore blocks it.
const tests = [
  {
    id: 'published',
    title: 'Read published, unpaused listings',
    expectation: 'Should WORK once rules and demo data are added (Phase 3B).',
    expectDenied: false,
    run: async () => {
      const q = query(
        collection(db, 'accommodations'),
        where('status', '==', 'published'),
        where('isPaused', '==', false),
        limit(20),
      )
      const snap = await getDocs(q)
      const titles = snap.docs.map((d) => d.data().title).join(' | ')
      return `Found ${snap.size} listing(s). ${titles}`
    },
  },
  {
    id: 'unfiltered',
    title: 'Read ALL listings with no filter',
    expectation: 'Must be BLOCKED, so drafts and pending listings stay private.',
    expectDenied: true,
    run: async () => {
      const snap = await getDocs(query(collection(db, 'accommodations'), limit(5)))
      return `Read ${snap.size} document(s).`
    },
  },
  {
    id: 'users',
    title: 'Read the users collection',
    expectation: 'Must be BLOCKED, since user profiles are private.',
    expectDenied: true,
    run: async () => {
      const snap = await getDocs(query(collection(db, 'users'), limit(1)))
      return `Read ${snap.size} document(s).`
    },
  },
  {
    id: 'auditLogs',
    title: 'Read admin audit logs',
    expectation: 'Must be BLOCKED, since only admins may read them.',
    expectDenied: true,
    run: async () => {
      const snap = await getDocs(query(collection(db, 'auditLogs'), limit(1)))
      return `Read ${snap.size} document(s).`
    },
  },
]

async function evaluate(test) {
  try {
    const detail = await test.run()
    if (test.expectDenied) {
      return {
        status: 'fail',
        detail: `SECURITY PROBLEM: this should have been blocked. ${detail}`,
      }
    }
    return { status: 'pass', detail }
  } catch (error) {
    if (test.expectDenied && error.code === 'permission-denied') {
      return { status: 'pass', detail: 'Blocked by Security Rules, as expected.' }
    }
    return {
      status: 'fail',
      detail: `${error.code || 'error'}: ${error.message}`,
    }
  }
}

const initialResults = Object.fromEntries(
  tests.map((t) => [t.id, { status: 'running', detail: 'Checking…' }]),
)

function StatusIcon({ status }) {
  if (status === 'pass')
    return <CheckCircle2 className="h-6 w-6 text-navy" aria-label="Passed" />
  if (status === 'fail')
    return <XCircle className="h-6 w-6 text-red-700" aria-label="Failed" />
  return <Loader2 className="h-6 w-6 animate-spin text-gold" aria-label="Running" />
}

export default function FirebaseCheck() {
  const [results, setResults] = useState(initialResults)

  const runAll = useCallback(async () => {
    await Promise.all(
      tests.map(async (test) => {
        const result = await evaluate(test)
        setResults((previous) => ({ ...previous, [test.id]: result }))
      }),
    )
  }, [])

  useEffect(() => {
    if (isFirebaseConfigured) runAll()
  }, [runAll])

  return (
    <Container className="max-w-3xl py-12">
      <span className="rounded-full bg-gold px-3 py-1 text-sm font-semibold text-navy">
        Developer tool
      </span>
      <h1 className="mt-4 text-3xl">Firebase connection check</h1>
      <p className="mt-2 text-charcoal/80">
        Only available while running <code>npm run dev</code>.
      </p>

      {!isFirebaseConfigured ? (
        <div className="mt-6 rounded-2xl border border-red-700 bg-white p-5">
          <h2 className="text-lg text-red-700">Firebase is not configured</h2>
          <p className="mt-2 text-sm">
            These values in your <code>.env</code> file are missing or still
            placeholders:
          </p>
          <ul className="mt-2 list-disc pl-6 text-sm">
            {missingFirebaseKeys.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
          <p className="mt-2 text-sm">
            Fix <code>.env</code>, then stop and restart <code>npm run dev</code>.
          </p>
        </div>
      ) : (
        <>
          <p className="mt-6 rounded-xl border border-taupe bg-white p-4 text-sm">
            Connected to project: <strong>{firebaseConfig.projectId}</strong>
          </p>

          <ul className="mt-6 space-y-4">
            {tests.map((test) => {
              const result = results[test.id]
              return (
                <li
                  key={test.id}
                  className="flex gap-4 rounded-2xl border border-taupe bg-white p-5"
                >
                  <StatusIcon status={result.status} />
                  <div className="min-w-0">
                    <h2 className="text-base">{test.title}</h2>
                    <p className="text-sm text-charcoal/70">{test.expectation}</p>
                    <p className="mt-2 break-words text-sm">
                      <strong>
                        {result.status === 'pass' && 'PASS: '}
                        {result.status === 'fail' && 'FAIL: '}
                      </strong>
                      {result.detail}
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>

          <Button
            className="mt-6"
            onClick={() => {
              setResults(initialResults)
              runAll()
            }}
          >
            Run checks again
          </Button>
        </>
      )}
    </Container>
  )
}