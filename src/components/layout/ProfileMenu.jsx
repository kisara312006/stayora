import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronDown, LayoutDashboard, LogOut, ShieldCheck, User } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { logout } from '../../services/authService'

const itemClass =
  'flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-charcoal hover:bg-cream focus-visible:outline-ink'

export default function ProfileMenu() {
  const { user, profile, isAdmin } = useAuth()
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef(null)
  const navigate = useNavigate()

  const name = profile?.displayName || user?.displayName || user?.email || 'Account'

  // Close on outside click or the Escape key
  useEffect(() => {
    if (!open) return undefined
    function handlePointer(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    function handleKey(event) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handlePointer)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handlePointer)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  async function handleLogout() {
    setOpen(false)
    navigate('/') // leave protected pages first, then sign out
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error.code)
    }
  }

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="true"
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-white/90 hover:bg-white/10"
      >
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gold text-sm font-bold text-navy">
          {name.charAt(0).toUpperCase()}
        </span>
        <span className="max-w-[8rem] truncate">{name}</span>
        <ChevronDown className="h-4 w-4" aria-hidden="true" />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-xl border border-taupe bg-surface py-1 shadow-lg">
          <div className="border-b border-taupe px-4 py-3">
            <p className="truncate text-sm font-semibold text-ink">{name}</p>
            <p className="truncate text-xs text-charcoal/70">{user?.email}</p>
          </div>
          <Link to="/account" onClick={() => setOpen(false)} className={itemClass}>
            <User className="h-4 w-4 text-gold" aria-hidden="true" />
            My account
          </Link>
          {profile?.role === 'owner' && (
            <Link to="/owner" onClick={() => setOpen(false)} className={itemClass}>
              <LayoutDashboard className="h-4 w-4 text-gold" aria-hidden="true" />
              Owner dashboard
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin" onClick={() => setOpen(false)} className={itemClass}>
              <ShieldCheck className="h-4 w-4 text-gold" aria-hidden="true" />
              Admin
            </Link>
          )}
          <button type="button" onClick={handleLogout} className={itemClass}>
            <LogOut className="h-4 w-4 text-gold" aria-hidden="true" />
            Log out
          </button>
        </div>
      )}
    </div>
  )
}