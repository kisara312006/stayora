import { Link } from 'react-router-dom'
import Container from '../ui/Container'
import SectionHeading from '../ui/SectionHeading'
import { categories } from '../../config/categories'

export default function CategoriesSection() {
  return (
    <section className="bg-taupe/40 py-16">
      <Container>
        <SectionHeading
          eyebrow="Browse by category"
          title="Whatever your situation, start here"
        />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => {
            const Icon = cat.icon
            return (
              <li key={cat.id}>
                <Link
                  to={`/explore?category=${cat.id}`}
                  className="flex h-full flex-col rounded-2xl border border-taupe bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md"
                >
                  <span className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-navy text-gold">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <span className="font-semibold text-navy">{cat.label}</span>
                  <span className="mt-1 text-sm text-charcoal/80">
                    {cat.description}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </Container>
    </section>
  )
}