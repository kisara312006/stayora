import Container from '../components/ui/Container'
import SectionHeading from '../components/ui/SectionHeading'
import Button from '../components/ui/Button'

export default function About() {
  return (
    <>
      <section className="bg-navy py-14">
        <Container className="max-w-3xl text-center">
          <h1 className="text-4xl text-white sm:text-5xl">About Stayora</h1>
          <p className="mt-4 text-lg text-white/80">
            Making it easier to find a safe, suitable place to stay.
          </p>
        </Container>
      </section>

      <Container className="max-w-4xl space-y-14 py-16">
        <section>
          <SectionHeading align="left" title="Our mission" />
          <p className="mt-4 text-lg text-charcoal/90">
            Finding a boarding room or hostel can be slow, confusing and
            sometimes risky. Stayora brings listings, availability and an AI
            assistant together so that students and working professionals can
            find suitable accommodation faster, and with more confidence.
          </p>
        </section>

        <section>
          <SectionHeading align="left" title="Who Stayora is for" />
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-taupe bg-white p-6">
              <h3 className="text-lg">Accommodation seekers</h3>
              <p className="mt-2 text-charcoal/80">
                University students and working professionals looking for a
                boarding room or hostel that fits their budget and routine.
              </p>
            </div>
            <div className="rounded-2xl border border-taupe bg-white p-6">
              <h3 className="text-lg">Property owners</h3>
              <p className="mt-2 text-charcoal/80">
                Owners of boarding places and hostels who want to publish their
                property and manage availability and enquiries.
              </p>
            </div>
          </div>
        </section>

        <section>
          <SectionHeading align="left" title="How our AI works responsibly" />
          <ul className="mt-4 list-disc space-y-2 pl-6 text-charcoal/90">
            <li>The assistant only recommends listings that exist in Stayora.</li>
            <li>Rankings come from a transparent scoring method, not guesswork.</li>
            <li>It does not use sensitive personal attributes to rank results.</li>
            <li>If no property fits, it tells you rather than inventing one.</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-gold bg-white p-6">
          <h2 className="text-xl">Safety first</h2>
          <p className="mt-2 text-charcoal/90">
            Verification badges show that some checks were completed. They do not
            guarantee that a property or owner is risk-free. Always visit the
            property and verify the owner before paying any deposit.
          </p>
        </section>

        {/* Replace this block with your real story when you are ready */}
        <section className="rounded-2xl border border-dashed border-taupe p-6 text-charcoal/70">
          <h2 className="text-xl">Our story</h2>
          <p className="mt-2 italic">
            [Placeholder: add your project story, team and contact details here.]
          </p>
        </section>

        <div className="text-center">
          <Button to="/explore">Start exploring</Button>
        </div>
      </Container>
    </>
  )
}