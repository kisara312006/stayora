# Stayora data model (Cloud Firestore)

IDs are Firestore auto-IDs unless stated. Timestamps are Firestore `Timestamp`
values written with `serverTimestamp()` (from the browser) or the Admin SDK.
Money is stored in LKR as a number. "Public" means readable by anyone.

## Status values for accommodations
`draft` → `pending` → `published` (admin only). Also `changesRequested`, `rejected`,
`archived` (owner unpublished) and `removed` (admin removed).
A listing is shown publicly only when `status == 'published'` AND `isPaused == false`.

## users/{uid}  (PRIVATE)
Purpose: profile and role. Document ID = Firebase Auth UID.
Fields: displayName (string), email (string), phone (string, optional),
role ('seeker' | 'owner'), preferredLocations (string[]), budgetMin / budgetMax (number),
preferredType (string), points (number, server only), level (number, server only),
suspended (bool, server only), ownerVerificationStatus ('none' | 'pending' |
'verified' | 'rejected', server only), createdAt, updatedAt.
Read: the user, admins. Write: the user (except protected fields). Admin rights are a
Firebase custom claim, NOT a field here.
Validation: displayName 2-80 chars, role cannot become anything but seeker/owner.

## accommodations/{id}  (PUBLIC when published and not paused)
Purpose: boarding and hostel listings.
Fields:
- ownerId (string, UID), ownerDisplayName (string), isDemo (bool)
- title (1-100), description (string, up to 3000)
- propertyType ('boarding' | 'hostel'), roomTypes (('private'|'shared')[])
- facilities (string[] of ids from src/config/listingOptions.js)
- genderPolicy ('any' | 'female' | 'male')  [filter only, never used to rank]
- monthlyRent (number), depositAmount (number), additionalCharges (string)
- totalRooms (int), availableRooms (int, 0..totalRooms), availableFrom (Timestamp | null),
  availabilityUpdatedAt (Timestamp)
- city, area (strings), publicAddress (string), geo ({lat, lng} | null; set from a
  real map pin only, never invented)
- nearUniversities, nearWorkplaces (string[])
- houseRules (string[]), photos (string[] of Storage URLs, max 10), coverPhoto (string | null)
- contactPhone (string | null), showPhonePublicly (bool), whatsappEnabled (bool),
  publicContactEmail (string | null)
- status, isPaused (bool), verified (bool, admin only), featured (bool, admin only),
  createdAt, updatedAt, publishedAt
Read: anyone if published and not paused; the owner; admins.
Write: owners create drafts, edit their own, and may only change availability/pause on a
live listing; any other edit of a live listing returns it to `pending`. Owners can never set
`published`, `verified` or `featured`.
Concurrency: availableRooms is updated inside a Firestore transaction so two
simultaneous updates cannot corrupt the count (Phase 5).
Indexes: see firestore.indexes.json (status + isPaused + createdAt / monthlyRent /
city / propertyType / featured; ownerId + updatedAt; status + createdAt for admin queue).
Search limits: Firestore queries on the most selective fields; facilities are filtered
in the app on the returned set.

## favourites/{userId_accommodationId}  (PRIVATE)
Purpose: saved listings. The document ID prevents duplicates.
Fields: userId, accommodationId, createdAt.
Read/write: the user only. Index: userId + createdAt desc.

## enquiries/{id}  (PRIVATE: seeker, listing owner, admin)
Purpose: seeker-to-owner enquiries with a simple reply workflow.
Fields: accommodationId, ownerId (copied from the listing, used by rules and queries),
seekerId, seekerName, message (10-1000), status ('new'|'read'|'replied'|'resolved'),
reply (string, optional), repliedAt, createdAt, updatedAt.
Create: a signed-in, non-suspended user, only on a published, unpaused listing they do
not own. Update: the owner, only status/reply/repliedAt/updatedAt.
Indexes: ownerId + createdAt desc; seekerId + createdAt desc.
Planned: rate limiting (Phase 6).

## notifications/{id}  (PRIVATE)
Fields: userId, type, title, body, link, read (bool), createdAt.
Created by trusted server code only. The user may change only `read`.
Index: userId + createdAt desc.

## reports/{userId_accommodationId}  (PRIVATE: admins read)
Purpose: flagged listings; the ID allows one report per user per listing.
Fields: reporterId, accommodationId, reason ('scam'|'wrong-information'|'unavailable'|
'inappropriate-content'|'other'), details (0-1000), status ('open'|...), createdAt.
Index: status + createdAt desc.

## achievements/{userId_achievementId}, gameResults/{id}, rewardTransactions/{id}  (PRIVATE)
Purpose: gamification records. Written ONLY by trusted server code after validation.
Users read their own. Reward transaction IDs are deterministic (userId_reason_ref) so the
same activity cannot be rewarded twice.

## platformSettings/{key}  (PUBLIC read, admin/server write)
Purpose: non-sensitive configuration: facilities, categories, recommendation weights,
achievement definitions, public contact details. Never store secrets here.

## auditLogs/{id}  (PRIVATE: admins read)
Purpose: record of important admin actions (who, what, when). Server write only.
Avoid storing unnecessary personal data.