import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Container from '../components/ui/Container'
import Button from '../components/ui/Button'
import LoadingScreen from '../components/ui/LoadingScreen'
import ListingForm from '../components/owner/ListingForm'
import { useAuth } from '../hooks/useAuth'
import { useOwnListing } from '../hooks/useOwnerListings'

function Message({ title, text }) {
  return (
    <div className="py-12 text-center">
      <h2 className="text-2xl">{title}</h2>
      <p className="mt-2 text-charcoal/80">{text}</p>
      <Button to="/owner" className="mt-6">
        Back to dashboard
      </Button>
    </div>
  )
}

function EditExisting({ id }) {
  const { user } = useAuth()
  const { listing, loading, error, notFound } = useOwnListing(id, user.uid)

  if (loading) return <LoadingScreen label="Loading listing…" />
  if (error) {
    return (
      <Message
        title="We couldn’t load this listing"
        text="Check your connection and refresh the page."
      />
    )
  }
  if (notFound) {
    return (
      <Message
        title="Listing not found"
        text="This listing does not exist, or it does not belong to your account."
      />
    )
  }
  if (listing.status === 'removed') {
    return (
      <Message
        title="This listing was removed"
        text="An administrator removed this listing, so it can no longer be edited."
      />
    )
  }

  // "key" makes the form start fresh if you move to a different listing
  return <ListingForm key={listing.id} listing={listing} />
}

export default function OwnerListingEditor() {
  const { id } = useParams()

  return (
    <Container className="max-w-3xl py-10">
      <Link
        to="/owner"
        className="inline-flex items-center gap-2 text-sm font-medium text-ink hover:underline"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to dashboard
      </Link>
      <h1 className="mt-4 mb-6 text-3xl">{id ? 'Edit listing' : 'Add a listing'}</h1>
      {id ? <EditExisting id={id} /> : <ListingForm key="new" listing={null} />}
    </Container>
  )
}