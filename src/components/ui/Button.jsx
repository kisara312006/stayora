import { Link } from 'react-router-dom'

const base =
  'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60'

// "dark:" classes only apply in dark mode
const variants = {
  primary:
    'bg-navy text-white hover:bg-navy/90 dark:bg-gold dark:text-navy dark:hover:bg-gold/85',
  gold: 'bg-gold text-ink hover:bg-gold/85',
  outline:
    'border border-navy text-ink hover:bg-navy hover:text-white dark:border-ink/40',
  outlineLight: 'border border-white/40 text-white hover:bg-white/10',
}

export default function Button({
  to,
  variant = 'primary',
  className = '',
  children,
  ...props
}) {
  const classes = `${base} ${variants[variant]} ${className}`

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    )
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}