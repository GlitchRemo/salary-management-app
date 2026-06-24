# AI Change History

This file records significant specification or architectural decisions made with AI assistance, including the rationale for each change.

---

## 2026-06-24 — Dashboard changed from global metrics to per-country metrics

**Cause**

The initial dashboard showed global aggregates: payroll by country, average salary by country, and a globally-scoped top earners table grouped by currency. On reflection, comparing USD totals against EUR totals or GBP totals is meaningless — the numbers are in different units. A country with a higher payroll total does not necessarily pay better; it may simply use a numerically larger currency (e.g., INR vs USD).

**Decision**

* Add a single country selector at the top of the dashboard page, stored as a URL search param (`?country=US`, default `US`).
* All metrics are now scoped to the selected country: summary cards, payroll by department, average salary by department, budget allocation, salary range, and top earners.
* Removed global cross-country charts: "Payroll by Country" bar chart and "Average Salary by Country" bar chart.
* Added "Average Salary by Department" bar chart (per selected country) as a direct replacement.
* Top earners is now a single flat table for the selected country (no currency grouping needed since all employees in a country share the same currency).

---

## 2026-06-24 — Merged Dashboard and Analytics into a single page

**Cause**

The roadmap had a separate Phase 7 (Dashboard — summary cards) and Phase 8 (Analytics — charts and top earners). On reflection, the dashboard summary cards (employee count, total payroll, average salary, countries represented) are a subset of analytics and do not justify a separate page. Maintaining two phases and two routes added unnecessary complexity.

**Decision**

* Merge Phase 7 and Phase 8 into a single Phase 7 — Dashboard & Analytics.
* The `/dashboard` route displays all metrics: summary cards, payroll charts, average salary chart, and top earners table.
* The `/analytics` route is eliminated. There is no separate analytics page.
* The Analytics link is removed from the `NavigationSidebar`.
* `specs/business/analytics.md` updated: removed the Dashboard/Analytics split; all metrics are now listed under one spec.
* `specs/ui/pages.md` updated: Analytics page removed; Dashboard page now lists all components; Analytics removed from the nav table.
* `specs/roadmap.md` updated: Phases 7 and 8 collapsed into a single phase with two commits.

---

## 2026-06-24 — Country, Department, and Currency represented as Prisma enums

**Cause**

`country`, `department`, and `currency` on the `Employee` model were plain `String` fields. This allowed any arbitrary value to be stored, making filtering unreliable and giving no compile-time safety over the valid value sets.

**Decision**

* Introduce `Country`, `Department`, and `Currency` enums in `prisma/schema.prisma`.
* Valid countries: US, DE, GB, BR, IN.
* Valid departments: Engineering, Product, Finance, Design.
* Valid currencies: USD, EUR, GBP, BRL, INR.
* `EmployeeFilters.country` and `EmployeeFilters.department` are now typed with the Prisma-generated enum union types, enforcing correctness at the service boundary.
* SQLite has no native enum type — Prisma stores values as TEXT and validates at the ORM layer. No migration SQL was required; only `prisma generate` was needed to emit the TypeScript types.
* Adding a new country, department, or currency requires a schema change, `prisma generate`, and a deploy. This is intentional — values are controlled and reviewed.

---

## 2026-06-23 — Removed Server Actions; pages call service functions directly

**Cause**

Server Actions were introduced as the mutation layer after removing API routes. On reflection this adds an unnecessary abstraction — `*.actions.ts` files are thin wrappers that just delegate to services. Pages already call services directly for reads; mutations can follow the same pattern.

**Decision**

* Remove `*.actions.ts` from the architecture and feature file conventions.
* Pages and components call service functions directly for both reads and mutations.
* No dedicated mutation layer exists — services are the lowest shared abstraction.
* `specs/api/api-contracts.md` updated: "Server Actions" section replaced with "Service Operations".
* `specs/api/error-contracts.md` updated: "Server Action Errors" replaced with "Error Classes".

---

## 2026-06-23 — Removed REST API routes; adopted direct service calls

**Cause**

The project had a `app/api/` folder with Next.js Route Handlers for reading and mutating employee data. On review, this was identified as unnecessary indirection:

* Calling your own API Routes from a Server Component creates a loopback HTTP request, adding latency and potential SSR failure.
* Next.js documentation explicitly recommends querying the ORM or database directly from Server Components.

**Decision**

* Delete `app/api/` entirely.
* Pages call service and repository functions directly.
* `specs/api/api-contracts.md` repurposed to document DTOs and service operation contracts.
* `specs/api/error-contracts.md` repurposed to document typed error classes.

**Notes**

* The salary update endpoint (`PATCH /api/employees/:id/salary`) was deleted. Salary updates will be triggered by calling `updateSalary()` from the service directly.
* `test/request-builders.ts` deleted (only used by API route tests).
* `server/modules/employee/employee.api.ts` deleted.
* `APP_URL` env var removed.

---

## 2026-06-23 — PostgreSQL + Vercel → SQLite + Render

**Cause**

After switching to PostgreSQL for Vercel compatibility, the decision was reconsidered. Render supports persistent disk storage, which makes SQLite viable for deployment without the operational overhead of a managed database service. Render was chosen as the deployment platform instead of Vercel.

**Decision**

Revert the database to SQLite. Deploy the full application (frontend + backend) to Render using a persistent disk for the SQLite database file.

**Notes**

* No schema model changes were required.
* Render persistent disk must be configured to mount at the path referenced by `DATABASE_URL`.
* This supersedes the 2026-06-23 SQLite → PostgreSQL change recorded below.

---

## 2026-06-23 — SQLite → PostgreSQL

**Cause**

The application is intended to be deployed on Vercel. SQLite is a local file-based database and is incompatible with serverless deployments — there is no persistent filesystem on Vercel's infrastructure. PostgreSQL is required for production deployment.

**Decision**

Migrate the database from SQLite to PostgreSQL, hosted via Vercel Postgres (powered by Neon).

**Notes**

* No schema model changes were required — Prisma abstracts the provider difference.
* The `DATABASE_URL` environment variable pattern is unchanged; the value will point to a PostgreSQL connection string instead of a file path.
* A separate `DATABASE_TEST_URL` env var is introduced for the E2E test database.

---

## 2026-06-24 — CSV bulk import only audits salary changes, not new employee creates

**Cause**

During bulk CSV import via `upsertManyEmployees`, the initial implementation created a `SalaryAudit` record for every row — including brand-new employees where there is no meaningful "previous" salary to track. Using sentinel values (e.g. `previousBaseSalary: 0`) is misleading and adds noise to the audit trail.

**Decision**

* `upsertManyEmployees` only creates a `SalaryAudit` record when the employee already exists in the database (i.e. the row resolves to an `UPDATE`).
* New employee rows (resolved as `INSERT`) are silently skipped from auditing — the initial salary is considered the ground truth, not a change.
* `changedById` is still required by the function because a mixed CSV (some new, some existing) requires it for the update rows.

**Notes**

* This aligns with the intent of the audit trail: to track *changes* to compensation, not initial data entry.
* The `findUnique` call per row is still necessary to distinguish creates from updates and to capture the previous salary values for the audit record.
