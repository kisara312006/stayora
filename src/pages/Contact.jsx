import { useState } from 'react'
import { Mail, Phone, MapPin } from 'lucide-react'
import Container from '../components/ui/Container'
import Button from '../components/ui/Button'
import { inputClass, labelClass } from '../components/ui/formStyles'
import { siteConfig } from '../config/siteConfig'

const emptyForm = { name: '', email: '', subject: '', message: '' }

// Returns an object of error messages. An empty object means "all good".
function validate(values) {
  const errors = {}
  if (values.name.trim().length < 2) errors.name = 'Please enter your name.'
  if (!/^\S+@\S+\.\S+$/.test(values.email.trim()))
    errors.email = 'Please enter a valid email address.'
  if (values.subject.trim().length < 3)
    errors.subject = 'Please enter a short subject.'
  if (values.message.trim().length < 10)
    errors.message = 'Please write at least 10 characters.'
  return errors
}

function Field({ id, label, error, children }) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  )
}

export default function Contact() {
  const [values, setValues] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [checked, setChecked] = useState(false)
  const { contact } = siteConfig

  function handleChange(event) {
    setValues({ ...values, [event.target.name]: event.target.value })
  }

  function handleSubmit(event) {
    event.preventDefault()
    const found = validate(values)
    setErrors(found)
    setChecked(Object.keys(found).length === 0)
  }

  const fieldProps = (name) => ({
    id: name,
    name,
    value: values[name],
    onChange: handleChange,
    className: `${inputClass} ${errors[name] ? 'border-red-700' : ''}`,
    'aria-invalid': errors[name] ? 'true' : 'false',
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
  })

  const placeholder = (text) => <span className="italic text-charcoal/60">[{text}]</span>

  return (
    <>
      <section className="bg-navy py-14">
        <Container className="max-w-3xl text-center">
          <h1 className="text-4xl text-white sm:text-5xl">Contact Us</h1>
          <p className="mt-4 text-lg text-white/80">
            Questions, feedback or need help? Send us a message.
          </p>
        </Container>
      </section>

      <Container className="grid gap-10 py-16 lg:grid-cols-[1.4fr_1fr]">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-5 rounded-2xl border border-taupe bg-white p-6 shadow-sm sm:p-8"
        >
          <Field id="name" label="Your name" error={errors.name}>
            <input type="text" autoComplete="name" {...fieldProps('name')} />
          </Field>
          <Field id="email" label="Email address" error={errors.email}>
            <input type="email" autoComplete="email" {...fieldProps('email')} />
          </Field>
          <Field id="subject" label="Subject" error={errors.subject}>
            <input type="text" {...fieldProps('subject')} />
          </Field>
          <Field id="message" label="Message" error={errors.message}>
            <textarea rows="6" {...fieldProps('message')} />
          </Field>

          <Button type="submit">Send message</Button>

          {checked && (
            <p
              role="status"
              className="rounded-xl border border-gold bg-cream p-4 text-sm text-charcoal"
            >
              Your message passed validation, but sending is{' '}
              <strong>not connected yet</strong> (it will be added with the
              backend), so nothing has been sent.
            </p>
          )}
        </form>

        <aside className="space-y-4 rounded-2xl border border-taupe bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl">Contact details</h2>
          <p className="flex items-start gap-3">
            <Mail className="mt-1 h-5 w-5 shrink-0 text-gold" aria-hidden="true" />
            <span>{contact.email || placeholder('contact email to be added')}</span>
          </p>
          <p className="flex items-start gap-3">
            <Phone className="mt-1 h-5 w-5 shrink-0 text-gold" aria-hidden="true" />
            <span>{contact.phone || placeholder('phone to be added')}</span>
          </p>
          <p className="flex items-start gap-3">
            <MapPin className="mt-1 h-5 w-5 shrink-0 text-gold" aria-hidden="true" />
            <span>{contact.address || placeholder('address to be added')}</span>
          </p>
        </aside>
      </Container>
    </>
  )
}