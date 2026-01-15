<!--
  Sync Impact Report
  ===================
  Version change: 0.0.0 → 1.0.0 (MAJOR: Initial constitution creation)

  Modified principles: N/A (initial creation)

  Added sections:
  - I. Correctness (new)
  - II. Clarity (new)
  - III. Reproducibility (new)
  - IV. Modularity (new)
  - V. AI-Native Design (new)
  - VI. Security-First (new)
  - Technology Standards (new)
  - Development Workflow (new)
  - Governance (new)

  Removed sections: N/A (initial creation)

  Templates requiring updates:
  - ✅ .specify/templates/plan-template.md (no updates needed - compatible)
  - ✅ .specify/templates/spec-template.md (no updates needed - compatible)
  - ✅ .specify/templates/tasks-template.md (no updates needed - compatible)

  Follow-up TODOs: None

  Ratification: Initial adoption for AI-Native Full-Stack Todo Application project.
-->

# AI-Native Full-Stack Todo Application Constitution

## Core Principles

### I. Correctness

All features MUST behave as specified and pass defined tests. This principle is
non-negotiable and applies across all three project phases.

- Every feature MUST have explicit acceptance criteria before implementation
- All code MUST pass unit tests for core logic and API tests for backend endpoints
- Phase transitions (I → II → III) MUST NOT break previously working functionality
- Test coverage MUST include both happy paths and edge cases/error scenarios

### II. Clarity

Code, APIs, and prompts MUST be readable and well-documented. Clarity enables
collaboration, maintenance, and evaluation.

- Python code MUST follow PEP8 standards
- JavaScript/TypeScript code MUST pass ESLint and Prettier validation
- Each phase MUST have its own README with setup, run, and deployment instructions
- Backend APIs MUST include OpenAPI/Swagger documentation
- AI prompts and agent configurations MUST be documented with expected behaviors

### III. Reproducibility

The project MUST be runnable from scratch using provided instructions. Any
evaluator or team member MUST be able to set up and run any phase independently.

- Environment configuration MUST use `.env` files with documented templates
- All dependencies MUST be explicitly declared (requirements.txt, package.json)
- Setup instructions MUST be complete and tested on clean environments
- Database migrations MUST be versioned and reversible

### IV. Modularity

Each phase MUST build cleanly on the previous one while maintaining clear
separation of concerns.

- Phase I: Clear separation between data layer, business logic, and CLI interface
- Phase II: Distinct frontend (Next.js), backend (FastAPI), and database (Neon DB) layers
- Phase III: AI agent layer MUST interact with Phase II backend via defined APIs
- Cross-cutting concerns (logging, validation, error handling) MUST be centralized

### V. AI-Native Design

AI features MUST be intentional, safe, and context-aware. The AI chatbot MUST
enhance user experience without introducing unsafe behaviors.

- AI agents MUST understand user intent before executing tool calls
- All destructive actions (delete, update) MUST require explicit confirmation
- Conversation context MUST be maintained across interactions
- Guardrails MUST prevent invalid or destructive batch operations
- Tool access via MCP SDK MUST be structured and auditable

### VI. Security-First

Security MUST be embedded into every phase, not bolted on afterward.

- Input validation MUST occur at all system boundaries
- Secrets and credentials MUST NEVER be hardcoded; use environment variables
- Phase II MUST have authentication-ready architecture
- SQL injection, XSS, and other OWASP Top 10 vulnerabilities MUST be prevented
- AI agent tool calls MUST be validated before execution

## Technology Standards

Phase-specific technology requirements that MUST be followed:

**Phase I – In-Memory Console App**
- Language: Python (latest stable version)
- Storage: In-memory only (no external database)
- Interface: Menu-driven CLI with stdin/stdout
- Structure: Separate modules for data, logic, and UI

**Phase II – Full-Stack Web Application**
- Frontend: Next.js with TypeScript
- Backend: FastAPI with Python
- ORM: SQLModel for schema and data modeling
- Database: Neon DB (PostgreSQL)
- Error handling: Proper HTTP status codes and error responses

**Phase III – AI-Powered Todo Chatbot**
- Chat Interface: OpenAI ChatKit
- Orchestration: OpenAI Agents SDK
- Tool Access: Official MCP SDK
- Capabilities: Natural language CRUD operations with context awareness

## Development Workflow

Git-based workflow and quality gates that MUST be followed:

- Version Control: Git with meaningful, atomic commits
- Branching: Feature branches with descriptive names
- Code Review: All changes MUST be reviewed before merge
- Testing Gates:
  - Unit tests MUST pass before PR creation
  - Integration tests MUST pass before merge
  - API contract tests MUST validate endpoint behavior
- Documentation: Update relevant docs with each feature change

## Governance

This constitution is the authoritative source for project standards and practices.

**Amendment Process:**
1. Propose change with rationale and impact analysis
2. Review against project goals and existing principles
3. Document decision (approve/reject) with reasoning
4. If approved, update constitution and increment version
5. Propagate changes to dependent templates and documentation

**Versioning Policy:**
- MAJOR: Backward-incompatible changes to principles or requirements
- MINOR: New principles, sections, or materially expanded guidance
- PATCH: Clarifications, wording improvements, typo fixes

**Compliance Review:**
- All PRs MUST verify compliance with applicable principles
- Phase transitions MUST include constitution compliance checklist
- Architectural decisions MUST reference relevant principles

**Version**: 1.0.0 | **Ratified**: 2026-01-13 | **Last Amended**: 2026-01-13
