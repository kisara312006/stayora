import Container from '../components/ui/Container'
import Button from '../components/ui/Button'

export default function PlaceholderPage({ title, phase, description }) {
  return (
    <Container className="max-w-2xl py-24 text-center">
      <span className="inline-block rounded-full bg-gold px-3 py-1 text-sm font-semibold text-navy">
        Coming in {phase}
      </span>
      <h1 className="mt-5 text-4xl">{title}</h1>
      <p className="mt-4 text-lg text-charcoal/80">{description}</p>
      <Button to="/" className="mt-8">
        Back to home
      </Button>
    </Container>
  )
}