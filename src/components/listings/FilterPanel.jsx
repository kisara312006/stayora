import { useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import Button from '../ui/Button'
import { inputClass, labelClass } from '../ui/formStyles'
import { categories } from '../../config/categories'
import { facilities } from '../../config/listingOptions'
import { typeChoices } from '../../utils/listingFilters'

// The panel keeps a draft of what you typed. Nothing changes until you press Apply.
export default function FilterPanel({ filters, hasFilters, onApply, onClear }) {
  const [draft, setDraft] = useState(filters)

  function setField(name, value) {
    setDraft((previous) => ({ ...previous, [name]: value }))
  }

  function toggleFacility(id) {
    setDraft((previous) => ({
      ...previous,
      facilities: previous.facilities.includes(id)
        ? previous.facilities.filter((item) => item !== id)
        : [...previous.facilities, id],
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    onApply(draft)
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Filter accommodation"
      className="space-y-5 rounded-2xl border border-taupe bg-surface p-5 shadow-sm"
    >
      <h2 className="flex items-center gap-2 text-lg">
        <SlidersHorizontal className="h-5 w-5 text-gold" aria-hidden="true" />
        Filters
      </h2>

      <div>
        <label htmlFor="f-location" className={labelClass}>
          Location, university or workplace
        </label>
        <input
          id="f-location"
          type="text"
          value={draft.location}
          onChange={(event) => setField('location', event.target.value)}
          placeholder="e.g. Malabe"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="f-type" className={labelClass}>
          Accommodation type
        </label>
        <select
          id="f-type"
          value={draft.type}
          onChange={(event) => setField('type', event.target.value)}
          className={inputClass}
        >
          <option value="">Any type</option>
          {typeChoices.map((choice) => (
            <option key={choice.value} value={choice.value}>
              {choice.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="f-category" className={labelClass}>
          Category
        </label>
        <select
          id="f-category"
          value={draft.category}
          onChange={(event) => setField('category', event.target.value)}
          className={inputClass}
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="f-budget" className={labelClass}>
          Max monthly budget (LKR)
        </label>
        <input
          id="f-budget"
          type="number"
          min="0"
          step="1000"
          inputMode="numeric"
          value={draft.maxBudget}
          onChange={(event) => setField('maxBudget', event.target.value)}
          placeholder="e.g. 20000"
          className={inputClass}
        />
      </div>

      <fieldset>
        <legend className={labelClass}>Facilities</legend>
        <div className="space-y-2">
          {facilities.map((facility) => (
            <label
              key={facility.id}
              className="flex cursor-pointer items-center gap-2 text-sm text-charcoal"
            >
              <input
                type="checkbox"
                checked={draft.facilities.includes(facility.id)}
                onChange={() => toggleFacility(facility.id)}
                className="h-4 w-4 accent-navy"
              />
              {facility.label}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="flex cursor-pointer items-center gap-2 text-sm text-charcoal">
        <input
          type="checkbox"
          checked={draft.available}
          onChange={(event) => setField('available', event.target.checked)}
          className="h-4 w-4 accent-navy"
        />
        Only show listings with rooms available
      </label>

      <div className="flex gap-3">
        <Button type="submit" className="flex-1">
          Apply
        </Button>
        {hasFilters && (
          <Button type="button" variant="outline" onClick={onClear}>
            Clear
          </Button>
        )}
      </div>
    </form>
  )
}