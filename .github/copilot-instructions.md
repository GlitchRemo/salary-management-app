# Copilot Instructions

These instructions define the engineering standards and workflow for this project.

The goal is to build maintainable, production-quality software while leveraging AI intentionally.

---

# Development Philosophy

Prefer:

* Simplicity over cleverness.
* Readability over abstraction.
* Maintainability over premature optimization.
* Small changes over large changes.
* Reviewability over speed.
* Industry standards over custom patterns.

Avoid overengineering.

The best code is boring code.

---

# Repository Awareness

Before planning or implementing anything:

Search and understand the repository.

Always review:

* specs/roadmap.md
* specs/architecture/
* specs/business/
* specs/api/
* specs/database/
* specs/ui/
* specs/testing/
* .agents/prompts/
* existing source code

Do not assume the current file contains the complete context.

Treat the repository as the source of truth.

---

# Source of Truth

Implementation should follow:

roadmap

↓

architecture specifications

↓

business specifications

↓

API specifications

↓

database specifications

↓

UI specifications

↓

testing specifications

↓

implementation

Never invent requirements.

Never implement functionality outside the current phase.

---

# Prompt Awareness

Before implementing:

Review the available prompts in:

.agents/prompts/

including:

* README.md
* spec-generator.md
* test-generator.md
* refactor-guide.md

Reuse existing prompts whenever possible.

Avoid inventing new prompts unless necessary.

If a new prompt would improve maintainability or future work:

Propose creating it.

---

# Keep Artifacts Synchronized

Whenever introducing:

* A new feature
* A new endpoint
* A new domain model
* A new workflow
* A new UI component

Review whether the following require updates:

* specs/roadmap.md
* specs/architecture/
* specs/business/
* specs/api/
* specs/database/
* specs/ui/
* specs/testing/
* .agents/prompts/
* README.md
* tests

Keep documentation synchronized with implementation.

---

# Explain Before Coding

Before generating code:

* Explain the approach.
* Identify affected files.
* Identify tests to add.
* Explain tradeoffs.

Then implement.

Do not immediately generate code.

---

# Plan Before Implementing

Before writing code:

1. Explain understanding of the current phase.
2. List relevant specifications consulted.
3. Identify affected files.
4. Identify tests to add.
5. Explain tradeoffs.
6. Propose the smallest atomic change.
7. Then implement.

---

# Incremental Development

Always implement the smallest possible vertical slice.

Prefer:

* One schema.
* One endpoint.
* One component.
* One test suite.
* One commit.

Generated code should be easy for humans to review.

Avoid giant changes.

---

# Commit Discipline

One commit should represent one logical change.

Good examples:

* feat: add employee schema
* test: add employee service tests
* feat: implement employee repository
* feat: expose employee endpoint
* feat: build employee table

Avoid giant commits.

Optimize commit history for readability.

---

# New Feature Workflow

For new features follow this order:

1. Update roadmap.md.
2. Update architecture specifications if necessary.
3. Update business specifications if necessary.
4. Update API specifications if necessary.
5. Update database specifications if necessary.
6. Update UI specifications if necessary.
7. Update testing specifications if necessary.
8. Update prompts if necessary.
9. Write tests.
10. Implement the minimum code required.
11. Refactor.
12. Commit.

Never skip specification updates.

---

# Testing First

Whenever possible:

1. Write tests.
2. Run tests.
3. Implement the minimum code required.
4. Ensure tests pass.
5. Refactor if necessary.

Focus on behavior.

Avoid testing implementation details.

Tests should be:

* Fast.
* Deterministic.
* Isolated.
* Readable.

Mock repositories.

Avoid database dependencies in unit tests.

---

# Search Existing Code First

Before creating:

* Component
* Hook
* Utility
* Type
* Constant
* Service
* Repository
* Schema

Search the codebase.

Reuse existing code whenever possible.

Avoid duplication.

Follow DRY principles.

---

# TypeScript Standards

Forbidden:

* any
* @ts-ignore
* eslint-disable
* Type assertions (`as SomeType`, `as unknown as SomeType`) — use proper typing instead

Avoid:

* unknown unless absolutely necessary

Prefer:

* explicit types
* interfaces
* type aliases
* enums
* readonly types
* discriminated unions
* `declare global` to extend globalThis instead of casting it
* `vi.mocked()` to type mocked functions in tests instead of casting

All functions should have explicit return types.

Avoid implicit any.

Use meaningful names.

---

# Naming

Prefer:

* EmployeeService
* AnalyticsRepository
* SalaryAudit

Avoid:

* Helper
* Utils
* Manager
* Stuff
* Misc

Names should communicate intent.

---

# Architecture

Use feature-based organization.

Prefer:

* auth/
* employee/
* analytics/
* shared/

Avoid root-level folders like:

* controllers/
* services/
* repositories/

---

# Feature Structure

Each feature should contain:

* controller
* service
* repository
* mapper
* types
* schemas
* tests

Example:

employee/

* employee.controller.ts
* employee.service.ts
* employee.repository.ts
* employee.mapper.ts
* employee.types.ts
* employee.schemas.ts
* employee.test.ts

Types live in `<feature>.types.ts`.

Never define exported types inline inside a service, repository, or controller.
Services and repositories re-export their types from the `.types.ts` file using `export type { ... } from`.
Test files import types directly from `.types.ts`, not from the implementation file.

---

# Layer Responsibilities

## Controller

Responsible for:

* HTTP
* Request parsing
* Response mapping

Should not contain business logic.

---

## Service

Responsible for:

* Business rules
* Validation orchestration

Should not contain database access.

---

## Repository

Responsible for:

* Prisma queries
* Database access

Should not contain business logic.

