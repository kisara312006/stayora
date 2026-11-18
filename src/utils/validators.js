// Each function returns an error message, or null when the value is fine.

export function validateName(value) {
  const text = value.trim()
  if (text.length < 2) return 'Please enter your name (at least 2 characters).'
  if (text.length > 80) return 'Name must be 80 characters or fewer.'
  return null
}

export function validateEmail(value) {
  return /^\S+@\S+\.\S+$/.test(value.trim())
    ? null
    : 'Please enter a valid email address.'
}

export function validatePassword(value) {
  if (value.length < 8) return 'Password must be at least 8 characters.'
  if (!/[A-Za-z]/.test(value) || !/[0-9]/.test(value)) {
    return 'Use at least one letter and one number.'
  }
  return null
}

export function validatePhone(value, { required = false } = {}) {
  const text = value.trim()
  if (!text) return required ? 'A contact number is required for property owners.' : null
  if (!/^\+?[0-9][0-9\s-]{6,18}$/.test(text)) {
    return 'Enter a valid phone number, e.g. 077 123 4567.'
  }
  return null
}