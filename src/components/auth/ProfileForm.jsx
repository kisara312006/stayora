import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import TextField from '../ui/TextField'
import Alert from '../ui/Alert'
import Button from '../ui/Button'
import { inputClass, labelClass } from '../ui/formStyles'
import { propertyTypes } from '../../config/listingOptions'
import { updateUserProfile } from '../../services/authService'
import { getAuthErrorMessage } from '../../utils/authErrors'
import {
  parseLocations,
  validateBudget,
  validateName,
  validatePhone,
} from '../../utils/validators'

// Edits the fields a person is allowed to change. Points, level, role, suspension
// and verification can never be changed from here (the Security Rules block them).
export default function ProfileForm({ profile }) {
  const isOwner = profile.role === 'owner'
  const [values, setValues] = useState({
    displayName: profile.displayName ?? '',
    phone: profile.phone ?? '',
    preferredLocations: (profile.preferredLocations ?? []).join(', '),
    budgetMin: profile.budgetMin ?? '',
    budgetMax: profile.budgetMax ?? '',
    preferredType: profile.preferredType ?? '',
  })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState(null) // { type, text }
  const [busy, setBusy] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setValues((previous) => ({ ...previous, [name]: value }))
    setStatus(null)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setStatus(null)

    const found = {
      displayName: validateName(values.displayName),
      phone: validatePhone(values.phone, { required: isOwner }),
    }
    if (!isOwner) {
      found.budgetMin = validateBudget(values.budgetMin)
      found.budgetMax = validateBudget(values.budgetMax)
      if (
        !found.budgetMin &&
        !found.budgetMax &&
        values.budgetMin !== '' &&
        values.budgetMax !== '' &&
        Number(values.budgetMin) > Number(values.budgetMax)
      ) {
        found.budgetMax = 'Maximum budget must be at least the minimum.'
      }
    }
    const problems = Object.fromEntries(
      Object.entries(found).filter(([, message]) => message),
    )
    setErrors(problems)
    if (Object.keys(problems).length > 0) return

    const changes = {
      displayName: values.displayName.trim(),
      phone: values.phone.trim() || null,
    }
    if (!isOwner) {
      changes.preferredLocations = parseLocations(values.preferredLocations)
      changes.budgetMin = values.budgetMin === '' ? null : Number(values.budgetMin)
      changes.budgetMax = values.budgetMax === '' ? null : Number(values.budgetMax)
      changes.preferredType = values.preferredType
    }

    setBusy(true)
    try {
      await updateUserProfile(profile.id, changes)
      setStatus({ type: 'success', text: 'Profile saved.' })
    } catch (error) {
      setStatus({ type: 'error', text: getAuthErrorMessage(error) })
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          id="displayName"
          label="Full name"
          autoComplete="name"
          value={values.displayName}
          onChange={handleChange}
          error={errors.displayName}
        />
        <TextField
          id="phone"
          label={isOwner ? 'Contact phone number' : 'Phone number (optional)'}
          type="tel"
          autoComplete="tel"
          value={values.phone}
          onChange={handleChange}
          error={errors.phone}
        />
      </div>

      {!isOwner && (
        <>
          <TextField
            id="preferredLocations"
            label="Preferred locations"
            value={values.preferredLocations}
            onChange={handleChange}
            hint="Separate places with commas, e.g. Malabe, Kandy. Up to 10."
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              id="budgetMin"
              label="Minimum budget (LKR / month)"
              type="number"
              min="0"
              step="1000"
              inputMode="numeric"
              value={values.budgetMin}
              onChange={handleChange}
              error={errors.budgetMin}
            />
            <TextField
              id="budgetMax"
              label="Maximum budget (LKR / month)"
              type="number"
              min="0"
              step="1000"
              inputMode="numeric"
              value={values.budgetMax}
              onChange={handleChange}
              error={errors.budgetMax}
            />
          </div>
          <div>
            <label htmlFor="preferredType" className={labelClass}>
              Preferred accommodation type
            </label>
            <select
              id="preferredType"
              name="preferredType"
              value={values.preferredType}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">No preference</option>
              {propertyTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      {status && <Alert variant={status.type}>{status.text}</Alert>}

      <Button type="submit" disabled={busy}>
        {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        Save changes
      </Button>
    </form>
  )
}