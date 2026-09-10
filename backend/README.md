# Acadex — Backend

Express + Sequelize API for the Acadex frontend.

```bash
npm install
cp .env.example .env
npm run seed     # build the schema and load demo data
npm run dev      # http://localhost:5000
```

See `API.md` for the full endpoint reference and `../SETUP.md` for running both
halves together.

## How it is put together

```
src/
  config/database.js     SQLite by default, Postgres when DATABASE_URL is set
  models/index.js        All tables and their associations
  middleware/auth.js     JWT verification + requireRole()
  routes/
    auth.routes.js       register / login / me
    notices.routes.js    notices, including prompt-to-draft
    tpcell.routes.js     companies, question bank, test assembly
    calendar.routes.js   placement calendar
    documents.routes.js  OCR upload
    academics.routes.js  summary, attendance, fees, courses, timetable
  utils/
    ocr.js               Tesseract wrapper, offline language data
    noticeDrafter.js     template drafting, optional Claude upgrade
  seed.js                demo data
tessdata/eng.traineddata bundled OCR model (~4 MB)
```

## Things worth knowing before you change it

**Don't use `sequelize.sync({ alter: true })`.** On SQLite it rebuilds tables
through a backup copy and drops association foreign keys along the way, which
silently wipes seeded relationships on every restart. The server uses a plain
`sync()`, which only creates missing tables.

**Roles are checked by middleware**, not inside each handler, so a new route
can't ship without a permission decision being made. `tp_admin` is a separate
role rather than "a professor with an extra flag" — a TP Cell head's job isn't
teaching.

**Test assembly pulls from the vetted question bank** instead of generating new
questions. It needs no model API key and can't hallucinate a problem.
