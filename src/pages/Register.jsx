import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import AuthCard from '../components/auth/AuthCard'
import GoogleButton from '../components/auth/GoogleButton'
import RoleChoice from '../components/auth/RoleChoice'
import TextField from '../components/ui/TextField'
import Alert from '../components/ui/Alert'
import Button from '../components/ui/Button'
import { useAuth } from '../hooks/useAuth'
import { registerWithEmail, signInWithGoogle } from '../services/authService'
import { getAuthErrorMessage, isSilentAuthError } from '../utils/authErrors'
import {
  validateEmail,
  validateName,
  validatePassword,
  validatePhone,
} from '../utils/validators'

const initialValues = {
  role: 'seeker',
  displayName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
}

export default function Register() {
  const { user, profile, authLoading } = useAuth()
  const navigate = useNavigate()
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [busy, setBusy] = useState('') // '', 'email' or 'google'

  // Already signed in? No need to register again.
  if (!authLoading && user && profile) return <Navigate to="/account" replace />

  function handleChange(event) {
    const { name, value } = event.target
    setValues((previous) => ({ ...previous, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setFormError('')

    const found = {
      displayName: validateName(values.displayName),
      email: validateEmail(values.email),
      phone: validatePhone(values.phone, { required: values.role === 'owner' }),
      password: validatePassword(values.password),
      confirmPassword:
        values.password === values.confirmPassword ? null : 'Passwords do not match.',
    }
    const problems = Object.fromEntries(
      Object.entries(found).filter(([, message]) => message),
    )
    setErrors(problems)
    if (Object.keys(problems).length > 0) return

    setBusy('email')
    try {
      const { profileCreated } = await registerWithEmail(values)
      navigate(profileCreated ? '/account' : '/complete-profile', { replace: true })
    } catch (error) {
      setFormError(getAuthErrorMessage(error))
    } finally {
      setBusy('')
    }
  }

  async function handleGoogle() {
    setFormError('')
    setBusy('google')
    try {
      await signInWithGoogle({ role: values.role })
      navigate('/account', { replace: true })
    } catch (error) {
      if (!isSilentAuthError(error)) setFormError(getAuthErrorMessage(error))
    } finally {
      setBusy('')
    }
  }

  const isOwner = values.role === 'owner'

  return (
    <AuthCard
      title="Create your account"
      subtitle="Join Stayora to search, save and manage accommodation."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-ink underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <RoleChoice
          value={values.role}
          onChange={(role) => setValues((previous) => ({ ...previous, role }))}
        />

        <TextField
          id="displayName"
          label="Full name"
          autoComplete="name"
          value={values.displayName}
          onChange={handleChange}
          error={errors.displayName}
        />
        <TextField
          id="email"
          label="Email address"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={handleChange}
          error={errors.email}
        />
        <TextField
          id="phone"
          label={isOwner ? 'Contact phone number' : 'Phone number (optional)'}
          type="tel"
          autoComplete="tel"
          value={values.phone}
          onChange={handleChange}
          error={errors.phone}
          hint={
            isOwner
              ? 'Needed to publish listings. It is only made public if you choose.'
              : undefined
          }
        />
        <TextField
          id="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
          hint="At least 8 characters, with a letter and a number."
        />
        <TextField
          id="confirmPassword"
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          value={values.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
        />

        {formError && <Alert variant="error">{formError}</Alert>}

        <Button type="submit" className="w-full py-3" disabled={busy !== ''}>
          {busy === 'email' && (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          )}
          Create account
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-charcoal/70">
        <span className="h-px flex-1 bg-taupe" />
        or
        <span className="h-px flex-1 bg-taupe" />
      </div>

      <GoogleButton
        onClick={handleGoogle}
        disabled={busy !== ''}
        busy={busy === 'google'}
      >
        Sign up with Google
      </GoogleButton>
      <p className="mt-2 text-center text-xs text-charcoal/70">
        Google sign-up uses the account type selected above.
      </p>

      <p className="mt-6 text-center text-xs text-charcoal/70">
        By creating an account you agree to our{' '}
        <Link to="/terms" className="underline">
          Terms
        </Link>{' '}
        and{' '}
        <Link to="/privacy" className="underline">
          Privacy Policy
        </Link>
        .
      </p>
    </AuthCard>
  )
}