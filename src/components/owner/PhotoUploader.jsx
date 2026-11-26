import { useState } from 'react'
import { ImagePlus, Star, X } from 'lucide-react'
import Alert from '../ui/Alert'
import { MAX_PHOTOS } from '../../utils/listingForm'
import {
  ACCEPTED_TYPES,
  MAX_PHOTO_MB,
  isCloudinaryConfigured,
  uploadPhoto,
  validatePhotoFile,
} from '../../services/cloudinaryService'

// "photos" is the list of URLs. The parent changes it through onAdd, onRemove
// and onMakeCover. The first photo is the cover.
export default function PhotoUploader({ photos, onAdd, onRemove, onMakeCover }) {
  const [uploads, setUploads] = useState([]) // { id, name, progress, error }
  const [message, setMessage] = useState('')

  if (!isCloudinaryConfigured) {
    return (
      <Alert variant="error">
        Photo uploads are not set up yet. Add <code>VITE_CLOUDINARY_CLOUD_NAME</code> and{' '}
        <code>VITE_CLOUDINARY_UPLOAD_PRESET</code> to your <code>.env</code> file, then
        restart <code>npm run dev</code>.
      </Alert>
    )
  }

  function patchUpload(id, changes) {
    setUploads((previous) =>
      previous.map((item) => (item.id === id ? { ...item, ...changes } : item)),
    )
  }

  function handleFiles(event) {
    const files = Array.from(event.target.files ?? [])
    event.target.value = '' // lets the same file be chosen again later
    setMessage('')
    if (files.length === 0) return

    const inProgress = uploads.filter((item) => !item.error).length
    const room = MAX_PHOTOS - photos.length - inProgress
    if (room <= 0) {
      setMessage(`A listing can have up to ${MAX_PHOTOS} photos.`)
      return
    }
    if (files.length > room) {
      setMessage(`Only ${room} more photo${room === 1 ? '' : 's'} can be added. The rest were skipped.`)
    }

    files.slice(0, room).forEach((file) => {
      const id = `${Date.now()}-${Math.random()}`
      const problem = validatePhotoFile(file)

      if (problem) {
        setUploads((previous) => [...previous, { id, name: file.name, progress: 0, error: problem }])
        return
      }

      setUploads((previous) => [...previous, { id, name: file.name, progress: 0, error: '' }])
      uploadPhoto(file, (progress) => patchUpload(id, { progress }))
        .then((url) => {
          onAdd(url)
          setUploads((previous) => previous.filter((item) => item.id !== id))
        })
        .catch((error) => patchUpload(id, { error: error.message }))
    })
  }

  function dismiss(id) {
    setUploads((previous) => previous.filter((item) => item.id !== id))
  }

  return (
    <div>
      <label className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-taupe bg-cream/50 p-6 text-center text-sm text-charcoal focus-within:ring-2 focus-within:ring-ink hover:border-ink">
        <ImagePlus className="h-8 w-8 text-gold" aria-hidden="true" />
        <span className="font-semibold text-ink">Choose photos to upload</span>
        <span className="text-xs text-charcoal/70">
          JPG, PNG or WebP, up to {MAX_PHOTO_MB} MB each, {MAX_PHOTOS} photos maximum.
          The first photo is the cover.
        </span>
        <input
          type="file"
          accept={ACCEPTED_TYPES.join(',')}
          multiple
          onChange={handleFiles}
          className="sr-only"
        />
      </label>

      {message && (
        <p role="status" className="mt-2 text-sm text-charcoal">
          {message}
        </p>
      )}

      {uploads.length > 0 && (
        <ul className="mt-4 space-y-2">
          {uploads.map((item) => (
            <li
              key={item.id}
              className="rounded-xl border border-taupe bg-surface p-3 text-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="min-w-0 break-words text-charcoal">{item.name}</span>
                {item.error && (
                  <button
                    type="button"
                    onClick={() => dismiss(item.id)}
                    aria-label={`Dismiss ${item.name}`}
                    className="shrink-0 text-charcoal/70 hover:text-ink"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
              </div>
              {item.error ? (
                <p role="alert" className="mt-1 text-danger">
                  {item.error}
                </p>
              ) : (
                <progress
                  value={item.progress}
                  max="100"
                  aria-label={`Uploading ${item.name}`}
                  className="mt-2 h-2 w-full"
                />
              )}
            </li>
          ))}
        </ul>
      )}

      {photos.length > 0 && (
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {photos.map((url, index) => (
            <li key={url} className="overflow-hidden rounded-xl border border-taupe bg-surface">
              <div className="relative">
                <img
                  src={url}
                  alt={`Listing photo ${index + 1}`}
                  className="h-32 w-full object-cover"
                />
                {index === 0 && (
                  <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-gold px-2 py-0.5 text-xs font-semibold text-navy">
                    <Star className="h-3 w-3" aria-hidden="true" />
                    Cover
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between gap-2 p-2 text-xs">
                {index > 0 ? (
                  <button
                    type="button"
                    onClick={() => onMakeCover(url)}
                    className="font-semibold text-ink underline"
                  >
                    Make cover
                  </button>
                ) : (
                  <span className="text-charcoal/70">Main photo</span>
                )}
                <button
                  type="button"
                  onClick={() => onRemove(url)}
                  aria-label={`Remove photo ${index + 1}`}
                  className="font-semibold text-danger underline"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}