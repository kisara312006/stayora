import { Link } from 'react-router-dom'
import logoWhite from '../../assets/logo/logo-horizontal-white.png'

export default function AuthCard({ title, subtitle, children, footer }) {
  return (
    <div className="px-4 py-10 sm:py-16">
      <div className="mx-auto w-full max-w-lg overflow-hidden rounded-2xl border border-taupe bg-surface shadow-md">
        <div className="bg-navy px-6 py-5 text-center">
          <Link to="/" aria-label="Stayora home" className="inline-block">
            <img src={logoWhite} alt="Stayora" className="mx-auto h-10 w-auto" />
          </Link>
        </div>

        <div className="p-6 sm:p-8">
          <h1 className="text-2xl">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-charcoal/80">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>

        {footer && (
          <div className="border-t border-taupe bg-cream/60 px-6 py-4 text-center text-sm">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}