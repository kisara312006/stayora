import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import { Circle, CheckCircle2, Loader2, XCircle } from 'lucide-react'
import {
  db,
  firebaseConfig,
  isFirebaseConfigured,
  missingFirebaseKeys,
} from '../config/firebase'
import { useAuth } from '../hooks/useAuth'
import Container from '../components/ui/Container'
import Button from '../components/ui/Button'

// "expectDenied: true" means the test PASSES only if Firestore blocks it.
const publicTests = [
  {
    id: 'published',
    title: 'Read published, unpaused listings',
    expectation: 'Should WORK: these listings are public.',
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

// These run as the signed-in person and try things a user must NOT be able to do.
function makeAccountTests(uid, displayName) {
  const own = doc(db, 'users', uid)
  return [
    {
      id: 'own-update',
      title: 'Edit my own name',
      expectation: 'Should be ALLOWED: people may edit their own profile.',
      expectDenied: false,
      run: async () => {
        await updateDoc(own, { displayName, updatedAt: serverTimestamp() })
        return 'Accepted.'
      },
    },
    {
      id: 'own-points',
      title: 'Give myself StayPoints',
      expectation: 'Must be BLOCKED: points are controlled by the server.',
      expectDenied: true,
      run: async () => {
        await updateDoc(own, { points: 9999, updatedAt: serverTimestamp() })
        return 'The write was accepted.'
      },
    },
    {
      id: 'own-verified',
      title: 'Mark myself as a verified owner',
      expectation: 'Must be BLOCKED: only admins verify owners.',
      expectDenied: true,
      run: async () => {
        await updateDoc(own, {
          ownerVerificationStatus: 'verified',
          updatedAt: serverTimestamp(),
        })
        return 'The write was accepted.'
      },
    },
    {
      id: 'own-role',
      title: 'Change my role to "admin"',
      expectation: 'Must be BLOCKED: roles cannot be self-assigned.',
      expectDenied: true,
      run: async () => {
        await updateDoc(own, { role: 'admin', updatedAt: serverTimestamp() })
        return 'The write was accepted.'
      },
    },
    {
      id: 'own-extra',
      title: 'Add an unknown field to my profile',
      expectation: 'Must be BLOCKED after the rules hardening in Step 3.',
      expectDenied: true,
      run: async () => {
        await updateDoc(own, { unexpectedField: true, updatedAt: serverTimestamp() })
        return 'The write was accepted. Remove "unexpectedField" in the Firebase console.'
      },
    },
    {
      id: 'other-user',
      title: 'Read someone else’s profile',
      expectation: 'Must be BLOCKED: profiles are private.',
      expectDenied: true,
      run: async () => {
        const snap = await getDoc(doc(db, 'users', 'someone-else'))
        return `Read succeeded (exists: ${snap.exists()}).`
      },
    },
    {
      id: 'audit-write',
      title: 'Write an audit log entry',
      expectation: 'Must be BLOCKED: only trusted server code writes logs.',
      expectDenied: true,
      run: async () => {
        await setDoc(doc(db, 'auditLogs', 'browser-test'), { note: 'test' })
        return 'The write was accepted. Delete "browser-test" in the Firebase console.'
      },
    },
    {
      id: 'notification-write',
      title: 'Create a notification for myself',
      expectation: 'Must be BLOCKED: notifications are created by the server.',
      expectDenied: true,
      run: async () => {
        await setDoc(doc(db, 'notifications', 'browser-test'), {
          userId: uid,
          read: false,
        })
        return 'The write was accepted. Delete "browser-test" in the Firebase console.'
      },
    },
  ]
}

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

function StatusIcon({ status }) {
  if (status === 'pass')
    return <CheckCircle2 className="h-6 w-6 shrink-0 text-ink" aria-label="Passed" />
  if (status === 'fail')
    return <XCircle className="h-6 w-6 shrink-0 text-danger" aria-label="Failed" />
  if (status === 'idle')
    return <Circle className="h-6 w-6 shrink-0 text-charcoal/50" aria-label="Not run" />
  return <Loader2 className="h-6 w-6 shrink-0 animate-spin text-gold" aria-label="Running" />
}

function ResultList({ tests, results, emptyStatus }) {
  return (
    <ul className="mt-4 space-y-4">
      {tests.map((test) => {
        const result =
          results[test.id] ??
          (emptyStatus === 'idle'
            ? { status: 'idle', detail: 'Not run yet.' }
            : { status: 'running', detail: 'Checking…' })
        return (
          <li
            key={test.id}
            className="flex gap-4 rounded-2xl border border-taupe bg-surface p-5"
          >
            <StatusIcon status={result.status} />
            <div className="min-w-0">
              <h3 className="text-base">{test.title}</h3>
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
  )
}

export default function FirebaseCheck() {
  const { user, profile } = useAuth()
  const [results, setResults] = useState({})

  const accountTests = useMemo(
    () =>
      isFirebaseConfigured && user && profile
        ? makeAccountTests(user.uid, profile.displayName)
        : [],
    [user, profile],
  )

  const runTests = useCallback(async (list) => {
    await Promise.all(
      list.map(async (test) => {
        const result = await evaluate(test)
        setResults((previous) => ({ ...previous, [test.id]: result }))
      }),
    )
  }, [])

  useEffect(() => {
    if (isFirebaseConfigured) runTests(publicTests)
  }, [runTests])

  function rerunPublic() {
    setResults((previous) => {
      const next = { ...previous }
      publicTests.forEach((test) => delete next[test.id])
      return next
    })
    runTests(publicTests)
  }

  function runAccount() {
    setResults((previous) => ({
      ...previous,
      ...Object.fromEntries(
        accountTests.map((test) => [test.id, { status: 'running', detail: 'Checking…' }]),
      ),
    }))
    runTests(accountTests)
  }

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
        <div className="mt-6 rounded-2xl border border-danger bg-surface p-5">
          <h2 className="text-lg text-danger">Firebase is not configured</h2>
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
          <p className="mt-6 rounded-xl border border-taupe bg-surface p-4 text-sm">
            Connected to project: <strong>{firebaseConfig.projectId}</strong>
            <br />
            Signed in as: <strong>{user ? user.email : 'nobody (visitor)'}</strong>
          </p>

          <h2 className="mt-10 text-xl">1. Public data rules</h2>
          <p className="mt-1 text-sm text-charcoal/70">
            These run as whoever is signed in. If you are an administrator, the three
            “must be blocked” tests will show FAIL. That is expected, because admins
            may read everything. Log out to see the visitor results.
          </p>
          <ResultList tests={publicTests} results={results} emptyStatus="running" />
          <Button className="mt-6" onClick={rerunPublic}>
            Run public checks again
          </Button>

          <h2 className="mt-12 text-xl">2. Account protections</h2>
          <p className="mt-1 text-sm text-charcoal/70">
            These try to break the rules with your own account. Every one marked
            “must be blocked” should PASS by being refused. If one is accepted, it
            writes to your profile and you will need to undo it in the console.
          </p>
          {!user && (
            <p className="mt-4 rounded-xl border border-taupe bg-surface p-4 text-sm">
              Log in to run these tests.
            </p>
          )}
          {user && !profile && (
            <p className="mt-4 rounded-xl border border-taupe bg-surface p-4 text-sm">
              Finish setting up your profile first.
            </p>
          )}
          {accountTests.length > 0 && (
            <>
              <ResultList tests={accountTests} results={results} emptyStatus="idle" />
              <Button className="mt-6" onClick={runAccount}>
                Run account security tests
              </Button>
            </>
          )}
        </>
      )}
    </Container>
  )
}