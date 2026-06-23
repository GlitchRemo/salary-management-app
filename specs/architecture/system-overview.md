# System Overview

## Purpose

A purpose-built internal web application for ACME's HR team to manage salary data for 10,000 employees across multiple countries, replacing a manual Excel-based workflow.

---

## Architecture

```
Browser (Next.js)
       │
       ▼
  REST API (Node.js / Express)
       │
       ▼
  Prisma ORM
       │
       ▼
  SQLite Database
```

---

## Layer Responsibilities

| Layer | Technology | Responsibility |
|---|---|---|
| Pages | Next.js | Routing, page composition |
| Components | React + Material UI | UI rendering, user interaction |
| API Routes / Controllers | Node.js | HTTP handling, request parsing, response mapping |
| Services | TypeScript | Business rules, validation orchestration |
| Repositories | Prisma | Database access, queries |
| Database | SQLite | Persistence |

---

## Feature Organization

Code is organized by feature, not by layer.

```
src/
├── auth/
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.repository.ts
│   ├── auth.types.ts
│   ├── auth.schemas.ts
│   └── auth.test.ts
│
├── employee/
│   ├── employee.controller.ts
│   ├── employee.service.ts
│   ├── employee.repository.ts
│   ├── employee.mapper.ts
│   ├── employee.types.ts
│   ├── employee.schemas.ts
│   └── employee.test.ts
│
├── analytics/
│   ├── analytics.controller.ts
│   ├── analytics.service.ts
│   ├── analytics.repository.ts
│   ├── analytics.mapper.ts
│   ├── analytics.types.ts
│   └── analytics.test.ts
│
└── shared/
    ├── errors.ts
    ├── middleware.ts
    └── types.ts
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
Pages → Organisms → Molecules → Atoms
Pages → API (React Query)
API → Services → Repositories → Prisma → SQLite
```

Controllers depend on Services.
Services depend on Repositories.
Repositories depend on Prisma.
No reverse dependencies.

---

## Data Mapping Flow

```
Prisma Entity → Mapper → DTO → API Response
```

Prisma entities are never exposed directly in API responses.
