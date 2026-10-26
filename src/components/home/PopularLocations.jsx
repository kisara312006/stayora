import { Link } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import Container from '../ui/Container'
import SectionHeading from '../ui/SectionHeading'

// A starter list of areas near well-known campuses.
// Later this can be replaced with areas that actually have the most listings.
const areas = ['Malabe', 'Colombo', 'Kandy', 'Galle', 'Kelaniya', 'Moratuwa', 'Peradeniya', 'Matara']

export default function PopularLocations() {
  return (
    <section className="bg-taupe/40 py-16">
      <Container>
        <SectionHeading
          eyebrow="Explore by area"
          title="Start with an area you know"
          subtitle="Search places near major universities and business districts."
        />
        <ul className="mt-8 flex flex-wrap justify-center gap-3">
          {areas.map((area) => (
            <li key={area}>
              <Link
                to={`/explore?location=${encodeURIComponent(area)}`}
                className="inline-flex items-center gap-2 rounded-full border border-taupe bg-white px-4 py-2 text-sm font-medium text-navy transition-colors hover:border-navy"
              >
                <MapPin className="h-4 w-4 text-gold" aria-hidden="true" />
                {area}
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}