import { useState } from 'react'
import Alert from '../ui/Alert'
import Button from '../ui/Button'
import { useAuth } from '../../hooks/useAuth'
import { resendVerificationEmail } from '../../services/authService'
import { getAuthErrorMessage } from '../../utils/authErrors'

// Shown on the account page until the email address has been verified.
export default function VerificationNotice() {
  const { emailVerified, refreshUser } = useAuth()
  const [message, setMessage] = useState(null)
  const [busy, setBusy] = useState(false)

  if (emailVerified) return null

  async function handleResend() {
    setBusy(true)
    setMessage(null)
    try {
      await resendVerificationEmail()
      setMessage({
        type: 'success',
        text: 'Verification email sent. Check your inbox and spam folder.',
      })
    } catch (error) {
      setMessage({ type: 'error', text: getAuthErrorMessage(error) })
    } finally {
      setBusy(false)
    }
  }

  async function handleCheck() {
    setBusy(true)
    setMessage(null)
    try {
      await refreshUser()
    } catch (error) {
      setMessage({ type: 'error', text: getAuthErrorMessage(error) })
    } finally {
      setBusy(false)
    }
  }

  return (
    <Alert variant="info">
      <p className="font-semibold">Please verify your email address.</p>
      <p className="mt-1">
        We sent a verification link to your inbox. Verified accounts are more
        trustworthy to owners and to other users.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button variant="outline" onClick={handleResend} disabled={busy}>
          Resend email
        </Button>
        <Button variant="outline" onClick={handleCheck} disabled={busy}>
          I’ve verified my email
        </Button>
      </div>
      {message && (
        <p
          role={message.type === 'error' ? 'alert' : 'status'}
          className={`mt-3 ${message.type === 'error' ? 'text-danger' : ''}`}
        >
          {message.text}
        </p>
      )}
    </Alert>
  )
}