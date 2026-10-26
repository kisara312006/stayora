import Container from '../ui/Container'
import Button from '../ui/Button'

export default function CtaSection() {
  return (
    <section className="pb-16">
      <Container>
        <div className="rounded-3xl bg-navy px-6 py-12 text-center sm:px-12">
          <h2 className="text-3xl text-white sm:text-4xl">
            Ready to find your perfect stay?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-white/80">
            Create a free account to save properties, track enquiries and earn
            StayPoints along the way.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Button to="/register" variant="gold" className="py-3 text-base">
              Create an account
            </Button>
            <Button to="/explore" variant="outlineLight" className="py-3 text-base">
              Browse accommodation
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}