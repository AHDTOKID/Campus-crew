# Schema

## Collections
- `colleges` — public directory + admin edits.
- `users` — indexed by `email` (unique) and `collegeId`.
- `verifications` — one per submission; reviewer + decision audit.
- `servicerequests`, `servicelistings`, `proposals` — all carry `collegeId`.
- `marketplaceitems` — `collegeId`, `seller`, `status`, `savedBy[]`.
- `posts`, `comments` — `collegeId`, `parentComment` for threads, `publicationState`.
- `reactions` — unique `(userId, targetType, targetId, type)`.
- `notices` — `sourceLabel` official/student.
- `collegereviews`, `fresherguides` — `status: pending|approved|rejected`.
- `conversations`, `messages` — participant-scoped.
- `notifications`, `reports`, `moderationlogs`.

## Indexes
- Every private model: `collegeId`.
- `users.email` unique.
- `proposals`: `(request, provider)` unique.
- `reactions`: `(userId, targetType, targetId, type)` unique.
- `messages.conversation`, `conversations.participants`, `conversations.lastMessageAt`.