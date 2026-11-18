import { Navigate, useLocation } from 'react-router-dom'
import Container from '../components/ui/Container'
import Button from '../components/ui/Button'
import LoadingScreen from '../components/ui/LoadingScreen'
import { useAuth } from '../hooks/useAuth'

function Blocked({ title, text }) {
  return (
    <Container className="max-w-xl py-24 text-center">
      <h1 className="text-3xl">{title}</h1>
      <p className="mt-3 text-charcoal/80">{text}</p>
      <Button to="/" className="mt-8">
        Back to home
      </Button>
    </Container>
  )
}

// Wrap a page in this to restrict it.
//   <ProtectedRoute>                    any signed-in user with a profile
//   <ProtectedRoute role="owner">       owners only
//   <ProtectedRoute admin>              administrators only
// This only improves the experience. Firestore Security Rules protect the data.
export default function ProtectedRoute({ role, admin = false, children }) {
  const { user, profile, isAdmin, authLoading, profileLoading, profileError } =
    useAuth()
  const location = useLocation()

  if (authLoading || (user && profileLoading)) return <LoadingScreen />

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (admin) {
    return isAdmin ? (
      children
    ) : (
      <Blocked
        title="Administrators only"
        text="You do not have permission to view this page."
      />
    )
  }

  if (profileError) {
    return (
      <Blocked
        title="We couldn’t load your profile"
        text="Check your connection and refresh the page."
      />
    )
  }

  if (!profile) return <Navigate to="/complete-profile" replace />

  if (profile.suspended) {
    return (
      <Blocked
        title="Account suspended"
        text="Your account has been suspended. Please contact support."
      />
    )
  }

  if (role && profile.role !== role) {
    return (
      <Blocked
        title="Access denied"
        text="Your account type does not have access to this page."
      />
    )
  }

  return children
}