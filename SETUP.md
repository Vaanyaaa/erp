# Acadex — running the project

Two folders, two terminals. Node 18 or newer.

## 1. Backend

```bash
cd backend
npm install
cp .env.example .env      # Windows: copy .env.example .env
npm run seed              # creates the database and demo data
npm run dev               # http://localhost:5000
```

`npm run seed` is destructive — it drops and rebuilds every table. Run it once
at the start, and again whenever you want a clean slate.

## 2. Frontend

```bash
cd frontend
npm install
npm run dev               # http://localhost:3000
```

Open http://localhost:3000/login.

## Demo accounts

All four use the password `Password@123`:

| Role | Email | What it shows |
|---|---|---|
| Student | `aarav@acadex.edu` | Attendance, fees, timetable, TP Cell as a reader |
| TP Cell | `tpcell@acadex.edu` | Posting notices, adding calendar events |
| Professor | `meera@acadex.edu` | Posting general notices, the document reader |
| Parent | `sunita@acadex.edu` | The linked ward's record, read-only |

Students can also sign in with an enrollment number instead of an email — try
`CS2023045`.

Sign the TP Cell account in to see the difference: the posting panels on the TP
Cell and Notices pages only render for roles allowed to use them, and the API
rejects the request as well if anyone works around the UI.

## Database

By default the backend writes to a local SQLite file (`backend/acadex.sqlite`)
so there is nothing to install. To switch to Postgres, set `DATABASE_URL` in
`backend/.env` to a Supabase, Neon or local connection string and re-run
`npm run seed`. No code changes — the same models run on both.

```
DATABASE_URL=postgresql://user:password@host:5432/acadex_erp
DB_SSL=true      # Supabase and Neon need this
```

## Optional API keys

Nothing is required. Without any keys:

- OCR runs offline with the language data bundled in `backend/tessdata`
- Notice drafting uses a built-in template

Set `ANTHROPIC_API_KEY` in `backend/.env` and notice drafting switches to Claude
automatically, falling back to the template if the call fails.

## If the frontend can't reach the API

The frontend defaults to `http://localhost:5000/api`. To point it elsewhere,
create `frontend/.env.local`:

```
NEXT_PUBLIC_API_URL=https://your-deployed-api.com/api
```

Then set `CORS_ORIGIN` in `backend/.env` to your frontend's URL.

## Deploying later

- Frontend → Vercel (zero config for Next.js)
- Backend → Railway or Render
- Database → Supabase or Neon, via `DATABASE_URL`

## A note on `node_modules`

This archive doesn't include `node_modules`. The copy in the original zip was
installed on Windows, so it carried Windows-only native binaries
(`lightningcss-win32-x64-msvc`) and wouldn't run on a teammate's Mac or Linux
machine or on a deploy server. Running `npm install` in each folder builds the
right binaries for whatever machine you're on.
