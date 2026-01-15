# Research: Full-Stack Todo Web Application (Phase II)

**Feature Branch**: `001-fullstack-todo-webapp`
**Created**: 2026-01-14
**Status**: Complete

## Overview

This document captures research findings and technology decisions for transforming the Phase I console-based Todo application into a full-stack web application.

---

## 1. Backend: SQLModel with PostgreSQL

### Decision
Use SQLModel as the ORM layer connecting FastAPI to Neon PostgreSQL.

### Rationale
- **Native FastAPI Integration**: SQLModel is built by the same creator (Sebastián Ramírez) and designed to work seamlessly with FastAPI
- **Type Safety**: Combines Pydantic validation with SQLAlchemy ORM, providing runtime type checking
- **Minimal Migration**: Existing Pydantic models can be converted to SQLModel with minimal changes
- **Single Model Definition**: One class serves as both database model and API schema

### Alternatives Considered
| Alternative | Why Rejected |
|-------------|--------------|
| SQLAlchemy + Pydantic separately | More boilerplate, duplicate model definitions |
| Tortoise ORM | Less mature, smaller community |
| Raw SQL with psycopg2 | No ORM benefits, manual query building |

### Implementation Pattern
```python
from sqlmodel import SQLModel, Field
from datetime import datetime

class Todo(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    title: str = Field(max_length=200)
    description: str | None = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

---

## 2. Database: Neon PostgreSQL Connection

### Decision
Use Neon PostgreSQL with connection pooling via environment variables.

### Rationale
- **Serverless PostgreSQL**: Neon provides auto-scaling and cost-effective hosting
- **Connection Pooling**: Built-in pooling handles concurrent connections efficiently
- **Environment Configuration**: Standard DATABASE_URL pattern for secure credential management

### Connection Strategy
- Use `create_engine` with connection pool settings
- Implement session dependency injection for FastAPI routes
- Configure pool_size and max_overflow for expected load

### Environment Configuration
```
DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require
```

---

## 3. Frontend: Next.js App Router with TypeScript

### Decision
Use Next.js 14+ App Router with TypeScript for the frontend application.

### Rationale
- **Modern React Patterns**: Server Components, streaming, and suspense support
- **Type Safety**: TypeScript catches errors at compile time
- **File-based Routing**: Intuitive routing structure matching spec requirements
- **API Integration**: Built-in fetch with caching and revalidation

### Alternatives Considered
| Alternative | Why Rejected |
|-------------|--------------|
| Pages Router | Legacy pattern, App Router is recommended |
| Create React App | No longer recommended, lacks SSR/SSG |
| Vite + React | No built-in routing, more configuration needed |

### Project Structure
```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── TodoList.tsx
│   │   ├── TodoItem.tsx
│   │   ├── TodoForm.tsx
│   │   └── EditTodoModal.tsx
│   ├── lib/
│   │   └── api.ts
│   └── types/
│       └── todo.ts
├── public/
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

---

## 4. Styling: Tailwind CSS

### Decision
Use Tailwind CSS for responsive, utility-first styling.

### Rationale
- **Rapid Development**: Utility classes enable fast UI iteration
- **Responsive Design**: Built-in breakpoint system (sm, md, lg, xl)
- **Consistency**: Design tokens ensure consistent spacing, colors, typography
- **Performance**: PurgeCSS removes unused styles in production

### Color Palette (Attractive/Shiny Theme)
```javascript
// tailwind.config.ts - custom theme extensions
colors: {
  primary: {
    50: '#eff6ff',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
  },
  accent: {
    400: '#a78bfa',
    500: '#8b5cf6',
  }
}
```

---

## 5. Animations: Framer Motion

### Decision
Use Framer Motion for declarative, performant animations.

### Rationale
- **React-Native API**: Declarative animations that integrate naturally with React
- **AnimatePresence**: Built-in support for exit animations (critical for delete operations)
- **Layout Animations**: Smooth reordering when todos are added/removed
- **Performance**: Hardware-accelerated transforms, 60fps target achievable

