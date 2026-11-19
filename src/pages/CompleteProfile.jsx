import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import AuthCard from '../components/auth/AuthCard'
import RoleChoice from '../components/auth/RoleChoice'
import TextField from '../components/ui/TextField'
import Alert from '../components/ui/Alert'
import Button from '../components/ui/Button'
import LoadingScreen from '../components/ui/LoadingScreen'
import { useAuth } from '../hooks/useAuth'
import { createUserProfile, logout } from '../services/authService'
import { getAuthErrorMessage } from '../utils/authErrors'
import { validateName, validatePhone } from '../utils/validators'

// For people who are signed in but have no profile yet, for example a new Google
// user who signed in from the Login page. They choose their account type here.
export default function CompleteProfile() {
  const { user, profile, authLoading, profileLoading, profileError } = useAuth()
  const navigate = useNavigate()
  const [role, setRole] = useState('seeker')
  const [displayName, setDisplayName] = useState(null) // null = use the Google name
  const [phone, setPhone] = useState('')
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [busy, setBusy] = useState(false)

  if (authLoading || (user && profileLoading)) return <LoadingScreen />
  if (!user) return <Navigate to="/login" replace />
  if (profile) return <Navigate to="/account" replace />

  if (profileError) {
    return (
      <AuthCard title="We couldn’t check your profile">
        <Alert variant="error">
          Check your connection and refresh the page.
        </Alert>
      </AuthCard>
    )
  }

  const nameValue = displayName ?? user.displayName ?? ''

  async function handleSubmit(event) {
    event.preventDefault()
    setFormError('')

    const found = {
      displayName: validateName(nameValue),
      phone: validatePhone(phone, { required: role === 'owner' }),
    }
    const problems = Object.fromEntries(
      Object.entries(found).filter(([, message]) => message),
    )
    setErrors(problems)
    if (Object.keys(problems).length > 0) return

    setBusy(true)
    try {
      await createUserProfile(user, { displayName: nameValue, role, phone })
      navigate('/account', { replace: true })
    } catch (error) {
      setFormError(getAuthErrorMessage(error))
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthCard
      title="Finish setting up your account"
      subtitle={`You’re signed in as ${user.email}. Tell us how you’ll use Stayora.`}
      footer={
        <button type="button" onClick={() => logout()} className="font-semibold text-ink underline">
          Use a different account
        </button>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <RoleChoice value={role} onChange={setRole} />

        <TextField
          id="displayName"
          label="Full name"
          autoComplete="name"
          value={nameValue}
          onChange={(event) => setDisplayName(event.target.value)}
          error={errors.displayName}
        />
        <TextField
          id="phone"
          label={role === 'owner' ? 'Contact phone number' : 'Phone number (optional)'}
          type="tel"
          autoComplete="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          error={errors.phone}
        />

        {formError && <Alert variant="error">{formError}</Alert>}

        <Button type="submit" className="w-full py-3" disabled={busy}>
          {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          Continue
        </Button>
      </form>
    </AuthCard>
  )
}