# API

All responses `{ message?, ... }`. Auth: `Authorization: Bearer <jwt>`.

## Public
- `POST /api/auth/register` · `POST /api/auth/login`
- `GET  /api/colleges` · `GET /api/colleges/:slug`
- `GET  /api/explore/colleges` · `GET /api/explore/colleges/:slug`

## Verified student
- `POST /api/auth/me/password` · `PATCH /api/auth/me` · `GET /api/auth/me`
- `POST /api/verification`
- `GET/POST /api/services/requests` · `PATCH /api/services/requests/:id/complete`
- `GET/POST /api/services/listings` · `DELETE /api/services/listings/:id`
- `GET/POST /api/proposals/request/:requestId` · `PATCH /api/proposals/:id/accept|reject|withdraw`
- `GET/POST /api/market` · `PATCH/DELETE /api/market/:id` · `POST /api/market/:id/bookmark`
- `GET/POST /api/social` · `POST /api/social/:id/like` · `GET /api/social/:id/comments`
- `POST /api/comments/post/:id` · `DELETE /api/comments/:id`
- `GET/POST /api/notices` · `DELETE /api/notices/:id`
- `GET/POST /api/messages` · `GET/POST /api/messages/:id`
- `GET /api/users` · `GET /api/users/:id`
- `GET /api/notifications` · `PATCH /api/notifications/read-all`
- `POST /api/reports` · `POST /api/uploads/sign`

## Admin
- `GET/PATCH /api/admin/verifications[/:id]`
- `GET/PATCH /api/admin/reports[/:id]`
- `GET /api/admin/public/pending` · `PATCH /api/admin/public/:kind/:id`
- `POST /api/admin/colleges` · `GET /api/admin/audit`

## Socket.IO
Handshake: `auth.token` (JWT).
- `conversation:join(conversationId, ack)` — server verifies membership.
- `message:new` — emitted to `conversation:{id}` and each participant `user:{id}`.
- `notification` — emitted to `user:{id}`.