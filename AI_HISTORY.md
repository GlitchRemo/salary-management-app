# AI Change History

This file records significant specification or architectural decisions made with AI assistance, including the rationale for each change.

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
