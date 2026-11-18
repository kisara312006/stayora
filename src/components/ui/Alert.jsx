import { AlertCircle, CheckCircle2, Info } from 'lucide-react'

const variants = {
  error: { Icon: AlertCircle, classes: 'border-danger text-danger', role: 'alert' },
  success: { Icon: CheckCircle2, classes: 'border-gold text-ink', role: 'status' },
  info: { Icon: Info, classes: 'border-taupe text-ink', role: 'status' },
}

export default function Alert({ variant = 'info', children, className = '' }) {
  const { Icon, classes, role } = variants[variant]
  return (
    <div
      role={role}
      className={`flex gap-3 rounded-xl border bg-surface p-4 text-sm ${classes} ${className}`}
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      <div>{children}</div>
    </div>
  )
}