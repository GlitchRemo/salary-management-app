# Roadmap

## Context

ACME's HR team manages salary data for 10,000 employees across multiple countries. Today this is done entirely through Excel spreadsheets, which is error-prone and difficult to maintain at scale.

This application replaces that workflow with a purpose-built internal tool for HR users.

---

# Architecture

## Frontend

* Next.js
* TypeScript
* Material UI

Material UI will be used as the primary component library to:

* Encourage reusable UI components.
* Maintain visual consistency.
* Accelerate development.
* Avoid spending excessive time on custom styling.

Reusable components may include:

* AppLayout
* NavigationSidebar
* EmployeeTable
* SearchBar
* CountryFilter
* DepartmentFilter
* SummaryCard
* SalaryUpdateModal
* TopEarnersTable

---

## Backend

* Node.js
* TypeScript
* Prisma
* SQLite

---

## Development Principles

* Roadmap is the source of truth.
* Features are implemented vertically.
* Tests are written before production code.
* AI-generated code must be reviewed.
* Small incremental commits are preferred.
* Working software is prioritized over completeness.
* Maintainability is preferred over cleverness.

---

# Phase 1 — Foundation and First Vertical Slice ✅

Goal

Establish domain models and verify end-to-end communication.

Features

Domain models:

* ✅ HRUser
* ✅ Employee
* ✅ SalaryAudit

Infrastructure:

* ✅ Configure Prisma (v7, prisma-client generator, adapter-libsql)
* ✅ Configure SQLite (via @libsql/client)
* ✅ Create database tables (migration: 20260623093340_init)

Seed data:

* ✅ 1 HR user (hr@acme.com)
* ✅ 5 employees with audit records (10,000-employee seed deferred — sufficient for development)

Frontend:

* ✅ Initialize Next.js application
* ✅ Temporary home page — displays employee table with data from DB

Integration:

* ✅ Data flows: Database → DAL (repositories/services) → Server Component → Browser

Definition of Done

Data flows successfully:

Database → DAL → Server Component → Browser ✅

---

# Phase 2 — Deployment Baseline ✅

Goal

Ensure the application is continuously deployable.

Features

* ✅ Deploy application to Render (via `render.yaml` Blueprint)
* ✅ Deploy database (SQLite on Render persistent disk at `/data/dev.db`, 1 GB)
* ✅ Configure environment variables (`DATABASE_URL`, `NODE_ENV` defined in `render.yaml`)
* ✅ Migrations run automatically on every deploy (`prisma migrate deploy` in build command, before Next.js build)
* ✅ Obtain publicly accessible URL — https://salary-management-app-k786.onrender.com

Definition of Done

A working URL is available and future development can be continuously validated.

---

# Phase 3 — Application Shell and Employee List

Goal

Provide the basic application structure.

Pages

* Dashboard
* Employees

Features

* ✅ Application layout — DashboardLayout with petrol/off-white MUI theme, AppBar, NavigationSidebar
* ✅ Navigation sidebar
* ✅ Empty dashboard page
* ✅ Employee table

Commits

1. ✅ feat: add application layout
2. ✅ feat: add navigation sidebar
3. ✅ feat: add dashboard placeholder page
4. ✅ feat: build employee listing page

Definition of Done

Users can navigate and view employee information.

---

# Phase 4 — Employee Details and Salary Updates

Goal

Enable salary maintenance while preserving history.

Pages

* Employee Details

Features

* Salary update modal
* Edit base salary
* Edit bonus
* Validation rules
* Automatic updated timestamp
* Automatic SalaryAudit creation

Read-only

* Country
* Currency

Commits

1. ✅ feat: implement salary update service
2. ✅ feat: persist salary audit records
3. ✅ feat: add employee details page
4. ✅ feat: add salary update modal
5. ✅ feat: refresh employee table after updates

Definition of Done

Salary changes are persisted and audit records are captured.

---

# Phase 5 — Employee Search, Filtering and CSV Import

Goal

Improve employee discoverability and simplify onboarding of employee salary data.

Features

Search:

* Search by name

Filtering:

* Filter by country
* Filter by department

Pagination:

* Pagination

CSV Import:

* Upload CSV from UI
* CSV columns must exactly match the Employee table schema
* Validate CSV structure before importing
* Add new employees from the CSV
* Update existing employees matched by employeeId
* Reject invalid files with meaningful errors

Contract

The CSV file must contain exactly the following columns:

* employeeId
* firstName
* lastName
* email
* department
* country
* currency
* baseSalary
* bonus

No column mapping is supported.

No partial imports are supported.

Commits

* ✅ feat: implement filtering endpoint
* ✅ feat: add search bar
* ✅ feat: add country filter
* ✅ feat: add department filter
* feat: add pagination
* ✅ feat: implement csv parser service
* ✅ feat: implement employee bulk import endpoint
* ✅ feat: add csv upload component
* ✅ feat: display import success and validation errors

Definition of Done

Employees can be located efficiently.

HR users can import employee data using a CSV file that conforms to the Employee schema.

---

# Phase 6 — Dashboard

Goal

Provide a high-level overview.

Features

Summary cards:

* Employee count
* Total payroll
* Average salary
* Countries represented

Commits

1. feat: implement dashboard queries
2. feat: expose dashboard endpoint
3. feat: build dashboard cards

Definition of Done

The dashboard provides organization-wide metrics.

---

# Phase 7 — Analytics

Goal

Help HR understand compensation distribution.

Features

* Payroll by country
* Payroll by department
* Average salary by country
* Top earners

Commits

1. feat: implement analytics queries
2. feat: expose analytics endpoints
3. feat: add payroll by country chart
4. feat: add payroll by department chart
5. feat: add average salary by country chart
6. feat: add top earners table

Definition of Done

HR managers can answer compensation questions.

---

# Phase 8 — Authentication

Goal

Restrict access to HR users.

Features

* Login page
* Logout
* Session management
* Protected routes

Seed Data

* One HR user

Commits

1. feat: implement login endpoint
2. feat: add login page
3. feat: protect routes
4. feat: add logout functionality

Definition of Done

Only HR users can access the application.

---

# Future Scope

Authentication

* Password reset
* OAuth
* SSO

Audit

* Audit APIs
* Audit UI
* Salary history page

Analytics

* Salary bands
* Median salary
* Compensation trends
* Year-over-year growth

Compensation

* Country transfers
* Currency conversion

Data

* CSV import
* Excel integration
* Export capabilities

Employee Features

* Employee self-service portal
* Role-based access control
