// Turns 18000 into "Rs. 18,000"
export function formatLKR(amount) {
  return `Rs. ${new Intl.NumberFormat('en-LK').format(amount)}`
}

// Firestore stores dates as Timestamps. This returns a normal Date, or null.
export function toDate(value) {
  if (!value) return null
  if (typeof value.toDate === 'function') return value.toDate()
  if (value instanceof Date) return value
  return null
}

export function formatDate(value) {
  const date = toDate(value)
  if (!date) return 'Not specified'
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export function formatDateTime(value) {
  const date = toDate(value)
  if (!date) return 'Not specified'
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}