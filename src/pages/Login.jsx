import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import AuthCard from '../components/auth/AuthCard'
import GoogleButton from '../components/auth/GoogleButton'
import TextField from '../components/ui/TextField'
import Alert from '../components/ui/Alert'
import Button from '../components/ui/Button'
import { useAuth } from '../hooks/useAuth'
import { loginWithEmail, signInWithGoogle } from '../services/authService'
import { getAuthErrorMessage, isSilentAuthError } from '../utils/authErrors'
import { validateEmail } from '../utils/validators'

export default function Login() {
  const { user, profile, authLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [values, setValues] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [busy, setBusy] = useState('')

  // Send people back to the page they were trying to open before logging in
  const from = location.state?.from
  const redirectTo = from ? `${from.pathname}${from.search ?? ''}` : '/account'

  if (!authLoading && user && profile) return <Navigate to={redirectTo} replace />

  function handleChange(event) {
    const { name, value } = event.target
    setValues((previous) => ({ ...previous, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setFormError('')

    const problems = {}
    const emailProblem = validateEmail(values.email)
    if (emailProblem) problems.email = emailProblem
    if (!values.password) problems.password = 'Please enter your password.'
    setErrors(problems)
    if (Object.keys(problems).length > 0) return

    setBusy('email')
    try {
      await loginWithEmail(values.email, values.password)
      navigate(redirectTo, { replace: true })
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
      const { needsProfile } = await signInWithGoogle()
      navigate(needsProfile ? '/complete-profile' : redirectTo, { replace: true })
    } catch (error) {
      if (!isSilentAuthError(error)) setFormError(getAuthErrorMessage(error))
    } finally {
      setBusy('')
    }
  }

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Log in to your Stayora account."
      footer={
        <>
          New to Stayora?{' '}
          <Link to="/register" className="font-semibold text-ink underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
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
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
        />

        <div className="text-right">
          <Link to="/forgot-password" className="text-sm font-medium text-ink underline">
            Forgot your password?
          </Link>
        </div>

        {formError && <Alert variant="error">{formError}</Alert>}

        <Button type="submit" className="w-full py-3" disabled={busy !== ''}>
          {busy === 'email' && (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          )}
          Log in
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
        Continue with Google
      </GoogleButton>
    </AuthCard>
  )
}