# SAGE Firestore Security Specification

## Data Invariants
1. A User can only read and write their own profile data.
2. Knowledge items are read-only for public, except maybe for admins (not implemented here).
3. Saved items and Mistakes must belong to the authenticated user.
4. XP and Level-ups must follow validation rules (e.g., cannot decrease XP maliciously).

## The Dirty Dozen Payloads (Rejection Tests)
1. Attempt to update another user's `xp`.
2. Attempt to create a `knowledge` item without being an admin.
3. Attempt to set `sageLevel` to "God Mode" (invalid enum check).
4. Attempt to save a fact for another user by injecting their `userId` in the subcollection path.
5. Attempt to update `streak` to 99999 without a valid timestamp.
6. Attempt to read PII (email) of another user (if we had emails).
7. Attempt to delete a global `knowledge` item.
8. Attempt to write a `UserKnowledge` record with a non-existent `itemId`.
9. Attempt to inject a 1MB string into the `username` field.
10. Attempt to update a terminal state (e.g. a "Completed" badge) once it's locked.
11. Attempt to perform a blanket `list` on all users without a `where` clause matching self.
12. Attempt to spoof `auth.uid` by passing it in the resource data instead of relying on `request.auth.uid`.

## Logic Helpers (Preview)
- `isOwner(userId)`: `request.auth.uid == userId`
- `isValidUser(data)`: Checks keys, types, and constraints for the User entity.
- `isValidKnowledge(data)`: Checks types for content and category.
