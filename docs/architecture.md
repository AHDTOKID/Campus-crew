# Architecture

React (Vite) → Express REST + Socket.IO → auth → collegeAccess → controllers/services → Mongoose → MongoDB.

## Trust boundaries
- **Public** — `/api/auth`, `/api/colleges`, `/api/explore/*` (read-only)
- **Verified, college-scoped** — everything else; `collegeAccess` derives `req.collegeId` strictly from verified user state
- **Admin** — `/api/admin/*` with audit logging (`ModerationLog`)

## ADRs
- ADR-001 Multi-tenant via `collegeId` + derived `req.collegeId` (never client-supplied).
- ADR-002 JWT bearer sessions (7d), rotated on login; refresh-token flow deferred.
- ADR-003 Media: URL/metadata only in Mongo; storage driver abstracted in `config/storage.js`.
- ADR-004 Proposal state machine: `pending → accepted | rejected | withdrawn`, single-accept enforced in `bidding.service.js`.
- ADR-005 Socket.IO authorization: JWT on handshake + per-room membership check on `conversation:join`.
- ADR-006 Public publication: separate `publicationState` on Post/Review/Guide; explicit admin approval.