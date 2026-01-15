# Todo App - Full-Stack Task Manager

A beautiful, modern full-stack todo application built with FastAPI and Next.js featuring smooth animations, dark/light theme support, and cloud database integration.

![Todo App](https://img.shields.io/badge/Status-Active-success)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688)
![Next.js](https://img.shields.io/badge/Frontend-Next.js%2016-black)
![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6)
![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS%20v4-38B2AC)

## Features

- **Full CRUD Operations** - Create, Read, Update, and Delete todos
- **Animated UI** - Smooth animations powered by Framer Motion
- **Dark/Light Theme** - Toggle between themes with localStorage persistence
- **Responsive Design** - Mobile-first approach, works on all devices
- **Cloud Database** - PostgreSQL hosted on Neon DB
- **Real-time Updates** - Optimistic updates for instant feedback
- **Modern Stack** - Built with the latest technologies

## Tech Stack

### Backend
- **FastAPI** - High-performance Python web framework
- **SQLModel** - SQL databases in Python with type hints
- **PostgreSQL** - Robust relational database (Neon DB)
- **uv** - Fast Python package manager
- **Pydantic** - Data validation using Python type annotations

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS v4** - Utility-first CSS framework
- **Framer Motion** - Production-ready motion library
- **React Hooks** - Modern state management

## Project Structure

```
hackathonII_Todo_APP/
├── backend/
│   ├── src/
│   │   ├── models/          # SQLModel database models
│   │   ├── routes/          # API route handlers
│   │   ├── services/        # Business logic layer
│   │   ├── database.py      # Database configuration
│   │   └── main.py          # FastAPI application entry
│   ├── tests/               # Unit and integration tests
│   ├── pyproject.toml       # Python dependencies
│   └── .env.example         # Environment variables template
│
├── frontend/
│   ├── src/
│   │   ├── app/             # Next.js App Router pages
│   │   ├── components/      # React components
│   │   ├── context/         # React Context providers
│   │   └── types/           # TypeScript type definitions
│   ├── public/              # Static assets
│   ├── package.json         # Node.js dependencies
│   └── .env.example         # Environment variables template
│
├── specs/                   # Feature specifications
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

4. Install dependencies and run:
   ```bash
   uv sync
   uv run uvicorn src.main:app --reload
   ```

5. Backend will be running at `http://localhost:8000`
   - API Docs: `http://localhost:8000/docs`

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

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| GET | `/todos` | Get all todos |
| POST | `/todos` | Create a new todo |
| GET | `/todos/{id}` | Get a specific todo |
| PUT | `/todos/{id}` | Update a todo |
| DELETE | `/todos/{id}` | Delete a todo |

### Example API Request

```bash
# Create a new todo
curl -X POST http://localhost:8000/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn FastAPI", "description": "Build awesome APIs"}'

# Get all todos
curl http://localhost:8000/todos

# Toggle todo completion
curl -X PUT http://localhost:8000/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

## Components

### Frontend Components

| Component | Description |
|-----------|-------------|
| `TodoForm` | Form for creating new todos with validation |
| `TodoItem` | Individual todo card with edit/delete/toggle |
| `TodoList` | Container that fetches and displays all todos |
| `ThemeToggle` | Animated sun/moon theme switcher |
| `EmptyState` | Displayed when no todos exist |
| `LoadingSpinner` | Multi-layer animated loading indicator |
| `EditTodoModal` | Modal for editing existing todos |
| `ErrorMessage` | Error display component |

## Screenshots

### Light Mode
- Clean, bright interface with subtle shadows
- Blue/Purple gradient accents
- Animated hero section with floating blobs

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

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Built during Hackathon II
- Powered by Claude AI assistance
- Icons from Heroicons
- Animations by Framer Motion

---

Made with love using FastAPI, Next.js, and Framer Motion
