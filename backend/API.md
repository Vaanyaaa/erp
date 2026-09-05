# API Reference

Base URL (local dev): `http://localhost:5000/api`

All protected routes require: `Authorization: Bearer <token>`

---

## Auth

### POST `/auth/register`
No auth required.

```json
{
  "role": "student",
  "fullName": "Aarav Sharma",
  "email": "aarav@edusphere.edu",
  "mobileNumber": "9999900002",
  "password": "password123",
  "enrollmentNo": "EN2026-001",
  "studentDept": "Computer Science",
  "program": "B.Tech CS",
  "semester": "Semester VII"
}
```
Role-specific fields:
- `student`: `enrollmentNo`, `studentDept`, `program`, `semester`
- `professor` / `tp_admin`: `employeeId`, `profDept`, `designation`
- `parent`: `childEnrollmentNo` (must match an already-registered student), `relationship`

Returns `{ token, user }`.

### POST `/auth/login`
```json
{ "identifier": "aarav@edusphere.edu", "password": "password123" }
```
Returns `{ token, user }`.

### GET `/auth/me`
Auth required. Returns the logged-in user's full profile.

---

## Notices (TP Cell + general)

### POST `/notices`
Roles: `tp_admin`, `professor`
```json
{ "title": "Google Drive — Registration Open", "body": "...", "category": "tp_cell" }
```
`category` is `"tp_cell"` or `"general"`.

### GET `/notices`
Any authenticated user. Optional query: `?category=tp_cell&limit=20`

### GET `/notices/:id`
### DELETE `/notices/:id`
Only the original poster or a `tp_admin`.

---

## Question Bank

### POST `/question-bank/companies`
Roles: `tp_admin`
```json
{ "name": "Google", "description": "Product-based" }
```

### GET `/question-bank/companies`
Any authenticated user.

### POST `/question-bank/questions`
Roles: `tp_admin`
```json
{
  "companyId": "<uuid>",
  "year": 2025,
  "type": "dsa",
  "difficulty": "medium",
  "topic": "Arrays",
  "title": "Two Sum variant",
  "content": "Given an array, find all pairs summing to a target."
}
```
`type`: `dsa` | `aptitude` | `hr` | `other`
`difficulty`: `easy` | `medium` | `hard`

### GET `/question-bank/questions`
Any authenticated user. Filters (all optional, combinable):
`?companyId=&year=&difficulty=&topic=&type=`

### DELETE `/question-bank/questions/:id`
Roles: `tp_admin`

### POST `/question-bank/assemble-test`
Any authenticated user. Pulls from the vetted question bank — does not generate new questions with AI, to avoid ever showing an incorrect hallucinated question.
```json
{ "companyId": "<uuid>", "difficulty": "mixed", "counts": { "easy": 4, "medium": 4, "hard": 2 } }
```
or for a single difficulty level:
```json
{ "companyId": "<uuid>", "difficulty": "easy", "totalQuestions": 10 }
```

---

## OCR

### POST `/ocr/extract`
Any authenticated user. `multipart/form-data` with field name `file` (PNG/JPG/JPEG/WEBP — PDFs not yet supported, see README).

Returns:
```json
{ "fileName": "...", "filePath": "/uploads/...", "extractedText": "...", "confidence": 93 }
```

---

## Calendar

### POST `/calendar`
Roles: `tp_admin`, `professor`
```json
{ "title": "Google Pre-Placement Talk", "eventDate": "2026-09-08", "eventType": "company_visit", "description": "Auditorium, 10 AM" }
```
`eventType`: `company_visit` | `seminar` | `deadline` | `exam` | `other`

### GET `/calendar/week`
Any authenticated user. Optional `?start=YYYY-MM-DD` (any date within the target week — defaults to current week).

### DELETE `/calendar/:id`
Roles: `tp_admin`, `professor`

---

## Error format

All errors return `{ "message": "..." }` with an appropriate HTTP status:
- `400` — missing/invalid fields
- `401` — no/invalid token, or wrong credentials
- `403` — valid token, but role not permitted for this action
- `404` — resource not found
- `409` — conflict (e.g. duplicate email)
- `500` — unexpected server error (includes `error` field with details in dev)
