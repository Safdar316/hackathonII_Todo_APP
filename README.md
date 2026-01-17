# Todo App - Full-Stack Task Manager

A beautiful, modern full-stack todo application built with FastAPI and Next.js featuring smooth animations, dark/light theme support, priority management, tagging system, and cloud database integration.

![Todo App](https://img.shields.io/badge/Status-Active-success)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688)
![Next.js](https://img.shields.io/badge/Frontend-Next.js%2016-black)
![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6)
![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS%20v4-38B2AC)
![Phase](https://img.shields.io/badge/Phase-II-blue)

## Features

### Core Features
- **Full CRUD Operations** - Create, Read, Update, and Delete todos
- **Animated UI** - Smooth animations powered by Framer Motion
- **Dark/Light Theme** - Toggle between themes with localStorage persistence
- **Responsive Design** - Mobile-first approach, works on all devices
- **Cloud Database** - PostgreSQL hosted on Neon DB
- **Real-time Updates** - Optimistic updates for instant feedback

### Phase II Features
- **Priority Management** - Assign Low, Medium, or High priority to tasks with visual indicators
- **Due Dates** - Set deadlines with date/time picker and overdue highlighting
- **Tag System** - Organize todos with custom tags and colors
- **Search** - Full-text search across todo titles and descriptions
- **Advanced Filtering** - Filter by priority, tags, completion status, and date range
- **Sorting** - Sort by priority, due date, creation date, or title
- **Recurring Tasks** - Set daily, weekly, or monthly task recurrence
- **Reminders** - Browser notifications for upcoming deadlines

## Tech Stack

### Backend
- **FastAPI** - High-performance Python web framework
- **SQLModel** - SQL databases in Python with type hints
- **PostgreSQL** - Robust relational database (Neon DB)
- **Alembic** - Database migrations management
- **uv** - Fast Python package manager
- **Pydantic** - Data validation using Python type annotations

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS v4** - Utility-first CSS framework
- **Framer Motion** - Production-ready motion library
- **date-fns** - Modern date utility library
- **React Hooks** - Modern state management

## Project Structure

```
hackathonII_Todo_APP/
├── backend/
│   ├── src/
│   │   ├── models/          # SQLModel database models
│   │   │   └── todo.py      # Todo and Tag models
│   │   ├── routes/          # API route handlers
│   │   │   ├── todos.py     # Todo CRUD + filtering
│   │   │   └── tags.py      # Tag management
│   │   ├── services/        # Business logic layer
│   │   │   ├── todo_service.py
│   │   │   └── tag_service.py
│   │   ├── database.py      # Database configuration
│   │   └── main.py          # FastAPI application entry
│   ├── migrations/          # Alembic database migrations
│   │   └── versions/        # Migration scripts
│   ├── tests/               # Unit and integration tests
│   ├── alembic.ini          # Alembic configuration
│   ├── pyproject.toml       # Python dependencies
│   └── .env.example         # Environment variables template
│
├── frontend/
│   ├── src/
│   │   ├── app/             # Next.js App Router pages
│   │   ├── components/      # React components
│   │   │   ├── TodoForm.tsx
│   │   │   ├── TodoItem.tsx
│   │   │   ├── TodoList.tsx
│   │   │   ├── EditTodoModal.tsx
│   │   │   ├── PrioritySelector.tsx
│   │   │   ├── DateTimePicker.tsx
│   │   │   ├── TagInput.tsx
│   │   │   ├── TagFilter.tsx
│   │   │   ├── SearchInput.tsx
│   │   │   ├── FilterPanel.tsx
│   │   │   ├── DateRangeFilter.tsx
│   │   │   └── RecurrenceSelector.tsx
│   │   ├── hooks/           # Custom React hooks
│   │   │   └── useReminders.ts
│   │   ├── context/         # React Context providers
│   │   └── types/           # TypeScript type definitions
│   ├── public/              # Static assets
│   ├── package.json         # Node.js dependencies
│   └── .env.example         # Environment variables template
│
├── specs/                   # Feature specifications
│   └── 002-todo-phase-ii/   # Phase II spec & plan
├── history/                 # Development history
└── README.md
```

## Getting Started

### Prerequisites

- Python 3.12+
- Node.js 18+
- PostgreSQL database (or Neon DB account)
- uv (Python package manager)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create environment file:
   ```bash
   cp .env.example .env
   ```

3. Add your database URL to `.env`:
   ```
   DATABASE_URL=postgresql://user:password@host/database?sslmode=require
   ```

4. Install dependencies:
   ```bash
   uv sync
   ```

5. Run database migrations:
   ```bash
   uv run alembic upgrade head
   ```

6. Start the server:
   ```bash
   uv run uvicorn src.main:app --reload
   ```

7. Backend will be running at `http://localhost:8000`
   - API Docs: `http://localhost:8000/docs`
   - ReDoc: `http://localhost:8000/redoc`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Create environment file:
   ```bash
   cp .env.example .env.local
   ```

3. Update the API URL in `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

4. Install dependencies and run:
   ```bash
   npm install
   npm run dev
   ```

5. Frontend will be running at `http://localhost:3000`

## API Endpoints

### Todos

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| GET | `/todos` | Get all todos (with filtering) |
| POST | `/todos` | Create a new todo |
| GET | `/todos/{id}` | Get a specific todo |
| PUT | `/todos/{id}` | Update a todo |
| DELETE | `/todos/{id}` | Delete a todo |

### Tags

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tags` | Get all tags |
| POST | `/tags` | Create a new tag |
| PUT | `/tags/{id}` | Update a tag |
| DELETE | `/tags/{id}` | Delete a tag |

### Query Parameters for `/todos`

| Parameter | Type | Description |
|-----------|------|-------------|
| `search` | string | Search in title and description |
| `priority` | string | Filter by priority (low, medium, high) |
| `completed` | boolean | Filter by completion status |
| `tag_ids` | array | Filter by tag IDs |
| `due_before` | datetime | Filter todos due before date |
| `due_after` | datetime | Filter todos due after date |
| `sort_by` | string | Sort field (priority, due_date, created_at, title) |
| `sort_order` | string | Sort direction (asc, desc) |

### Example API Requests

```bash
# Create a new todo with priority and due date
curl -X POST http://localhost:8000/todos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Learn FastAPI",
    "description": "Build awesome APIs",
    "priority": "high",
    "due_date": "2026-01-20T10:00:00Z"
  }'

# Get all high-priority todos
curl "http://localhost:8000/todos?priority=high"

# Search todos
curl "http://localhost:8000/todos?search=fastapi"

# Get todos due this week, sorted by priority
curl "http://localhost:8000/todos?due_before=2026-01-24T00:00:00Z&sort_by=priority&sort_order=desc"

# Create a tag
curl -X POST http://localhost:8000/tags \
  -H "Content-Type: application/json" \
  -d '{"name": "work", "color": "#3B82F6"}'
```

## Components

### Frontend Components

| Component | Description |
|-----------|-------------|
| `TodoForm` | Form for creating new todos with priority, due date, and tags |
| `TodoItem` | Individual todo card with priority indicator and tag badges |
| `TodoList` | Container with search, filter, and sort controls |
| `EditTodoModal` | Modal for editing todos with all Phase II fields |
| `PrioritySelector` | Dropdown for selecting task priority |
| `DateTimePicker` | Date and time picker for due dates |
| `TagInput` | Tag selection and creation component |
| `TagFilter` | Filter todos by selected tags |
| `SearchInput` | Real-time search input with debouncing |
| `FilterPanel` | Combined filtering controls panel |
| `DateRangeFilter` | Date range picker for filtering |
| `RecurrenceSelector` | Set task recurrence pattern |
| `ThemeToggle` | Animated sun/moon theme switcher |
| `EmptyState` | Displayed when no todos exist |
| `LoadingSpinner` | Multi-layer animated loading indicator |
| `ErrorMessage` | Error display component |

### Custom Hooks

| Hook | Description |
|------|-------------|
| `useReminders` | Manages browser notifications for upcoming due dates |

## Data Models

### Todo

```typescript
interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  recurrence?: 'none' | 'daily' | 'weekly' | 'monthly';
  tags: Tag[];
  created_at: string;
  updated_at: string;
}
```

### Tag

```typescript
interface Tag {
  id: number;
  name: string;
  color: string;
}
```

## Screenshots

### Light Mode
- Clean, bright interface with subtle shadows
- Priority badges with color coding (red/yellow/green)
- Tag chips with custom colors
- Blue/Purple gradient accents

### Dark Mode
- Dark slate background
- Brighter gradient accents for visibility
- Smooth transition between themes

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://...
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Database Migrations

```bash
# Create a new migration
cd backend
uv run alembic revision --autogenerate -m "description"

# Apply migrations
uv run alembic upgrade head

# Rollback one migration
uv run alembic downgrade -1
```

## Development

### Running Tests

```bash
# Backend tests
cd backend
uv run pytest

# Frontend lint
cd frontend
npm run lint
```

### Building for Production

```bash
# Frontend build
cd frontend
npm run build
npm start
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Roadmap

- [x] Phase I: Basic CRUD operations
- [x] Phase II: Priority, tags, search, filtering
- [ ] Phase III: User authentication
- [ ] Phase IV: Collaboration features

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Built during Hackathon II
- Powered by Claude AI assistance
- Icons from Heroicons
- Animations by Framer Motion

---

Made with love using FastAPI, Next.js, and Framer Motion
