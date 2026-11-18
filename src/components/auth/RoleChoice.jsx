import { Building2, Search } from 'lucide-react'

const options = [
  {
    value: 'seeker',
    title: 'I’m looking for a place',
    text: 'Search, save and enquire about boarding places and hostels.',
    Icon: Search,
  },
  {
    value: 'owner',
    title: 'I own a property',
    text: 'List your boarding place or hostel and manage availability.',
    Icon: Building2,
  },
]

export default function RoleChoice({ value, onChange }) {
  return (
    <fieldset>
      <legend className="mb-2 block text-sm font-semibold text-ink">
        I want to
      </legend>
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map(({ value: optionValue, title, text, Icon }) => (
          <label key={optionValue} className="relative block cursor-pointer">
            <input
              type="radio"
              name="role"
              value={optionValue}
              checked={value === optionValue}
              onChange={() => onChange(optionValue)}
              className="peer sr-only"
            />
            <span className="block h-full rounded-xl border-2 border-taupe bg-surface p-4 transition-colors peer-checked:border-ink peer-checked:bg-cream peer-focus-visible:ring-2 peer-focus-visible:ring-ink">
              <Icon className="h-5 w-5 text-gold" aria-hidden="true" />
              <span className="mt-2 block text-sm font-semibold text-ink">{title}</span>
              <span className="mt-1 block text-xs text-charcoal/80">{text}</span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}