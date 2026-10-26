import Container from '../ui/Container'
import SectionHeading from '../ui/SectionHeading'

const steps = [
  {
    title: 'Tell us what you need',
    text: 'Describe your budget, location and must-haves, in your own words or with filters.',
  },
  {
    title: 'Discover suitable accommodation',
    text: 'Stayora ranks real listings against your needs and explains why they fit.',
  },
  {
    title: 'Compare your options',
    text: 'Save favourites and compare prices, facilities and availability side by side.',
  },
  {
    title: 'Contact the owner',
    text: 'Send an enquiry through Stayora, then visit and verify before you commit.',
  },
]

export default function HowItWorks() {
  return (
    <section className="py-16">
      <Container>
        <SectionHeading eyebrow="How Stayora works" title="Four simple steps" />
        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="rounded-2xl border border-taupe bg-white p-6 shadow-sm"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gold text-lg font-bold text-navy">
                {index + 1}
              </span>
              <h3 className="mt-4 text-lg">{step.title}</h3>
              <p className="mt-2 text-sm text-charcoal/80">{step.text}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  )
}