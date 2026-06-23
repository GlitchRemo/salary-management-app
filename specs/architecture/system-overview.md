# System Overview

## Purpose

A purpose-built internal web application for ACME's HR team to manage salary data for 10,000 employees across multiple countries, replacing a manual Excel-based workflow.

---

## Architecture

```
Browser
       │
       ▼
  Next.js Server Components  (React, runs on the server)
       │
       ▼
  Data Access Layer  (server/db/services → server/db/repositories)
       │
       ▼
  Prisma ORM  (adapter-libsql)
       │
       ▼
  SQLite Database
```

> **Decision (2026-06-23):** A separate Express REST API was dropped in favour of
> Next.js Server Components with a server-side Data Access Layer.
>
> **Decision (2026-06-23):** API Routes and Server Actions removed entirely.
> Pages call service and repository functions directly. No HTTP layer exists.

---

## Layer Responsibilities

| Layer | Technology | Responsibility |
|---|---|---|
| Pages (Server Components) | Next.js | Routing, page composition, direct service/repository calls |
| Components | React + Material UI | UI rendering, user interaction |
| Services | TypeScript | Business rules, validation orchestration |
| Repositories | Prisma | Database access, queries |
| DB Client | Prisma + adapter-libsql (`server/db/client.ts`) | Connection singleton |
| Database | SQLite | Persistence |

---

## Server Code Organization

Server-side code lives in `server/` and is organized by layer, with one file per domain entity.

```
server/
└── db/
    ├── client.ts                          # Prisma singleton
    ├── repositories/
    │   ├── employee.repository.ts         # Raw Prisma queries
    │   └── (hr-user.repository.ts, ...)   # Future repositories
    └── services/
        ├── employee.service.ts            # Business logic + DTOs
        └── (audit.service.ts, ...)        # Future services
```

Next.js API Routes for mutations will be co-located with the app router:


> No `app/api/` routes exist in this project.
> Pages call services and repositories directly.

---

## Frontend Structure

```
app/
├── (auth)/
│   └── login/
│       └── page.tsx
│
├── (protected)/
│   ├── dashboard/
│   │   └── page.tsx
│   ├── employees/
│   │   └── page.tsx
│   └── employees/[id]/
│       └── page.tsx
│
└── analytics/
    └── page.tsx

components/
├── atoms/
│   ├── Button
│   ├── Input
│   └── Typography
│
├── molecules/
│   ├── SearchBar
│   ├── CountryFilter
│   └── DepartmentFilter
│
├── organisms/
│   ├── EmployeeTable
│   ├── SalaryUpdateModal
│   └── TopEarnersTable
│
└── templates/
    └── DashboardLayout
```

---

## Atomic Design

| Level | Examples |
|---|---|
| Atoms | Button, Input, Typography |
| Molecules | SearchBar, CountryFilter, DepartmentFilter |
| Organisms | EmployeeTable, SalaryUpdateModal, TopEarnersTable, SummaryCard |
| Templates | DashboardLayout |
| Pages | LoginPage, DashboardPage, EmployeesPage, EmployeeDetailsPage, AnalyticsPage |

---

## Dependency Flow

```
Pages      → Services → Repositories → Prisma → SQLite
Components → Pages (props) → Services → Repositories → Prisma → SQLite
UI         → Organisms → Molecules → Atoms
```

Pages call services and repositories directly.
Services depend on Repositories.
Repositories depend on Prisma.
No reverse dependencies.
Prisma entities are never passed directly to pages or Client Components.

---

## Data Mapping Flow

```
Prisma Entity → Mapper → DTO → Page / Component
```

Prisma entities are never exposed directly in pages or passed to Client Components.
