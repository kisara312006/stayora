import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import Alert from '../ui/Alert'
import Button from '../ui/Button'
import TextField from '../ui/TextField'
import { inputClass, labelClass } from '../ui/formStyles'
import ListingCard from '../listings/ListingCard'
import PhotoUploader from './PhotoUploader'
import StatusChip from './StatusChip'
import { useAuth } from '../../hooks/useAuth'
import {
  facilities,
  genderPolicies,
  propertyTypes,
  roomTypes,
} from '../../config/listingOptions'
import {
  createListing,
  saveListingEdits,
  setListingStatus,
} from '../../services/listingService'
import {
  MAX_PHOTOS,
  emptyForm,
  formToListingData,
  listingToForm,
  validateListingForm,
} from '../../utils/listingForm'

// Which save buttons to show depends on where the listing is in its life.
function actionsFor(status) {
  if (status === 'published') {
    return [{ label: 'Save and send for review', status: 'pending', primary: true }]
  }
  if (status === 'pending') {
    return [
      { label: 'Save changes', status: 'pending', primary: true },
      { label: 'Withdraw to draft', status: 'draft' },
    ]
  }
  return [
    { label: 'Save draft', status: 'draft' },
    { label: 'Submit for review', status: 'pending', primary: true },
  ]
}

const successText = {
  draft: 'Draft saved.',
  pending: 'Submitted for review. It will go live once it has been approved.',
}

function Section({ title, description, children }) {
  return (
    <section className="rounded-2xl border border-taupe bg-surface p-6 shadow-sm">
      <h2 className="text-xl">{title}</h2>
      {description && <p className="mt-1 text-sm text-charcoal/80">{description}</p>}
      <div className="mt-5 space-y-5">{children}</div>
    </section>
  )
}

function CheckGroup({ legend, hint, options, selected, onToggle, error }) {
  return (
    <fieldset data-error={error ? 'true' : undefined}>
      <legend className={labelClass}>{legend}</legend>
      {hint && <p className="mb-2 text-xs text-charcoal/70">{hint}</p>}
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((option) => (
          <label
            key={option.id}
            className="flex cursor-pointer items-center gap-2 text-sm text-charcoal"
          >
            <input
              type="checkbox"
              checked={selected.includes(option.id)}
              onChange={() => onToggle(option.id)}
              className="h-4 w-4 accent-navy"
            />
            {option.label}
          </label>
        ))}
      </div>
      {error && (
        <p role="alert" className="mt-1 text-sm text-danger">
          {error}
        </p>
      )}
    </fieldset>
  )
}

function TextArea({ id, label, error, hint, ...props }) {
  const describedBy =
    [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(' ') ||
    undefined
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <textarea
        id={id}
        name={id}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={describedBy}
        className={error ? inputClass.replace('border-taupe', 'border-danger') : inputClass}
        {...props}
      />
      {hint && (
        <p id={`${id}-hint`} className="mt-1 text-xs text-charcoal/70">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  )
}

function SelectField({ id, label, children, ...props }) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <select id={id} name={id} className={inputClass} {...props}>
        {children}
      </select>
    </div>
  )
}

