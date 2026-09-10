# Acadex — API Reference

Base URL: `http://localhost:5000/api`

Every endpoint except `/health`, `/auth/login` and `/auth/register` needs a
bearer token:

```
Authorization: Bearer <token>
```

Roles are `student`, `professor`, `parent` and `tp_admin`. The permission column
below is enforced by middleware, not by per-route checks.

## Auth

| Method | Path | Who | Notes |
|---|---|---|---|
| POST | `/auth/register` | anyone | Accepts the payload `SignupForm` already builds, including its `studentDept` / `profDept` field names. Returns `{ token, user }`. |
| POST | `/auth/login` | anyone | Body `{ identifier, password }`. `identifier` is an email **or** an enrollment number. |
| GET | `/auth/me` | any signed-in | Restores a session after a page refresh. |

## Notices

| Method | Path | Who | Notes |
|---|---|---|---|
| GET | `/notices?category=&limit=` | any | Categories: `general`, `tp_cell`, `exam`, `fees`, `emergency`. |
| GET | `/notices/:id` | any | |
| POST | `/notices/draft` | professor, tp_admin | Body `{ prompt, category? }`. Turns one sentence into an editable draft. Saves nothing. |
| POST | `/notices` | professor, tp_admin | `category: "tp_cell"` is rejected for anyone but `tp_admin`. |
| DELETE | `/notices/:id` | author or tp_admin | |

## TP Cell

| Method | Path | Who | Notes |
|---|---|---|---|
| GET | `/tpcell/companies` | any | Each company includes a `questionCount`. |
| POST | `/tpcell/companies` | tp_admin | |
| GET | `/tpcell/questions` | any | Filters: `companyId`, `year`, `difficulty`, `type`, `topic`, `search`. Sorted newest year first, then easy → medium → hard. |
| POST | `/tpcell/questions` | professor, tp_admin | |
| DELETE | `/tpcell/questions/:id` | tp_admin | |
| POST | `/tpcell/tests/generate` | any | Body `{ companyId?, totalQuestions?, mix?, type?, topic? }`. Assembles a paper from the existing bank — it does not invent questions. |

## Calendar

| Method | Path | Who | Notes |
|---|---|---|---|
| GET | `/calendar/week?start=YYYY-MM-DD` | any | Returns seven pre-bucketed days, so the UI needs no date maths. |
| GET | `/calendar/upcoming?limit=` | any | |
| POST | `/calendar` | professor, tp_admin | |
| DELETE | `/calendar/:id` | professor, tp_admin | |

## Documents / OCR

| Method | Path | Who | Notes |
|---|---|---|---|
| POST | `/documents/ocr` | any | `multipart/form-data`, field name `file`. Images up to 10 MB. Returns raw text plus a best-effort `structured.rows` table of label → value. |
| GET | `/documents` | any | The caller's own read history. |
| GET | `/documents/:id` | owner | Full extracted text. |

OCR runs fully offline. `eng.traineddata` is bundled in `backend/tessdata`, so
Tesseract never downloads a language model at runtime.

## Academics

| Method | Path | Who | Notes |
|---|---|---|---|
| GET | `/academics/summary` | any | The four overview cards. Students see their own record, parents see their ward's, staff see institution-wide counts. |
| GET | `/academics/attendance` | any | Overall percentage plus a per-course breakdown. |
| GET | `/academics/fees` | any | Items plus paid / outstanding totals. |
| GET | `/academics/courses` | any | |
| GET | `/academics/timetable` | any | Full week. |
| GET | `/academics/timetable/today` | any | |
| GET | `/academics/activity` | any | The caller's recent actions. |

## Errors

Every failure returns `{ "message": "..." }` with a real status code:

- `400` — something is missing or malformed
- `401` — no token, or an expired one
- `403` — signed in, but the role isn't allowed
- `404` — no such record
- `409` — duplicate (email already registered, company already listed)
