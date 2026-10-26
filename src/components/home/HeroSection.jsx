import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Search, MapPin, Wallet, Sparkles } from 'lucide-react'
import Container from '../ui/Container'
import Button from '../ui/Button'
import { inputClass, labelClass } from '../ui/formStyles'

const typeOptions = [
  { value: '', label: 'Any type' },
  { value: 'boarding', label: 'Boarding room' },
  { value: 'hostel', label: 'Hostel' },
  { value: 'private-room', label: 'Private room' },
  { value: 'shared-room', label: 'Shared room' },
]

export default function HeroSection() {
  const navigate = useNavigate()
  const [location, setLocation] = useState('')
  const [type, setType] = useState('')
  const [budget, setBudget] = useState('')

  // Sends the search to the Explore page as address-bar parameters.
  // Phase 6 will read these parameters and filter real listings.
  function handleSubmit(event) {
    event.preventDefault()
    const params = new URLSearchParams()
    if (location.trim()) params.set('location', location.trim())
    if (type) params.set('type', type)
    if (budget) params.set('maxBudget', budget)
    navigate(`/explore?${params.toString()}`)
  }

  return (
    <section className="bg-navy">
      <Container className="grid gap-10 py-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-20">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-gold">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            AI-powered accommodation search
          </p>
          <h1 className="mt-5 text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl">
            Find Your Perfect Stay.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/80">
            Stayora helps university students and working professionals discover
            boarding rooms and hostels that fit their budget, location and needs,
            with an AI assistant that does the searching for you.
          </p>

          <form
            onSubmit={handleSubmit}
            aria-label="Search accommodation"
            className="mt-8 grid gap-3 rounded-2xl bg-white p-4 shadow-lg sm:grid-cols-2 sm:p-5"
          >
            <div className="sm:col-span-2">
              <label htmlFor="hero-location" className={labelClass}>
                Location
              </label>
              <div className="relative">
                <MapPin
                  className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gold"
                  aria-hidden="true"
                />
                <input
                  id="hero-location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, area, university or workplace"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>

            <div>
              <label htmlFor="hero-type" className={labelClass}>
                Accommodation type
              </label>
              <select
                id="hero-type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className={inputClass}
              >
                {typeOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="hero-budget" className={labelClass}>
                Max monthly budget (LKR)
              </label>
              <div className="relative">
                <Wallet
                  className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gold"
                  aria-hidden="true"
                />
                <input
                  id="hero-budget"
                  type="number"
                  min="0"
                  step="1000"
                  inputMode="numeric"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="e.g. 20000"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>

            <Button type="submit" className="sm:col-span-2 py-3 text-base">
              <Search className="h-5 w-5" aria-hidden="true" />
              Search
            </Button>
          </form>
        </div>

        {/* Prominent AI entry point */}
        <div className="rounded-3xl border border-gold/40 bg-white/5 p-6 sm:p-8">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-gold">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Stayora AI
          </p>
          <h2 className="mt-3 text-2xl text-white sm:text-3xl">
            Not sure where to stay?
          </h2>
          <p className="mt-3 text-white/80">
            Tell Stayora AI what you need, and let it find your perfect match.
          </p>

          <div className="mt-6 space-y-3" aria-label="Example conversation">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/60">
              Example conversation
            </p>
            <div className="ml-auto max-w-[90%] rounded-2xl rounded-br-sm bg-gold px-4 py-3 text-sm text-navy">
              I need a furnished room near SLIIT, with Wi-Fi, under Rs. 20,000 per
              month.
            </div>
            <div className="max-w-[90%] rounded-2xl rounded-bl-sm bg-white px-4 py-3 text-sm text-charcoal">
              I can help you find a suitable place. Would you prefer a private room
              or a shared room?
            </div>
          </div>

          <Button
            to="/assistant"
            variant="gold"
            className="mt-6 w-full py-3 text-base"
          >
            <Sparkles className="h-5 w-5" aria-hidden="true" />
            Find My Perfect Stay with AI
          </Button>
          <p className="mt-3 text-xs text-white/60">
            The AI only recommends properties that exist in Stayora's database.{' '}
            <Link to="/explore" className="underline hover:text-gold">
              Prefer to search manually?
            </Link>
          </p>
        </div>
      </Container>
    </section>
  )
}