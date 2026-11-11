# Campus Crew

Multi-college student networking, freelancing, marketplace and campus discovery platform.

- **Frontend:** React + Vite + Tailwind (`client/`)
- **Backend:** Node + Express + Socket.IO + MongoDB (`server/`)
- **Docs:** `docs/` (architecture, schema, API, permissions)
- **SRS & SDLC:** `Campus_Crew_SRS.docx`, `Campus_Crew_SDLC_Plan.docx`

## Run

```bash
npm run install:all
cp server/.env.example server/.env
npm run dev          # api :5002 · web :5173
npm run seed         # optional; also runs automatically if DB empty