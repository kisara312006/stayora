import { useNavigate } from 'react-router-dom'
import Container from '../components/ui/Container'
import Button from '../components/ui/Button'
import VerificationNotice from '../components/auth/VerificationNotice'
import { useAuth } from '../hooks/useAuth'
import { logout } from '../services/authService'

const roleLabels = { seeker: 'Accommodation seeker', owner: 'Property owner' }

const verificationLabels = {
  none: 'Not verified',
  pending: 'Verification pending',
  verified: 'Verified',
  rejected: 'Verification rejected',
}

export default function Profile() {
  const { profile } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    navigate('/')
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error.code)
    }
  }

  return (
    <Container className="max-w-3xl py-12">
      <h1 className="text-3xl">My account</h1>
      <p className="mt-1 text-charcoal/80">Signed in as {profile.email}</p>

      <div className="mt-6">
        <VerificationNotice />
      </div>

      <section className="mt-6 rounded-2xl border border-taupe bg-surface p-6 shadow-sm">
        <h2 className="text-xl">Profile</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-charcoal/70">Name</dt>
            <dd className="font-medium text-ink">{profile.displayName}</dd>
          </div>
          <div>
            <dt className="text-sm text-charcoal/70">Account type</dt>
            <dd className="font-medium text-ink">
              {roleLabels[profile.role] ?? profile.role}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-charcoal/70">Phone</dt>
            <dd className="font-medium text-ink">{profile.phone || 'Not added'}</dd>
          </div>
          {profile.role === 'owner' && (
            <div>
              <dt className="text-sm text-charcoal/70">Owner verification</dt>
              <dd className="font-medium text-ink">
                {verificationLabels[profile.ownerVerificationStatus] ?? 'Not verified'}
              </dd>
            </div>
          )}
          <div>
            <dt className="text-sm text-charcoal/70">StayPoints</dt>
            <dd className="font-medium text-ink">
              {profile.points} (level {profile.level})
            </dd>
          </div>
        </dl>
      </section>

      <Button variant="outline" onClick={handleLogout} className="mt-6">
        Log out
      </Button>
    </Container>
  )
}