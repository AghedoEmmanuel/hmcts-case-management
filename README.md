# HMCTS Case Management System

A full-stack case management task application built for HMCTS, enabling caseworkers to create, view, update, and delete tasks linked to case references.

## Project Status

| Layer | Status |
|---|---|
| Backend API (Express + PostgreSQL) | ✅ Complete |
| Backend Unit & Integration Tests (Jest) | ✅ Complete |
| Frontend (Next.js + Tailwind + ShadCN) | ✅ Complete |
| Frontend Unit Tests (Jest + React Testing Library) | ✅ Complete |

---

## Tech Stack

**Backend**
- Node.js + Express + TypeScript
- PostgreSQL (via `pg` driver)
- Jest + Supertest (unit & integration tests)

**Frontend**
- Next.js 14 (App Router)
- Tailwind CSS + ShadCN UI + Shadcn/ui Components
- TypeScript
- Jest + React Testing Library (25 unit tests)

---

## Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL installed and running
- npm (comes with Node.js)

---

## Installation & Setup

### 1. Database Setup

Create the PostgreSQL database:
```bash
psql -U postgres
CREATE DATABASE hmcts_tasks;
\q
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hmcts_tasks
DB_USER=postgres
DB_PASSWORD=your_password_here
```

Start the development server:
```bash
npx ts-node src/index.ts
```

The API will be running at `http://localhost:5000`. Verify it's live:
```bash
curl http://localhost:5000/health
# → { "status": "HMCTS Case Management API is running" }
```

### 3. Backend Testing

```bash
cd backend
npm test
```

Tests cover all five CRUD endpoints with success and error cases. Coverage report is generated in `backend/coverage/`.

### 4. Frontend Setup

In a new terminal:
```bash
cd frontend
npm install
npm run dev
```

The frontend will be running at `http://localhost:3000` and will connect to the backend API at `http://localhost:5000`.

### 5. Frontend Testing

```bash
cd frontend
npm test
```

Tests include 25 unit tests covering all major components:
- **TaskForm** (6 tests) - Form creation, editing, validation, submission
- **TaskList** (9 tests) - Task rendering, selection, filtering, date formatting
- **TaskDetails** (4 tests) - Task display, edit/delete actions
- **TaskBadge** (2 tests) - Priority and status badge rendering
- **hmctsHeader** (2 tests) - Header layout and content

Test coverage report is generated in `frontend/coverage/`.

### 6. Frontend Build

```bash
cd frontend
npm run build
```

---

---

## API Reference

Base URL: `http://localhost:5000/api/tasks`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tasks` | Get all tasks |
| GET | `/api/tasks/:id` | Get a single task by ID |
| POST | `/api/tasks` | Create a new task |
| PUT | `/api/tasks/:id` | Update an existing task |
| DELETE | `/api/tasks/:id` | Delete a task |

---

### Task Schema
```json
{
  "id": 1,
  "title": "Prepare hearing bundle",
  "description": "Compile all documents for the upcoming hearing",
  "status": "pending",
  "priority": "high",
  "due_date": "2025-06-01",
  "assigned_to": "Caseworker Name",
  "case_reference": "HMCTS-2025-001",
  "created_at": "2025-03-30T10:00:00.000Z",
  "updated_at": "2025-03-30T10:00:00.000Z"
}
```

**Status values:** `pending` · `in-progress` · `completed`  
**Priority values:** `low` · `medium` · `high`

---

## Project Structure
```
hmcts-case-management/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.ts                    # PostgreSQL connection pool
│   │   ├── controllers/
│   │   │   └── taskControllers.ts       # CRUD logic
│   │   ├── models/
│   │   │   └── taskModel.ts             # DB schema / table init
│   │   ├── routes/
│   │   │   └── taskRoutes.ts            # Express route definitions
│   │   └── index.ts                     # Server entry point
│   ├── test/
│   │   └── task.tests.ts                # Jest + Supertest API tests
│   ├── coverage/                        # Test coverage reports
│   ├── .env
│   ├── jest.config.js
│   └── tsconfig.json
├── frontend/
│   ├── app/
│   │   ├── globals.css                  # Global styles
│   │   ├── layout.tsx                   # Root layout
│   │   └── page.tsx                     # Home page
│   ├── components/
│   │   ├── shared/
│   │   │   ├── TaskForm.tsx             # Create/edit task form
│   │   │   ├── TaskList.tsx             # Task list display
│   │   │   ├── TaskDetails.tsx          # Task detail view
│   │   │   ├── TaskBadge.tsx            # Priority/status badges
│   │   │   └── hmctsHeader.tsx          # Header component
│   │   └── ui/                          # ShadCN UI components
│   ├── lib/
│   │   ├── api.ts                       # API client functions
│   │   └── utils.ts                     # Utility functions
│   ├── types/
│   │   └── task.ts                      # TypeScript type definitions
│   ├── __tests__/
│   │   ├── TaskForm.test.tsx            # Form component tests
│   │   ├── TaskList.test.tsx            # List component tests
│   │   ├── TaskDetails.test.tsx         # Details component tests
│   │   ├── TaskBadge.test.tsx           # Badge component tests
│   │   └── hmctsHeader.test.tsx         # Header component tests
│   ├── coverage/                        # Test coverage reports
│   ├── jest.config.js                   # Jest configuration
│   ├── jest.setup.js                    # Jest setup file
│   ├── next.config.ts                   # Next.js configuration
│   └── tsconfig.json
└── README.md                            # This file
```

---

## Security Considerations

This project was developed with security principles from an MSc in Cybersecurity (Teesside University) in mind:

- Environment variables used for all database credentials — no hardcoded secrets
- Input passed via parameterised queries throughout — SQL injection mitigated by design
- CORS configured on the Express server
- `.env` excluded from version control via `.gitignore`

---

## Author

Emmanuel Aghedo  
[GitHub](https://github.com/AghedoEmmanuel) · [Portfolio](https://aghedo-sigma.vercel.app)