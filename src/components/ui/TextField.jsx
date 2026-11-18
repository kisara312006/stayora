import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { inputClass, labelClass } from './formStyles'

// A labelled input with an error message and, for passwords, a show/hide button.
export default function TextField({
  id,
  label,
  error,
  hint,
  type = 'text',
  ...inputProps
}) {
  const [visible, setVisible] = useState(false)
  const isPassword = type === 'password'

  const describedBy =
    [hint ? `${id}-hint` : null, error ? `${id}-error` : null]
      .filter(Boolean)
      .join(' ') || undefined

  const fieldClass =
    (error ? inputClass.replace('border-taupe', 'border-danger') : inputClass) +
    (isPassword ? ' pr-11' : '')

  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={id}
          type={isPassword && visible ? 'text' : type}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={describedBy}
          className={fieldClass}
          {...inputProps}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible(!visible)}
            aria-label={visible ? 'Hide password' : 'Show password'}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-charcoal/70 hover:text-ink"
          >
            {visible ? (
              <EyeOff className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Eye className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        )}
      </div>
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