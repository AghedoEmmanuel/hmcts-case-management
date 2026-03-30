# HMCTS Case Management System

A full-stack case management task application built for HMCTS, enabling caseworkers to create, view, update, and delete tasks linked to case references.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, ShadCN UI |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL |
| Testing | Jest, Supertest, React Testing Library |
| Dev Tools | ts-node, ESLint, dotenv |

---

## Features

- Create tasks with title, description, priority, due date, assigned caseworker, and case reference
- View all tasks in a sortable list
- Update task details and status (pending / in-progress / completed)
- Delete tasks
- RESTful API with full CRUD support
- Unit and integration tests with coverage reporting
- Input validation and structured error responses

---

## Project Structure
```
hmcts-case-management/
├── frontend/                  # Next.js application
│   ├── src/
│   │   ├── app/               # App router pages
│   │   ├── components/        # UI components (ShadCN + custom)
│   │   └── lib/               # API client utilities
│   ├── jest.config.ts
│   └── jest.setup.ts
│
└── backend/                   # Express API
    ├── src/
    │   ├── config/
    │   │   └── db.ts           # PostgreSQL connection pool
    │   ├── controllers/
    │   │   └── taskController.ts
    │   ├── models/
    │   │   └── taskModel.ts    # Table schema + init
    │   ├── routes/
    │   │   └── taskRoutes.ts
    │   └── index.ts            # Server entry point
    ├── tests/
    │   └── tasks.test.ts       # API integration tests
    └── jest.config.ts
```

---

## Prerequisites

- Node.js v18+
- PostgreSQL v14+
- npm v9+

---

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/AghedoEmmanuel/hmcts-case-management.git
cd hmcts-case-management
```

### 2. Set up the database

Open your PostgreSQL client (psql or pgAdmin) and run:
```sql
CREATE DATABASE hmcts_tasks;
```

### 3. Configure environment variables

Create a `.env` file inside the `backend/` folder:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hmcts_tasks
DB_USER=postgres
DB_PASSWORD=your_password_here
```

Create a `.env.local` file inside the `frontend/` folder:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 4. Install dependencies and run the backend
```bash
cd backend
npm install
npx ts-node src/index.ts
```

The API will be available at `http://localhost:5000`. The tasks table is created automatically on first run.

### 5. Install dependencies and run the frontend

Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## API Reference

Base URL: `http://localhost:5000/api`

### Tasks

| Method | Endpoint | Description |
|---|---|---|
| GET | `/tasks` | Get all tasks |
| GET | `/tasks/:id` | Get a single task by ID |
| POST | `/tasks` | Create a new task |
| PUT | `/tasks/:id` | Update an existing task |
| DELETE | `/tasks/:id` | Delete a task |

### Request body — POST / PUT
```json
{
  "title": "Prepare hearing bundle",
  "description": "Collate documents ahead of the 14 June hearing",
  "status": "pending",
  "priority": "high",
  "due_date": "2025-06-10",
  "assigned_to": "Sarah Okafor",
  "case_reference": "HMCTS-2025-001"
}
```

### Status values
`pending` | `in-progress` | `completed`

### Priority values
`low` | `medium` | `high`

### Example response — GET /tasks/:id
```json
{
  "id": 1,
  "title": "Prepare hearing bundle",
  "description": "Collate documents ahead of the 14 June hearing",
  "status": "pending",
  "priority": "high",
  "due_date": "2025-06-10T00:00:00.000Z",
  "assigned_to": "Sarah Okafor",
  "case_reference": "HMCTS-2025-001",
  "created_at": "2025-05-01T10:30:00.000Z",
  "updated_at": "2025-05-01T10:30:00.000Z"
}
```

### Health check
```
GET /health
```

Returns `{ "status": "HMCTS Case Management API is running" }`

---

## Running Tests

### Backend tests
```bash
cd backend
npm test
```

Runs all API integration tests using Jest and Supertest with coverage reporting. Tests cover:

- GET all tasks
- GET task by ID (found + not found)
- POST create task (valid + missing title)
- PUT update task (found + not found)
- DELETE task (found + not found)

### Frontend tests
```bash
cd frontend
npm test
```

---

## Database Schema
```sql
CREATE TABLE tasks (
  id             SERIAL PRIMARY KEY,
  title          VARCHAR(255) NOT NULL,
  description    TEXT,
  status         VARCHAR(50)  DEFAULT 'pending',
  priority       VARCHAR(20)  DEFAULT 'medium',
  due_date       DATE,
  assigned_to    VARCHAR(255),
  case_reference VARCHAR(100),
  created_at     TIMESTAMP    DEFAULT NOW(),
  updated_at     TIMESTAMP    DEFAULT NOW()
);
```

---

## Security Considerations

This project was built with security awareness informed by an MSc in Cybersecurity (Teesside University):

- Environment variables used for all database credentials — never hardcoded
- CORS configured on the Express server
- Parameterised SQL queries throughout — no raw string concatenation, preventing SQL injection
- Input validation at the controller layer
- `.env` files excluded from version control via `.gitignore`

---

## .gitignore

Make sure your root `.gitignore` includes:
```
node_modules/
.env
.env.local
dist/
coverage/
.next/
```

---

## Author

Emmanuel Aghedo  
GitHub: [AghedoEmmanuel](https://github.com/AghedoEmmanuel)  
Portfolio: [aghedo-sigma.vercel.app](https://aghedo-sigma.vercel.app)