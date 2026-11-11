# Permissions matrix

| Action | Visitor | Unverified | Verified | Moderator | Admin |
|---|---|---|---|---|---|
| Browse public explore | ✅ | ✅ | ✅ | ✅ | ✅ |
| Read own college feed | — | — | ✅ | ✅ | — (uses admin routes) |
| Post in feed | — | — | ✅ | ✅ | — |
| Create service request / proposal | — | — | ✅ | ✅ | — |
| Market listing CRUD | — | — | ✅ owner | ✅ own | — |
| Publish notice | — | — | student-only | student/official | — |
| Verify students | — | — | — | — | ✅ |
| Approve public content | — | — | — | — | ✅ |
| Review reports | — | — | — | ✅ (own college) | ✅ |

Enforcement: all `requireVerifiedCollege` endpoints derive `req.collegeId` from `req.user.collegeId` **only**. Admins are blocked from college-scoped routes; their operations go through `/api/admin/*` where every action is logged.