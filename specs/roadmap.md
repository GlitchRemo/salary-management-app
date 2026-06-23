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

Commits

1. docs: add roadmap and project structure
2. feat: define domain schemas
3. feat: configure prisma and create database tables
4. feat: add seed script with HR user and employees
5. test: add employee repository tests
6. feat: initialize nextjs app
7. feat: connect frontend to db via server components and verify end-to-end flow

Definition of Done

Data flows successfully:

Database → DAL → Server Component → Browser ✅

---

# Phase 2 — Deployment Baseline

Goal

Ensure the application is continuously deployable.

Features

* Deploy application to Render
* Deploy database (SQLite on Render persistent disk)
* Configure environment variables
* Verify API connectivity
* Obtain publicly accessible URL

Commits

1. chore: configure deployment
2. chore: deploy application and database
3. docs: add deployment instructions

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

* Application layout
* Navigation sidebar
* Empty dashboard page
* Employee table

Commits

1. feat: add application layout
2. feat: add navigation sidebar
3. feat: add dashboard placeholder page
4. feat: build employee listing page
5. feat: display employees in table

Definition of Done

Users can navigate and view employee information.

---

# Phase 4 — Employee Details and Salary Updates

Goal

Enable salary maintenance while preserving history.

Pages

* Employee Details

Features

* Employee details page
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

1. feat: add employee details page
2. test: add salary update service tests
3. test: add salary audit tests
4. feat: implement salary update service
5. feat: persist salary audit records
6. feat: expose update salary endpoint
7. feat: add salary update modal
8. feat: refresh employee table after updates

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

* test: add filtering tests
* feat: implement filtering endpoint
* feat: add search bar
* feat: add country filter
* feat: add department filter
* feat: add pagination
* test: add csv import validation tests
* feat: implement csv parser service
* feat: implement employee bulk import endpoint
* feat: add csv upload component
* feat: display import success and validation errors

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

1. test: add dashboard metrics tests
2. feat: implement dashboard queries
3. feat: expose dashboard endpoint
4. feat: build dashboard cards

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

1. test: add analytics service tests
2. feat: implement analytics queries
3. feat: expose analytics endpoints
4. feat: add payroll by country chart
5. feat: add payroll by department chart
6. feat: add average salary by country chart
7. feat: add top earners table

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

1. test: add authentication tests
2. feat: implement login endpoint
3. feat: add login page
4. feat: protect routes
5. feat: add logout functionality

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
