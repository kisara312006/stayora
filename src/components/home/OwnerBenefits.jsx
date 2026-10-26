import Container from '../ui/Container'
import SectionHeading from '../ui/SectionHeading'
import Button from '../ui/Button'

const benefits = [
  'Reach students and professionals actively searching for a place',
  'Update room availability so enquiries are accurate',
  'Receive and answer enquiries in one dashboard',
  'Get a verification badge after review',
]

const publishSteps = [
  'Register as a property owner',
  'Add your property details and photos',
  'Submit for review by the Stayora team',
  'Go live, then keep availability up to date',
]

export default function OwnerBenefits() {
  return (
    <section className="py-16">
      <Container>
        <SectionHeading
          eyebrow="For property owners"
          title="List your boarding place or hostel"
          subtitle="Publish your property and connect with people looking for a place like yours."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-taupe bg-white p-6 shadow-sm">
            <h3 className="text-xl">Benefits</h3>
            <ul className="mt-4 space-y-3 text-charcoal/90">
              {benefits.map((b) => (
                <li key={b} className="flex gap-3">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gold" aria-hidden="true" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-taupe bg-white p-6 shadow-sm">
            <h3 className="text-xl">How to publish a listing</h3>
            <ol className="mt-4 space-y-3 text-charcoal/90">
              {publishSteps.map((s, i) => (
                <li key={s} className="flex gap-3">
                  <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold text-sm font-bold text-navy">
                    {i + 1}
                  </span>
                  {s}
                </li>
              ))}
            </ol>
            <Button to="/register" className="mt-6">
              Register as an owner
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}