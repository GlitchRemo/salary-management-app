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
> Next.js Server Components with a server-side Data Access Layer. Data is fetched
> directly on the server during rendering — no HTTP round-trip is needed for
> read-heavy pages. API Routes will be introduced only for mutation endpoints
> (salary updates, CSV import) where a client-side request is required.

---

## Layer Responsibilities

| Layer | Technology | Responsibility |
|---|---|---|
| Pages (Server Components) | Next.js | Routing, page composition, server-side data fetching |
| Components | React + Tailwind CSS | UI rendering, user interaction |
| API Routes | Next.js Route Handlers | Mutation endpoints (POST/PATCH/DELETE) |
| Services | TypeScript (`server/db/services/`) | Business rules, validation orchestration |
| Repositories | Prisma (`server/db/repositories/`) | Database access, queries |
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

```
app/
└── api/
    └── employees/
        ├── route.ts           # GET (paginated), POST
        └── [id]/
            └── route.ts       # PATCH salary, GET details
```

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
Server Component Pages → Services → Repositories → Prisma → SQLite
Client Components       → API Routes → Services → Repositories → Prisma → SQLite
UI Components           → Organisms → Molecules → Atoms
```

Services depend on Repositories.
Repositories depend on Prisma.
Server Components and API Routes depend on Services.
No reverse dependencies.
Prisma entities are never passed directly to Client Components.

---

## Data Mapping Flow

```
Prisma Entity → Mapper → DTO → API Response
```

Prisma entities are never exposed directly in API responses.