export default function ListingForm({ listing }) {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [values, setValues] = useState(() => (listing ? listingToForm(listing) : { ...emptyForm }))
  const [errors, setErrors] = useState({})
  const [notice, setNotice] = useState(location.state?.notice ?? null)
  const [busy, setBusy] = useState('')
  const [showPreview, setShowPreview] = useState(false)

  const status = listing?.status ?? 'new'

  function handleChange(event) {
    const { name, value } = event.target
    setValues((previous) => ({ ...previous, [name]: value }))
  }

  function setFlag(name, checked) {
    setValues((previous) => ({ ...previous, [name]: checked }))
  }

  function toggleIn(name, id) {
    setValues((previous) => ({
      ...previous,
      [name]: previous[name].includes(id)
        ? previous[name].filter((item) => item !== id)
        : [...previous[name], id],
    }))
  }

  const addPhoto = (url) =>
    setValues((previous) =>
      previous.photos.length >= MAX_PHOTOS || previous.photos.includes(url)
        ? previous
        : { ...previous, photos: [...previous.photos, url] },
    )
  const removePhoto = (url) =>
    setValues((previous) => ({
      ...previous,
      photos: previous.photos.filter((item) => item !== url),
    }))
  const makeCover = (url) =>
    setValues((previous) => ({
      ...previous,
      photos: [url, ...previous.photos.filter((item) => item !== url)],
    }))

  async function save(targetStatus) {
    setNotice(null)
    const forSubmit = targetStatus === 'pending'
    const found = validateListingForm(values, { forSubmit })
    setErrors(found)

    if (Object.keys(found).length > 0) {
      setNotice({
        type: 'error',
        text: forSubmit
          ? 'This listing cannot be submitted yet. Please fix the highlighted fields.'
          : 'Please fix the highlighted fields.',
      })
      requestAnimationFrame(() => {
        document
          .querySelector('[aria-invalid="true"], [data-error="true"]')
          ?.scrollIntoView({ block: 'center', behavior: 'smooth' })
      })
      return
    }

    setBusy(targetStatus)
    try {
      const data = formToListingData(values, profile.displayName)

      if (listing) {
        await saveListingEdits(listing, data, targetStatus)
        navigate('/owner', {
          state: { notice: { type: 'success', text: successText[targetStatus] } },
        })
        return
      }

      // New listing: the rules only allow creating a draft, so submitting
      // is a second step. If it fails we open the saved draft, so a retry
      // cannot create a duplicate.
      const id = await createListing(user.uid, data)
      if (targetStatus === 'pending') {
        try {
          await setListingStatus(id, 'pending')
        } catch (error) {
          console.error('Draft saved, but submitting failed:', error.code ?? error.message)
          navigate(`/owner/listings/${id}/edit`, {
            replace: true,
            state: {
              notice: {
                type: 'error',
                text: 'Your listing was saved as a draft, but it could not be submitted. Please try submitting again.',
              },
            },
          })
          return
        }
      }
      navigate('/owner', {
        state: { notice: { type: 'success', text: successText[targetStatus] } },
      })
    } catch (error) {
      console.error('Could not save the listing:', error.code ?? error.message)
      setNotice({
        type: 'error',
        text:
          error.code === 'permission-denied'
            ? 'Saving was refused. Check that you are signed in as an active owner and that every field is valid.'
            : 'Could not save the listing. Please try again.',
      })
    } finally {
      setBusy('')
    }
  }

  const canPreview = values.title.trim().length >= 3 && Number(values.monthlyRent) > 0
  const previewListing =
    showPreview && canPreview
      ? {
          ...formToListingData(values, profile.displayName),
          id: 'preview',
          isDemo: false,
          verified: false,
          availabilityUpdatedAt: null,
        }
      : null

  return (
    <form onSubmit={(event) => event.preventDefault()} noValidate className="space-y-6">
      {listing && (
        <div className="flex flex-wrap items-center gap-3">
          <StatusChip listing={listing} />
          {listing.moderationNote && ['rejected', 'changesRequested'].includes(status) && (
            <p className="text-sm text-charcoal">
              <strong className="text-ink">Reviewer note:</strong> {listing.moderationNote}
            </p>
          )}
        </div>
      )}

      {status === 'published' && (
        <Alert variant="info">
          This listing is live. Saving changes sends it back for review, and it will not
          be public until it is approved again. To change room availability or pause it
          without review, use the controls on your dashboard instead.
        </Alert>
      )}

      <Section title="Basic details">
        <TextField
          id="title"
          label="Property title"
          maxLength={100}
          value={values.title}
          onChange={handleChange}
          error={errors.title}
          hint="For example: Furnished private room near the university."
        />
        <SelectField
          id="propertyType"
          label="Property category"
          value={values.propertyType}
          onChange={handleChange}
        >
          {propertyTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.label}
            </option>
          ))}
        </SelectField>
        <TextArea
          id="description"
          label="Description"
          rows={5}
          maxLength={3000}
          value={values.description}
          onChange={handleChange}
          error={errors.description}
          hint={`${values.description.length}/3000. At least 30 characters are needed to submit.`}
        />
      </Section>

      <Section
        title="Location"
        description="Only share an address you are happy to show publicly. A map pin will be added in a later phase."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            id="city"
            label="City"
            maxLength={60}
            value={values.city}
            onChange={handleChange}
            error={errors.city}
          />
          <TextField
            id="area"
            label="Area or neighbourhood"
            maxLength={60}
            value={values.area}
            onChange={handleChange}
            error={errors.area}
          />
        </div>
        <TextField
          id="publicAddress"
          label="Address shown to the public (optional)"
          maxLength={200}
          value={values.publicAddress}
          onChange={handleChange}
          error={errors.publicAddress}
        />
        <TextField
          id="nearUniversities"
          label="Nearby universities (optional)"
          value={values.nearUniversities}
          onChange={handleChange}
          hint="Separate with commas, e.g. SLIIT, University of Moratuwa."
        />
        <TextField
          id="nearWorkplaces"
          label="Nearby workplaces or business areas (optional)"
          value={values.nearWorkplaces}
          onChange={handleChange}
          hint="Separate with commas."
        />
      </Section>

      <Section title="Pricing">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            id="monthlyRent"
            label="Monthly rent (LKR)"
            type="number"
            min="0"
            step="500"
            inputMode="numeric"
            value={values.monthlyRent}
            onChange={handleChange}
            error={errors.monthlyRent}
          />
          <TextField
            id="depositAmount"
            label="Deposit (LKR, optional)"
            type="number"
            min="0"
            step="500"
            inputMode="numeric"
            value={values.depositAmount}
            onChange={handleChange}
            error={errors.depositAmount}
          />
        </div>
        <TextField
          id="additionalCharges"
          label="Additional charges (optional)"
          maxLength={200}
          value={values.additionalCharges}
          onChange={handleChange}
          error={errors.additionalCharges}
          hint="For example: electricity billed by usage."
        />
      </Section>

      <Section title="Rooms">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            id="totalRooms"
            label="Total rooms"
            type="number"
            min="1"
            step="1"
            inputMode="numeric"
            value={values.totalRooms}
            onChange={handleChange}
            error={errors.totalRooms}
          />
          <TextField
            id="availableRooms"
            label="Rooms available now"
            type="number"
            min="0"
            step="1"
            inputMode="numeric"
            value={values.availableRooms}
            onChange={handleChange}
            error={errors.availableRooms}
          />
        </div>
        <CheckGroup
          legend="Room types"
          options={roomTypes}
          selected={values.roomTypes}
          onToggle={(id) => toggleIn('roomTypes', id)}
          error={errors.roomTypes}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            id="availableFrom"
            label="Available from (optional)"
            type="date"
            value={values.availableFrom}
            onChange={handleChange}
          />
          <SelectField
            id="genderPolicy"
            label="Open to"
            value={values.genderPolicy}
            onChange={handleChange}
          >
            {genderPolicies.map((policy) => (
              <option key={policy.id} value={policy.id}>
                {policy.label}
              </option>
            ))}
          </SelectField>
        </div>
      </Section>

      <Section
        title="Facilities"
        description="Tick only what is really provided. Furnishing, bathroom type, kitchen access, meals and utilities are all covered here."
      >
        <CheckGroup
          legend="Facilities and inclusions"
          options={facilities}
          selected={values.facilities}
          onToggle={(id) => toggleIn('facilities', id)}
        />
      </Section>

      <Section title="House rules">
        <TextArea
          id="houseRules"
          label="Rules and restrictions (optional)"
          rows={4}
          value={values.houseRules}
          onChange={handleChange}
          hint="One rule per line, e.g. No smoking."
        />
      </Section>

      <Section
        title="Photos"
        description="Clear photos of the room, bathroom and building help people trust your listing."
      >
        <div data-error={errors.photos ? 'true' : undefined}>
          <PhotoUploader
            photos={values.photos}
            onAdd={addPhoto}
            onRemove={removePhoto}
            onMakeCover={makeCover}
          />
          {errors.photos && (
            <p role="alert" className="mt-2 text-sm text-danger">
              {errors.photos}
            </p>
          )}
        </div>
      </Section>

      <Section
        title="Public contact details"
        description="Your account phone number stays private. Anything you add below is visible to everyone who can see this listing."
      >
        <label className="flex cursor-pointer items-start gap-2 text-sm text-charcoal">
          <input
            type="checkbox"
            checked={values.publishPhone}
            onChange={(event) => setFlag('publishPhone', event.target.checked)}
            className="mt-0.5 h-4 w-4 accent-navy"
          />
          <span>Show a contact phone number on this listing (anyone will be able to see it).</span>
        </label>
        {values.publishPhone && (
          <>
            <TextField
              id="contactPhone"
              label="Public contact number"
              type="tel"
              autoComplete="tel"
              value={values.contactPhone}
              onChange={handleChange}
              error={errors.contactPhone}
            />
            <label className="flex cursor-pointer items-center gap-2 text-sm text-charcoal">
              <input
                type="checkbox"
                checked={values.whatsappEnabled}
                onChange={(event) => setFlag('whatsappEnabled', event.target.checked)}
                className="h-4 w-4 accent-navy"
              />
              Allow people to message this number on WhatsApp
            </label>
          </>
        )}
        <TextField
          id="publicContactEmail"
          label="Public contact email (optional)"
          type="email"
          value={values.publicContactEmail}
          onChange={handleChange}
          error={errors.publicContactEmail}
        />
      </Section>

      <Section title="Preview">
        <Button type="button" variant="outline" onClick={() => setShowPreview(!showPreview)}>
          {showPreview ? 'Hide preview' : 'Preview listing card'}
        </Button>
        {showPreview && !canPreview && (
          <p className="text-sm text-charcoal/80">
            Add a title and a monthly rent to see a preview.
          </p>
        )}
        {previewListing && (
          <div
            ref={(node) => {
              if (node) node.inert = true // a preview must not be clickable
            }}
            className="max-w-sm"
          >
            <ListingCard listing={previewListing} />
          </div>
        )}
      </Section>

      {notice && <Alert variant={notice.type}>{notice.text}</Alert>}

      <div className="flex flex-wrap gap-3">
        {actionsFor(status).map((action) => (
          <Button
            key={action.label}
            type="button"
            variant={action.primary ? 'primary' : 'outline'}
            disabled={busy !== ''}
            onClick={() => save(action.status)}
          >
            {busy === action.status && (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            )}
            {action.label}
          </Button>
        ))}
        <Button type="button" variant="outline" disabled={busy !== ''} onClick={() => navigate('/owner')}>
          Cancel
        </Button>
      </div>
    </form>
  )
}