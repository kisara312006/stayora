import { Trophy, Gamepad2, Sparkles } from 'lucide-react'
import Container from '../ui/Container'
import SectionHeading from '../ui/SectionHeading'
import Button from '../ui/Button'

const features = [
  {
    icon: Sparkles,
    title: 'StayPoints',
    text: 'Earn points for useful actions like completing your profile and saving properties.',
  },
  {
    icon: Trophy,
    title: 'Achievements',
    text: 'Unlock badges such as First Search, Smart Comparator and Profile Complete.',
  },
  {
    icon: Gamepad2,
    title: 'Mini-games',
    text: 'Play Room Match and the Stay Smart Quiz and learn how to rent safely.',
  },
]

export default function GamificationPreview() {
  return (
    <section className="bg-white py-16">
      <Container>
        <SectionHeading
          eyebrow="Play and learn"
          title="Make your search more rewarding"
          subtitle="Points have no cash value. They simply track your progress."
        />
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {features.map((f) => {
            const Icon = f.icon
            return (
              <li key={f.title} className="rounded-2xl bg-cream p-6">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-navy text-gold">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg">{f.title}</h3>
                <p className="mt-2 text-sm text-charcoal/80">{f.text}</p>
              </li>
            )
          })}
        </ul>
        <div className="mt-8 text-center">
          <Button to="/games" variant="outline">
            Visit the Games page
          </Button>
        </div>
      </Container>
    </section>
  )
}