---

## Middleware

Responsible for:

* Authentication
* Logging
* Error handling

Keep middleware focused.

---

# Database

Database:

* SQLite

ORM:

* Prisma

Use:

* Enums
* Relations
* Timestamps

Use migrations.

Never edit database tables manually.

Repositories own database access.

Services must not contain Prisma queries.

Avoid duplicated columns.

Avoid denormalization unless justified.

---

# DTOs and Mapping

Never expose Prisma entities directly.

Flow:

Repository Entity

↓

Mapper

↓

DTO

↓

API Response

Use explicit request and response types.

API contracts should evolve independently of database entities.

---

# Validation

Use Zod for all external input.

Validate:

* Request body
* Query parameters
* Route parameters

Do not rely solely on TypeScript.

Avoid manual validation logic.

---

# Error Handling

Use centralized error handling.

Create:

* AppError
* ValidationError
* NotFoundError

Avoid try/catch blocks everywhere.

Business errors should be explicit.

---

# Dependency Injection

Use constructor injection.

Service dependencies should be passed explicitly.

Avoid:

* Global singletons
* IoC containers
* Service locators

Prefer straightforward code.

---

# Material UI

Material UI v6 is the primary component library.

Before creating custom components:

Check Material UI first.

Prefer:

* DataGrid
* Table
* Card
* Dialog
* Drawer
* AppBar
* Pagination
* Select
* TextField

Avoid rebuilding components that already exist.

Use composition instead of excessive customization.

Use `sx` prop for all style overrides — never `fontWeight`, `textAlign`, or spacing shorthand as direct props on MUI components.

All theme values (colours, typography, spacing) live in `app/theme.ts`.

The petrol + off-white theme:

* Primary: `#005F6B`
* Background default: `#F7F7F5`

Do not hardcode these values outside of `app/theme.ts`.

---

# UI Principles

Follow Atomic Design.

### Atoms

* Button
* Input
* Typography

### Molecules

* SearchBar
* CountryFilter
* DepartmentFilter

### Organisms

* EmployeeTable
* SalaryUpdateModal
* TopEarnersTable

### Templates

* DashboardLayout

### Pages

* DashboardPage
* EmployeesPage
* EmployeeDetailsPage
* AnalyticsPage

Prefer smaller components.

Avoid large page files.

Soft limit:

300 lines per file.

Split files when they become large.

---

# React and Next.js

Use:

* Functional components
* Hooks
* Server Components where appropriate

Avoid:

* Class components

Keep components focused.

---

# State Management

Prefer:

* Local state

Use React Query for server state.

Avoid:

* Redux
* Global state unless necessary

Keep state close to where it is used.

---

# API Design

Prefer REST.

Use:

* GET
* POST
* PATCH

Endpoints should be resource-oriented.

Return typed responses.

Avoid unnecessary endpoints.

---

# Analytics

Analytics logic belongs inside AnalyticsService.

Avoid putting aggregate queries inside EmployeeService.

Prefer pure functions.

Keep analytics isolated.

---

# Performance

Optimize for clarity first.

10,000 employees is small enough for SQLite.

Avoid:

* Caching
* Queues
* Background workers

Do not optimize prematurely.

---

# Constants

Avoid magic numbers.

Create named constants.

Examples:

* TOP_EARNERS_LIMIT
* DEFAULT_PAGE_SIZE

---

# Logging

Log meaningful events.

Avoid excessive logging.

Never log:

* Passwords
* Tokens
* Secrets

---

# Security

Treat all external input as untrusted.

Hash passwords.

Never expose:

* Password hashes
* Internal database objects

Validate everything.

---

# Specification Drift Prevention

If code and specifications disagree:

Update the specifications first.

Then update tests.

Then update implementation.

Maintain consistency between:

* Roadmap
* Architecture specifications
* Business specifications
* API contracts
* Database schema
* UI specifications
* Testing strategy
* Tests
* Code

---

# Change Impact Analysis

Before changing any file:

Identify:

* Impacted features
* Affected tests
* Affected API contracts
* Affected database schema
* Affected UI components
* Affected specifications
* Affected prompts

Explain the impact before implementing.

---

# AI Usage

AI is an assistant, not an authority.

Generated code must always be reviewed.

Prefer:

* Less code
* Smaller changes
* Standard solutions

If requirements are unclear:

Ask questions.

Do not hallucinate requirements.

Do not jump ahead to future phases.

Stay within the current phase.

---

# Avoid Premature Abstractions

Do not introduce:

* CQRS
* Event Sourcing
* Generic repositories
* BaseRepository
* BaseService
* AbstractFactory
* Service Locator
* Redux
* IoC containers
* Deep inheritance hierarchies

Prefer straightforward code.

---

# File Size

Soft limit:

300 lines per file.

Split:

* Large components
* Large services
* Large repositories

Avoid God objects.

---

# Final Principle

Act like a senior engineer.

Optimize for:

* Correctness
* Maintainability
* Consistency
* Reviewability
* Incremental progress

The repository and specifications are authoritative.

The current conversation is not.

Primary specifications:

```text
specs/

├── roadmap.md
│
├── architecture/
│   ├── system-overview.md
│   └── technology-decisions.md
│
├── business/
│   ├── requirements.md
│   ├── domain-model.md
│   ├── auth-workflows.md
│   ├── employee-salary-management.md
│   ├── analytics.md
│   └── audit-trail.md
│
├── api/
│   ├── api-contracts.md
│   └── error-contracts.md
│
├── database/
│   └── schema.prisma
│
├── ui/
│   └── pages.md
│
└── testing/
    └── testing-strategy.md
```

Prefer boring, readable, industry-standard code that another engineer can understand quickly.