### Alternatives Considered
| Alternative | Why Rejected |
|-------------|--------------|
| CSS Transitions | No exit animations, harder to orchestrate |
| React Spring | More complex API for simple use cases |
| GSAP | Overkill for todo app, larger bundle |

### Animation Patterns
```typescript
// Add animation
<motion.div
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, x: -100 }}
  transition={{ duration: 0.2 }}
>

// Completion toggle
<motion.div
  animate={{ scale: completed ? 1 : 1, opacity: completed ? 0.7 : 1 }}
>
```

---

## 6. API Communication Pattern

### Decision
Use fetch API with a centralized API client for frontend-backend communication.

### Rationale
- **Native Browser API**: No additional dependencies needed
- **Type Safety**: Generic fetch wrapper with TypeScript
- **Error Handling**: Centralized error handling and retry logic
- **Base URL Configuration**: Environment-based API URL

### API Client Pattern
```typescript
// lib/api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function fetchTodos(): Promise<Todo[]> {
  const res = await fetch(`${API_BASE}/todos`);
  if (!res.ok) throw new Error('Failed to fetch todos');
  return res.json();
}
```

---

## 7. State Management

### Decision
Use React hooks (useState, useEffect) with optimistic updates for local state.

### Rationale
- **Simplicity**: No external state library needed for this scope
- **Optimistic Updates**: Better UX by updating UI before server confirmation
- **Server State**: Fetch on mount, refetch after mutations

### Alternatives Considered
| Alternative | Why Rejected |
|-------------|--------------|
| Redux | Overkill for single-entity CRUD |
| Zustand | Adds dependency for simple state |
| React Query/SWR | Could be added later if caching needs grow |

---

## 8. Development Workflow

### Decision
Run backend and frontend independently during development.

### Backend (Port 8000)
```bash
cd backend
uv run uvicorn src.main:app --reload --port 8000
```

### Frontend (Port 3000)
```bash
cd frontend
npm run dev
```

### CORS Configuration
Backend already configured with permissive CORS for development (all origins allowed).

---

## 9. Database Migration Strategy

### Decision
Use SQLModel's `create_all` for initial schema creation, with Alembic-ready structure.

### Rationale
- **Phase II Scope**: Simple schema, single table - `create_all` sufficient
- **Future-Ready**: Directory structure supports Alembic migration files
- **Reversibility**: Schema changes documented in data-model.md

### Migration Approach
```python
# On application startup
SQLModel.metadata.create_all(engine)
```

---

## 10. Error Handling Strategy

### Decision
Implement consistent error handling across frontend and backend.

### Backend
- Return appropriate HTTP status codes (400, 404, 500)
- Include error messages in JSON response body
- Log errors for debugging

### Frontend
- Display user-friendly error messages via toast/alert
- Implement retry logic for transient failures
- Show loading states during API operations

---

## Summary of Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Backend Framework | FastAPI | 0.100+ |
| Backend ORM | SQLModel | 0.0.14+ |
| Database | Neon PostgreSQL | Latest |
| Frontend Framework | Next.js | 14+ |
| Frontend Language | TypeScript | 5+ |
| Styling | Tailwind CSS | 3.4+ |
| Animations | Framer Motion | 10+ |
| Package Manager (Python) | uv | Latest |
| Package Manager (Node) | npm | 10+ |

---

## Open Questions Resolved

All technical unknowns from the specification have been resolved:

- ✅ ORM choice: SQLModel
- ✅ Database connection: Neon PostgreSQL with pooling
- ✅ Frontend architecture: Next.js App Router
- ✅ Styling approach: Tailwind CSS utilities
- ✅ Animation library: Framer Motion
- ✅ State management: React hooks (no external library)
- ✅ API communication: Native fetch with typed client
- ✅ Migration strategy: SQLModel create_all (Alembic-ready)
