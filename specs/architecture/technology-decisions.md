# Technology Decisions

## Frontend

### Next.js

Chosen because:

* Industry-standard React framework.
* Built-in routing reduces boilerplate.
* Server Components available when beneficial.
* Vercel deployment is seamless.

### TypeScript

Chosen because:

* Catches errors at compile time.
* Improves readability and refactoring confidence.
* Required for maintainable codebases at this scale.

### Material UI

Chosen because:

* Comprehensive component library covering all required UI patterns.
* Eliminates the need for custom styling from scratch.
* DataGrid handles complex employee tables out of the box.
* Consistent design system with minimal effort.

---

## Backend

### Node.js

Chosen because:

* Same language as the frontend (TypeScript throughout).
* Sufficient for a CRUD-heavy internal tool.
* Large ecosystem.

### Prisma

Chosen because:

* Type-safe database access.
* Schema-as-code with migrations.
* Excellent TypeScript integration.
* Reduces boilerplate compared to raw SQL.

### SQLite

Chosen because:

* Zero infrastructure — single file database.
* Sufficient for 10,000 employees.
* Render supports persistent disk storage, making SQLite viable for deployment.
* Simpler operational overhead than a managed database service.

---

## Testing

### Playwright

Chosen for end-to-end testing because:

* Tests the full stack — browser, API, and SQLite database in a real environment.
* First-class TypeScript support.
* Reliable cross-browser testing with a simple API.
* Supports waiting for network and DOM state, reducing flaky tests.
* Widely adopted industry standard for E2E testing.

---

## Deliberate Exclusions

| Decision | Rationale |
|---|---|
| No PostgreSQL | SQLite is sufficient for 10,000 employees; Render supports persistent disk |
| No Redis / caching | Premature for this scale |
| No message queues | No async workflows required |
| No CQRS | Adds complexity without benefit here |
| No event sourcing | Overkill for this use case |
| No generic repositories | Adds abstraction without value |
| No Redux | React Query + local state is sufficient |
| No IoC container | Constructor injection is enough |
| No currency conversion | Out of scope; country determines currency |
| No RBAC | Single HR user role in current scope |
| No CSV/Excel import | Out of scope for current phases |
