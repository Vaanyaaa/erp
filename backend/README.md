# EduSphere ERP — Backend

Full working backend for the EduSphere ERP project: auth (JWT + role-based
permissions), TP Cell notices, company-wise question bank with an AI test
assembler, OCR for scanned documents, and a weekly placement calendar.

Tested end-to-end against a real Postgres database before being handed off —
every endpoint below was actually called and verified, not just written.

## Stack

- **Node.js + Express**
- **Sequelize + Postgres** (works with local Postgres, Supabase, Neon, or Railway — just change one line in `.env`)
- **JWT** auth with `bcryptjs` password hashing
- **Tesseract.js** for OCR (free, no API key, works offline — language data is bundled in `/tessdata`)
- **Multer** for file uploads

## Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
- `DATABASE_URL` — point this at your Postgres instance (local, Supabase, or Neon — see comments in `.env.example`)
- `JWT_SECRET` — generate one with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

Then:

```bash
npm run dev        # starts the server with auto-reload, and auto-creates all tables
npm run seed        # optional: populates sample users, companies, questions, a notice, and a calendar event
```

The server auto-creates/updates all tables on startup (`sequelize.sync({ alter: true })`).
This is convenient for now — **once this is live with real user data, switch to
proper migrations** (e.g. `umzug`) so schema changes can't accidentally drop data.

### Seeded test accounts (after `npm run seed`)
| Role | Email | Password |
|---|---|---|
| TP Admin | tpadmin@edusphere.edu | password123 |
| Student | aarav@edusphere.edu | password123 |
| Parent | sunita@example.com | password123 |

## Project structure

```
src/
├── config/database.js       # Sequelize connection (reads DATABASE_URL)
├── models/                  # User, Profiles, Notice, Company, Question, CalendarEvent
├── controllers/              # Business logic per feature
├── routes/                    # Express route definitions
├── middleware/
│   ├── auth.js               # JWT verification + role-based authorize()
│   └── upload.js              # Multer file upload config
├── utils/
│   ├── ocrService.js         # Tesseract OCR (swap to Google Vision here later if needed)
│   ├── notifications.js       # Firebase push abstraction (logs only until configured)
│   └── seed.js                # Sample data script
└── server.js                  # App entrypoint
tessdata/eng.traineddata       # Bundled OCR language data (no runtime download needed)
```

## API reference

See `API.md` for every endpoint, required roles, and example requests.

## Roles

- `student` — read notices, browse question bank, take assembled tests
- `professor` — everything a student can do, plus post general notices and calendar events
- `tp_admin` — Training & Placement Cell HOD. Posts TP Cell notices, manages companies/questions, posts calendar events
- `parent` — read-only, linked to a student via `childEnrollmentNo` (must match an already-registered student)

## What's NOT built yet (intentionally left for you)

- **Push notifications**: `src/utils/notifications.js` is wired but needs a real Firebase project — currently logs instead of sending. See comments in that file for the 3-step setup.
- **PDF OCR**: Tesseract reads images directly; PDF scans need a page-to-image conversion step first (see comment in `ocrController.js`). Upload PNG/JPG for now.
- **Attendance / Fees / Results tables**: not built yet since the frontend dashboard for these is still placeholder UI. The schema pattern in `models/` makes these quick to add when you're ready.
- **Frontend integration**: the existing Next.js frontend currently fakes login via `sessionStorage` — it needs to be updated to call these real endpoints and store the JWT instead. Every "Backend integration point" comment in the frontend code maps to one of these routes.
