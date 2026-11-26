import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { LayoutGrid, List, SearchX, X } from 'lucide-react'
import Container from '../components/ui/Container'
import Button from '../components/ui/Button'
import Alert from '../components/ui/Alert'
import { inputClass } from '../components/ui/formStyles'
import FilterPanel from '../components/listings/FilterPanel'
import ListingCard from '../components/listings/ListingCard'
import ListingCardSkeleton from '../components/listings/ListingCardSkeleton'
import { usePublishedListings } from '../hooks/useListings'
import { categories } from '../config/categories'
import { applyFilters, typeChoices } from '../utils/listingFilters'
import { facilityLabel } from '../utils/listingHelpers'
import { formatLKR } from '../utils/format'

const PAGE_SIZE = 12
const filterKeys = ['location', 'type', 'maxBudget', 'category', 'facilities', 'available']
const sortChoices = [
  { value: 'newest', label: 'Newest first' },
  { value: 'priceLow', label: 'Price: low to high' },
  { value: 'priceHigh', label: 'Price: high to low' },
]

function readFilters(params) {
  return {
    location: params.get('location') ?? '',
    type: params.get('type') ?? '',
    maxBudget: params.get('maxBudget') ?? '',
    category: params.get('category') ?? '',
    facilities: (params.get('facilities') ?? '').split(',').filter(Boolean),
    available: params.get('available') === '1',
  }
}

// Remembers how many results to show. It is re-created whenever the address
// changes (see the "key" below), which resets it to the first page.
function Results({ results, view }) {
  const [visible, setVisible] = useState(PAGE_SIZE)
  const shown = results.slice(0, visible)

  return (
    <>
      <div
        className={view === 'list' ? 'grid gap-6' : 'grid gap-6 sm:grid-cols-2 xl:grid-cols-3'}
      >
        {shown.map((listing) => (
          <ListingCard key={listing.id} listing={listing} view={view} />
        ))}
      </div>
      {visible < results.length && (
        <div className="mt-8 text-center">
          <Button variant="outline" onClick={() => setVisible(visible + PAGE_SIZE)}>
            Show more ({results.length - visible} remaining)
          </Button>
        </div>
      )}
    </>
  )
}

