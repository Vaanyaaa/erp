# EduSphere ERP Project Repository

Internal Academic Management System repository containing separate **Frontend** and **Backend** folders.

## Project Structure

```
erp/
├── frontend/             # Next.js 16 + React + Tailwind CSS + shadcn/ui
│   ├── app/
│   │   ├── dashboard/    # Main ERP dashboard shell
│   │   ├── login/        # Login page UI
│   │   ├── signup/       # Sign Up page UI
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── components/       # UI & Auth components
│   ├── lib/              # Utility functions
│   └── package.json
│
└── backend/              # Node.js / Express API Service
    ├── src/
    │   └── server.js     # Server entrypoint
    ├── .env.example
    └── package.json
```

## Running the Applications

### Frontend
```bash
cd frontend
npm run dev
```
Open `http://localhost:3000` in your browser.

### Backend
```bash
cd backend
npm run dev
```
Backend API will start on `http://localhost:5000`.
