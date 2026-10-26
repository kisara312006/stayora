import { Link } from 'react-router-dom'
import { Sparkles, MessageCircle } from 'lucide-react'
import Container from '../ui/Container'
import Button from '../ui/Button'

// These are EXAMPLES of how to talk to the assistant. They do not mean
// that any particular property exists or is available.
const examplePrompts = [
  'I need a furnished room near SLIIT, with Wi-Fi, under Rs. 20,000 per month.',
  'Looking for a shared hostel room near a university, budget Rs. 12,000.',
  'Private room with an attached bathroom, available from next month.',
]

export default function AiPromoSection() {
  return (
    <section className="bg-white py-16">
      <Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-charcoal/70">
            <Sparkles className="h-4 w-4 text-gold" aria-hidden="true" />
            Meet Stayora AI
          </p>
          <h2 className="mt-2 text-3xl sm:text-4xl">
            Just say what you need, in plain language
          </h2>
          <p className="mt-4 text-lg text-charcoal/80">
            No forms to fill in. Describe your ideal place and Stayora AI will ask
            follow-up questions if something is missing, search real listings, and
            explain why each recommendation fits.
          </p>
          <ul className="mt-5 space-y-2 text-charcoal/90">
            <li>✔ Understands budget, location, room type and facilities</li>
            <li>✔ Recommends only properties stored in Stayora</li>
            <li>✔ Explains every match, and says so when nothing fits</li>
          </ul>
          <Button to="/assistant" className="mt-7">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Find My Perfect Stay with AI
          </Button>
        </div>

        <div className="rounded-3xl bg-cream p-6 sm:p-8">
          <h3 className="flex items-center gap-2 text-lg">
            <MessageCircle className="h-5 w-5 text-gold" aria-hidden="true" />
            Try asking something like…
          </h3>
          <ul className="mt-4 space-y-3">
            {examplePrompts.map((prompt) => (
              <li key={prompt}>
                <Link
                  to={`/assistant?prompt=${encodeURIComponent(prompt)}`}
                  className="block rounded-xl border border-taupe bg-white px-4 py-3 text-sm text-charcoal transition-colors hover:border-navy"
                >
                  “{prompt}”
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-charcoal/70">
            These are examples only. Results depend on the listings and
            availability currently in Stayora.
          </p>
        </div>
      </Container>
    </section>
  )
}