export default function Explore() {
  const [params, setParams] = useSearchParams()

  const requestedSort = params.get('sort')
  const sort = sortChoices.some((choice) => choice.value === requestedSort)
    ? requestedSort
    : 'newest'
  const view = params.get('view') === 'list' ? 'list' : 'grid'
  const filters = readFilters(params)
  const hasFilters = filterKeys.some((key) => params.get(key))

  const { listings, loading, error, retry } = usePublishedListings(sort)
  const results = applyFilters(listings, filters)
  const queryKey = params.toString()

  // Changes some address parameters and keeps the rest
  function update(changes) {
    const next = new URLSearchParams(params)
    Object.entries(changes).forEach(([key, value]) => {
      const empty =
        value === '' || value === false || value === null || (Array.isArray(value) && value.length === 0)
      if (empty) next.delete(key)
      else next.set(key, Array.isArray(value) ? value.join(',') : value === true ? '1' : value)
    })
    setParams(next)
  }

  function clearFilters() {
    const next = new URLSearchParams(params)
    filterKeys.forEach((key) => next.delete(key))
    setParams(next)
  }

  const chips = []
  if (filters.location) chips.push({ id: 'location', label: `Location: ${filters.location}`, remove: () => update({ location: '' }) })
  if (filters.type) {
    const label = typeChoices.find((choice) => choice.value === filters.type)?.label ?? filters.type
    chips.push({ id: 'type', label, remove: () => update({ type: '' }) })
  }
  if (filters.category) {
    const label = categories.find((category) => category.id === filters.category)?.label ?? filters.category
    chips.push({ id: 'category', label, remove: () => update({ category: '' }) })
  }
  if (filters.maxBudget) chips.push({ id: 'budget', label: `Up to ${formatLKR(Number(filters.maxBudget) || 0)}`, remove: () => update({ maxBudget: '' }) })
  filters.facilities.forEach((id) =>
    chips.push({
      id: `facility-${id}`,
      label: facilityLabel(id),
      remove: () => update({ facilities: filters.facilities.filter((item) => item !== id) }),
    }),
  )
  if (filters.available) chips.push({ id: 'available', label: 'Rooms available', remove: () => update({ available: false }) })

  return (
    <>
      <section className="bg-navy py-12">
        <Container>
          <h1 className="text-4xl text-white">Explore accommodation</h1>
          <p className="mt-2 max-w-2xl text-lg text-white/80">
            Boarding rooms and hostels approved for public display. Availability comes
            from each owner’s latest update.
          </p>
        </Container>
      </section>

      <Container className="grid gap-8 py-10 lg:grid-cols-[18rem_1fr]">
        <aside>
          <FilterPanel
            key={queryKey}
            filters={filters}
            hasFilters={hasFilters}
            onApply={(draft) =>
              update({
                location: draft.location.trim(),
                type: draft.type,
                category: draft.category,
                maxBudget: draft.maxBudget,
                facilities: draft.facilities,
                available: draft.available,
              })
            }
            onClear={clearFilters}
          />
        </aside>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p role="status" className="text-sm text-charcoal/80">
              {loading
                ? 'Loading accommodation…'
                : error
                  ? ''
                  : `${results.length} result${results.length === 1 ? '' : 's'}`}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <label htmlFor="sort" className="sr-only">
                Sort by
              </label>
              <select
                id="sort"
                value={sort}
                onChange={(event) => update({ sort: event.target.value })}
                className={`${inputClass} w-auto`}
              >
                {sortChoices.map((choice) => (
                  <option key={choice.value} value={choice.value}>
                    {choice.label}
                  </option>
                ))}
              </select>

              <div className="flex shrink-0 overflow-hidden rounded-xl border border-taupe">
                <button
                  type="button"
                  onClick={() => update({ view: '' })}
                  aria-label="Grid view"
                  aria-pressed={view === 'grid'}
                  className={`p-2.5 ${view === 'grid' ? 'bg-navy text-white dark:bg-gold dark:text-navy' : 'bg-surface text-ink'}`}
                >
                  <LayoutGrid className="h-5 w-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => update({ view: 'list' })}
                  aria-label="List view"
                  aria-pressed={view === 'list'}
                  className={`p-2.5 ${view === 'list' ? 'bg-navy text-white dark:bg-gold dark:text-navy' : 'bg-surface text-ink'}`}
                >
                  <List className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          {chips.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="Active filters">
              {chips.map((chip) => (
                <li key={chip.id}>
                  <button
                    type="button"
                    onClick={chip.remove}
                    aria-label={`Remove filter: ${chip.label}`}
                    className="inline-flex items-center gap-1 rounded-full border border-taupe bg-surface px-3 py-1 text-xs font-medium text-ink hover:border-ink"
                  >
                    {chip.label}
                    <X className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="px-2 py-1 text-xs font-semibold text-ink underline"
                >
                  Clear all
                </button>
              </li>
            </ul>
          )}

          <div className="mt-6">
            {loading && (
              <div className={view === 'list' ? 'grid gap-6' : 'grid gap-6 sm:grid-cols-2 xl:grid-cols-3'}>
                {[0, 1, 2, 3, 4, 5].map((item) => (
                  <ListingCardSkeleton key={item} />
                ))}
              </div>
            )}

            {error && (
              <div className="space-y-3">
                <Alert variant="error">
                  We couldn’t load accommodation. Check your connection and try again.
                </Alert>
                <Button variant="outline" onClick={retry}>
                  Try again
                </Button>
              </div>
            )}

            {!loading && !error && listings.length === 0 && (
              <div className="rounded-2xl border border-taupe bg-surface p-10 text-center">
                <SearchX className="mx-auto h-10 w-10 text-gold" aria-hidden="true" />
                <h2 className="mt-3 text-xl">No accommodation published yet</h2>
                <p className="mt-1 text-charcoal/80">Please check back soon.</p>
              </div>
            )}

            {!loading && !error && listings.length > 0 && results.length === 0 && (
              <div className="rounded-2xl border border-taupe bg-surface p-10 text-center">
                <SearchX className="mx-auto h-10 w-10 text-gold" aria-hidden="true" />
                <h2 className="mt-3 text-xl">No listings match your filters</h2>
                <p className="mt-1 text-charcoal/80">
                  Try a higher budget, fewer facilities or a different location.
                </p>
                <Button variant="outline" onClick={clearFilters} className="mt-5">
                  Clear filters
                </Button>
              </div>
            )}

            {!loading && !error && results.length > 0 && (
              <Results key={queryKey} results={results} view={view} />
            )}
          </div>
        </div>
      </Container>
    </>
  )
}