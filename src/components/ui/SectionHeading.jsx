export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
}) {
  const alignment = align === 'center' ? 'text-center mx-auto' : 'text-left'

  return (
    <div className={`max-w-2xl ${alignment}`}>
      {eyebrow && (
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-charcoal/70">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 text-lg text-charcoal/80">{subtitle}</p>}
    </div>
  )
}