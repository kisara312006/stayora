import { Sparkles, Clock, BadgeCheck, Heart, ShieldCheck, Wallet } from 'lucide-react'
import Container from '../ui/Container'
import SectionHeading from '../ui/SectionHeading'

const reasons = [
  {
    icon: Sparkles,
    title: 'AI that explains itself',
    text: 'Every recommendation comes with the reasons it matches your needs.',
  },
  {
    icon: Clock,
    title: 'Availability you can trust',
    text: 'Listings show the owner\u2019s latest availability update and when it was made.',
  },
  {
    icon: BadgeCheck,
    title: 'Verification status',
    text: 'See which owners and listings have been reviewed. A badge helps, but it is never a guarantee.',
  },
  {
    icon: Wallet,
    title: 'Clear pricing',
    text: 'Monthly rent, deposits and extra charges in one place, in LKR.',
  },
  {
    icon: Heart,
    title: 'Save and compare',
    text: 'Shortlist favourites and compare them before you make contact.',
  },
  {
    icon: ShieldCheck,
    title: 'Safety first',
    text: 'Report suspicious listings and follow our guidance for safe renting.',
  },
]

export default function WhyChoose() {
  return (
    <section className="py-16">
      <Container>
        <SectionHeading
          eyebrow="Why choose Stayora?"
          title="Built around how people really search"
        />
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((item) => {
            const Icon = item.icon
            return (
              <li
                key={item.title}
                className="rounded-2xl border border-taupe bg-white p-6 shadow-sm"
              >
                <Icon className="h-7 w-7 text-gold" aria-hidden="true" />
                <h3 className="mt-3 text-lg">{item.title}</h3>
                <p className="mt-2 text-sm text-charcoal/80">{item.text}</p>
              </li>
            )
          })}
        </ul>
      </Container>
    </section>
  )
}