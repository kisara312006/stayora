import { ChevronDown } from 'lucide-react'
import Container from '../ui/Container'
import SectionHeading from '../ui/SectionHeading'

const faqs = [
  {
    q: 'How does Stayora AI find accommodation?',
    a: 'The assistant understands what you ask for, then searches the real listings stored in Stayora and ranks them against your budget, location, facilities and room type.',
  },
  {
    q: 'Can the AI make up properties or prices?',
    a: 'It is designed not to. It can only describe listings that exist in Stayora\u2019s database. If nothing matches, it should say so and suggest alternatives.',
  },
  {
    q: 'Does a verification badge mean a property is safe?',
    a: 'No. A badge means some checks were completed, but it does not guarantee that a property or owner is risk-free. Always visit and verify for yourself.',
  },
  {
    q: 'Should I pay a deposit before visiting?',
    a: 'No. Do not send money before you have seen the property, met or verified the owner, and understood the rental terms.',
  },
  {
    q: 'How up to date is availability?',
    a: 'Availability comes from the owner\u2019s latest update, and each listing shows when it was last changed. Confirm with the owner before travelling.',
  },
  {
    q: 'How do I list my property?',
    a: 'Register as a property owner, add your details and photos, and submit the listing for review. It goes live once approved.',
  },
]

export default function FaqSection() {
  return (
    <section id="faq" className="py-16">
      <Container className="max-w-3xl">
        <SectionHeading eyebrow="FAQ" title="Frequently asked questions" />
        <div className="mt-10 space-y-3">
          {faqs.map((item) => (
            <details
              key={item.q}
              className="group rounded-2xl border border-taupe bg-white p-5 shadow-sm"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-navy">
                {item.q}
                <ChevronDown
                  className="h-5 w-5 shrink-0 text-gold transition-transform duration-200 group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <p className="mt-3 text-charcoal/90">{item.a}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  )
}