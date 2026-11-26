const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

const isReal = (value) => Boolean(value) && !value.startsWith('your-')

export const isCloudinaryConfigured = isReal(cloudName) && isReal(uploadPreset)

export const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
export const MAX_PHOTO_MB = 5

// Checks run in the browser. The upload preset adds server-side checks.
export function validatePhotoFile(file) {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return `${file.name}: only JPG, PNG or WebP images are allowed.`
  }
  if (file.size > MAX_PHOTO_MB * 1024 * 1024) {
    return `${file.name}: the file is larger than ${MAX_PHOTO_MB} MB.`
  }
  return null
}

// Uploads one image and resolves with its https URL.
// We use XMLHttpRequest because it can report upload progress.
export function uploadPhoto(file, onProgress) {
  return new Promise((resolve, reject) => {
    if (!isCloudinaryConfigured) {
      reject(new Error('Photo uploads are not configured.'))
      return
    }

    const request = new XMLHttpRequest()
    request.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`)

    request.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100))
      }
    }

    request.onload = () => {
      try {
        const body = JSON.parse(request.responseText)
        const url = body.secure_url
        if (
          request.status >= 200 &&
          request.status < 300 &&
          typeof url === 'string' &&
          url.startsWith('https://res.cloudinary.com/')
        ) {
          resolve(url)
        } else {
          reject(new Error(body?.error?.message || 'The upload was rejected.'))
        }
      } catch {
        reject(new Error('The upload failed. Please try again.'))
      }
    }
    request.onerror = () => reject(new Error('Network problem during the upload.'))

    const form = new FormData()
    form.append('file', file)
    form.append('upload_preset', uploadPreset)
    request.send(form)
  })
}