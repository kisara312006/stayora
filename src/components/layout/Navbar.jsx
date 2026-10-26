import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, Search } from 'lucide-react'
import logoWhite from '../../assets/logo/logo-horizontal-white.png'
import Button from '../ui/Button'
import Container from '../ui/Container'

const navLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/explore', label: 'Explore' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact Us' },
  { to: '/games', label: 'Games' },
]

const linkClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
    isActive
      ? 'text-gold underline decoration-2 underline-offset-8'
      : 'text-white/85 hover:text-white'
  }`

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const closeMenu = () => setOpen(false)

  // Phase 4 will replace Login/Register with a profile menu when signed in.
  return (
    <header className="sticky top-0 z-50 bg-navy shadow-md">
      <Container>
        <nav aria-label="Main" className="flex h-16 items-center justify-between">
          <Link to="/" aria-label="Stayora home" onClick={closeMenu}>
            <img src={logoWhite} alt="Stayora" className="h-10 w-auto" />
          </Link>

          {/* Desktop menu */}
          <ul className="hidden items-center gap-1 xl:flex">
            {navLinks.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} end={item.end} className={linkClass}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-3 xl:flex">
            <NavLink to="/login" className={linkClass}>
              Login
            </NavLink>
            <Button to="/register" variant="outlineLight">
              Register
            </Button>
            <Button to="/explore" variant="gold">
              <Search className="h-4 w-4" aria-hidden="true" />
              Find Accommodation
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="rounded-lg p-2 text-white hover:bg-white/10 xl:hidden"
          >
            {open ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </nav>
      </Container>

      {/* Mobile menu panel */}
      {open && (
        <div id="mobile-menu" className="border-t border-white/10 bg-navy xl:hidden">
          <Container className="py-4">
            <ul className="flex flex-col gap-1">
              {navLinks.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={linkClass}
                    onClick={closeMenu}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
              <li>
                <NavLink to="/login" className={linkClass} onClick={closeMenu}>
                  Login
                </NavLink>
              </li>
            </ul>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Button
                to="/register"
                variant="outlineLight"
                onClick={closeMenu}
                className="sm:flex-1"
              >
                Register
              </Button>
              <Button
                to="/explore"
                variant="gold"
                onClick={closeMenu}
                className="sm:flex-1"
              >
                <Search className="h-4 w-4" aria-hidden="true" />
                Find Accommodation
              </Button>
            </div>
          </Container>
        </div>
      )}
    </header>
  )
}