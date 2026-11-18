import { useCallback, useEffect, useMemo, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'
import { auth, db } from '../config/firebase'
import { AuthContext } from './AuthContext'

export default function AuthProvider({ children }) {
  // "ready" turns true once Firebase has told us whether someone is signed in.
  const [authState, setAuthState] = useState({
    user: null,
    isAdmin: false,
    emailVerified: false,
    ready: !auth,
  })
  const [profileState, setProfileState] = useState({
    uid: null,
    data: null,
    error: false,
  })

  // 1) Watch the sign-in state. Firebase restores saved sessions automatically.
  useEffect(() => {
    if (!auth) return undefined
    return onAuthStateChanged(auth, async (firebaseUser) => {
      let isAdmin = false
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdTokenResult()
          isAdmin = token.claims.admin === true
        } catch (error) {
          console.error('Could not read account claims:', error.code)
        }
      }
      setAuthState({
        user: firebaseUser,
        isAdmin,
        emailVerified: firebaseUser?.emailVerified ?? false,
        ready: true,
      })
    })
  }, [])

  const uid = authState.user?.uid ?? null

  // 2) Watch the signed-in user's profile document in real time.
  useEffect(() => {
    if (!uid || !db) return undefined
    return onSnapshot(
      doc(db, 'users', uid),
      (snapshot) => {
        setProfileState({
          uid,
          data: snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null,
          error: false,
        })
      },
      (error) => {
        console.error('Could not load profile:', error.code)
        setProfileState({ uid, data: null, error: true })
      },
    )
  }, [uid])

  // Re-reads the account from Firebase, e.g. after the email was verified.
  const refreshUser = useCallback(async () => {
    if (!auth?.currentUser) return
    await auth.currentUser.reload()
    const current = auth.currentUser
    setAuthState((previous) => ({
      ...previous,
      user: current,
      emailVerified: current.emailVerified,
    }))
  }, [])

  // The profile is "loading" until the first answer for THIS user has arrived.
  const profileReady = uid !== null && profileState.uid === uid
  const profile = profileReady ? profileState.data : null
  const profileLoading = uid !== null && !profileReady
  const profileError = profileReady && profileState.error

  const value = useMemo(
    () => ({
      user: authState.user,
      profile,
      role: profile?.role ?? null,
      isAdmin: authState.isAdmin,
      emailVerified: authState.emailVerified,
      authLoading: !authState.ready,
      profileLoading,
      profileError,
      refreshUser,
    }),
    [authState, profile, profileLoading, profileError, refreshUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}