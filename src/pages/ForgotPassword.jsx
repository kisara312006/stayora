import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import AuthCard from '../components/auth/AuthCard'
import TextField from '../components/ui/TextField'
import Alert from '../components/ui/Alert'
import Button from '../components/ui/Button'
import { requestPasswordReset } from '../services/authService'
import { getAuthErrorMessage } from '../utils/authErrors'
import { validateEmail } from '../utils/validators'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [fieldError, setFieldError] = useState('')
  const [formError, setFormError] = useState('')
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setFormError('')

    const problem = validateEmail(email)
    setFieldError(problem ?? '')
    if (problem) return

    setBusy(true)
    try {
      await requestPasswordReset(email)
      setSent(true)
    } catch (error) {
      // We show the same message whether or not the email has an account,
      // so nobody can use this page to find out who is registered.
      if (error?.code === 'auth/user-not-found') {
        setSent(true)
      } else {
        setFormError(getAuthErrorMessage(error))
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthCard
      title="Reset your password"
      subtitle="Enter your email and we will send you a link to choose a new password."
      footer={
        <Link to="/login" className="font-semibold text-ink underline">
          Back to log in
        </Link>
      }
    >
      {sent ? (
        <div className="space-y-4">
          <Alert variant="success">
            <p className="font-semibold">Check your inbox</p>
            <p className="mt-1">
              If an account exists for <strong>{email.trim()}</strong>, a password
              reset link is on its way. It may take a few minutes, so check your
              spam folder too.
            </p>
          </Alert>
          <Button variant="outline" onClick={() => setSent(false)}>
            Use a different email
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <TextField
            id="email"
            label="Email address"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            error={fieldError || undefined}
          />

          {formError && <Alert variant="error">{formError}</Alert>}

          <Button type="submit" className="w-full py-3" disabled={busy}>
            {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            Send reset link
          </Button>
        </form>
      )}
    </AuthCard>
  )
}