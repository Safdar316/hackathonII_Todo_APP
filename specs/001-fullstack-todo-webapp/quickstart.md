# Quickstart: Full-Stack Todo Web Application (Phase II)

**Feature Branch**: `001-fullstack-todo-webapp`
**Created**: 2026-01-14

This guide helps you set up and run the Phase II Full-Stack Todo application.

---

## Prerequisites

- **Python**: 3.10+
- **Node.js**: 18+
- **uv**: Python package manager ([install](https://docs.astral.sh/uv/getting-started/installation/))
- **npm**: Node package manager (comes with Node.js)
- **Neon Account**: PostgreSQL database ([neon.tech](https://neon.tech))

---

## Project Structure

```
/
├── backend/           # FastAPI application (existing Phase I code)
│   ├── src/
│   │   ├── main.py
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│   ├── tests/
│   ├── pyproject.toml
│   └── .env           # Create this file
│
├── frontend/          # Next.js application (to be created)
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   └── lib/
│   ├── package.json
│   └── .env.local     # Create this file
│
└── specs/             # Feature specifications
```

---

## Step 1: Database Setup

### 1.1 Create Neon Database
1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string

### 1.2 Configure Backend Environment
Create `backend/.env`:
```env
DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require
```

---

## Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment and install dependencies
uv venv
uv pip install fastapi uvicorn sqlmodel psycopg2-binary python-dotenv

# Or if pyproject.toml has dependencies defined:
uv sync

# Run the server
uv run uvicorn src.main:app --reload --port 8000
```

### Verify Backend
- Open http://localhost:8000 - should show API info
- Open http://localhost:8000/docs - Swagger UI

---

## Step 3: Frontend Setup

```bash
# Navigate to project root
cd ..

# Create Next.js application
npx create-next-app@latest frontend --typescript --tailwind --app --src-dir --no-eslint

# Navigate to frontend directory
cd frontend

# Install additional dependencies
npm install framer-motion

# Configure API URL
# Create frontend/.env.local:
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Run the development server
npm run dev
```

### Verify Frontend
- Open http://localhost:3000 - should show Next.js welcome page

---

## Step 4: Running Both Services

### Terminal 1 - Backend
```bash
cd backend
uv run uvicorn src.main:app --reload --port 8000
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

### Access Points
| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:3000 | User interface |
| Backend | http://localhost:8000 | API server |
| API Docs | http://localhost:8000/docs | Swagger UI |

---

## Step 5: Test API Endpoints

### Create Todo
```bash
curl -X POST http://localhost:8000/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Test todo", "description": "Testing the API"}'
```

### List Todos
```bash
curl http://localhost:8000/todos
```

### Update Todo
```bash
curl -X PUT http://localhost:8000/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

### Delete Todo
```bash
curl -X DELETE http://localhost:8000/todos/1
```

---

## Environment Variables Reference

### Backend (`backend/.env`)
| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Neon PostgreSQL connection string |

### Frontend (`frontend/.env.local`)
| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Yes | Backend API base URL |

---

## Common Issues

### CORS Errors
- Backend already configured with permissive CORS for development
- Ensure backend is running before frontend API calls

### Database Connection Failed
- Verify DATABASE_URL is correct
- Check Neon dashboard for connection status
- Ensure `?sslmode=require` is in connection string

### Port Conflicts
- Backend default: 8000 (change with `--port` flag)
- Frontend default: 3000 (change in package.json scripts)

### Dependencies Not Found
- Backend: Run `uv pip install <package>` or `uv sync`
- Frontend: Run `npm install`

---

## Development Workflow

1. **Start backend** in Terminal 1
2. **Start frontend** in Terminal 2
3. **Edit code** - both servers auto-reload
4. **Test changes** in browser at http://localhost:3000
5. **Check API** via Swagger at http://localhost:8000/docs

---

## Next Steps

After setup is complete:
1. Run `/sp.tasks` to generate implementation tasks
2. Implement backend database integration (SQLModel)
3. Build frontend components (TodoList, TodoItem, TodoForm)
4. Add Framer Motion animations
5. Test full CRUD flow
