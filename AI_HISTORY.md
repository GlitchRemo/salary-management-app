# AI Change History

This file records significant specification or architectural decisions made with AI assistance, including the rationale for each change.

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
