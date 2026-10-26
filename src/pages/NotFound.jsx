import Container from '../components/ui/Container'
import Button from '../components/ui/Button'

export default function NotFound() {
  return (
    <Container className="max-w-2xl py-24 text-center">
      <p className="text-6xl font-extrabold text-gold">404</p>
        <h1 className="mt-4 text-3xl">We couldn’t find that page</h1>
      <p className="mt-3 text-charcoal/80">
        The address may be wrong, or the page may have moved.
      </p>
      <Button to="/" className="mt-8">
        Go to the home page
      </Button>
    </Container>
  )
}