import { Link } from 'react-router-dom'
import logoWhite from '../../assets/logo/logo-horizontal-white.png'
import Container from '../ui/Container'
import { siteConfig } from '../../config/siteConfig'
import { categories } from '../../config/categories'

const quickLinks = [
  { to: '/', label: 'Home' },
  { to: '/explore', label: 'Explore' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact Us' },
  { to: '/games', label: 'Games' },
  { to: '/safety', label: 'Help and Safety' },
]

const placeholder = (text) => (
  <span className="italic text-white/60">[{text}]</span>
)

export default function Footer() {
  const { contact, social } = siteConfig
  const socialLinks = [
    { label: 'Facebook', url: social.facebook },
    { label: 'Instagram', url: social.instagram },
    { label: 'LinkedIn', url: social.linkedin },
  ].filter((s) => s.url)

  return (
    <footer className="bg-navy text-white/85">
      <Container className="py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <img src={logoWhite} alt="Stayora" className="h-12 w-auto" />
            <p className="mt-4 text-sm leading-relaxed">
              Stayora helps university students and working professionals find
              suitable boarding rooms and hostels, with an AI assistant to guide
              the search.
            </p>
          </div>

          <div>
            <h2 className="text-base text-white">Quick links</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {quickLinks.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="hover:text-gold">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-base text-white">Explore categories</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link to={`/explore?category=${cat.id}`} className="hover:text-gold">
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-base text-white">Contact</h2>
            <ul className="mt-4 space-y-2 text-sm">
              <li>Email: {contact.email || placeholder('contact email to be added')}</li>
              <li>Phone: {contact.phone || placeholder('phone to be added')}</li>
              <li>Address: {contact.address || placeholder('address to be added')}</li>
            </ul>
            {socialLinks.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-4 text-sm">
                {socialLinks.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-gold"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <p className="mt-10 rounded-xl bg-white/5 p-4 text-xs leading-relaxed text-white/75">
          Safety reminder: verification badges do not guarantee that a property or
          owner is risk-free. Never send a deposit before you have visited the
          property and verified the owner.
        </p>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Stayora. All rights reserved.</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            <li>
              <Link to="/privacy" className="hover:text-gold">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-gold">
                Terms and Conditions
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-gold">
                Cookie and privacy information
              </Link>
            </li>
          </ul>
        </div>
      </Container>
    </footer>
  )
}