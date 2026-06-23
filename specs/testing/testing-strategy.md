# Testing Strategy

## Philosophy

* Tests should be fast, deterministic, isolated, and readable.
* Focus on behaviour, not implementation details.
* Tests drive development — write tests before production code.
* AI-generated code must have tests before it is considered complete.

---

## Current Scope

Two levels of testing:

1. **Unit tests** — fast, isolated, no database.
2. **End-to-end tests** — full stack, browser to database and back, using Playwright.

---

## What to Test

| Layer | Test Target | Approach |
|---|---|---|
| Service | Business rules, validation logic | Unit test with mocked repository |
| Repository | Query construction | Unit test with mocked Prisma client |
| Controller | Request parsing, response mapping | Unit test with mocked service |
| Mapper | Entity → DTO transformation | Pure function unit test |
| Critical user journeys | Browser → API → SQLite → response | Playwright E2E test |

---

## Mocking Strategy

* Mock repositories when testing services.
* Mock services when testing controllers.
* Mock Prisma client when testing repositories.
* Never use a real database in unit tests.
* E2E tests use a real SQLite test database — seeded before each E2E run and wiped after.

---

## Test Factories

Use factory functions to create test data.

Prefer explicit, readable factories over generic builders.

Example:

```typescript
function buildEmployee(overrides: Partial<Employee> = {}): Employee {
  return {
    id: 'emp_test_1',
    name: 'Jane Smith',
    email: 'jane.smith@acme.com',
    department: 'Engineering',
    country: 'United Kingdom',
    currency: 'GBP',
    baseSalary: 75000,
    bonus: 5000,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    ...overrides,
  };
}
```

---

## Naming Conventions

Test file: `<feature>.test.ts`

Test names follow the pattern:

```
<method/behaviour> — <scenario> — <expected result>
```

Examples:

```
updateSalary — when baseSalary is negative — throws ValidationError
updateSalary — when valid input — creates SalaryAudit record
getEmployees — when search term is provided — filters by name
```

---

## Test Coverage Priorities

### Unit Tests

| Priority | Area |
|---|---|
| High | Salary update service (business rules) |
| High | Salary audit creation |
| High | Employee filtering and pagination |
| High | Authentication service |
| Medium | Analytics service |
| Medium | Dashboard metrics |
| Medium | Mappers |
| Low | Controllers (thin layer) |

### End-to-End Tests

| Priority | Journey |
|---|---|
| High | Login — valid credentials — redirects to dashboard |
| High | Login — invalid credentials — shows error message |
| High | Employee list — loads and displays employees |
| High | Employee list — search by name — filters results |
| High | Employee details — update salary — persists change and creates audit record |
| Medium | Employee list — filter by country — filters results |
| Medium | Employee list — filter by department — filters results |
| Medium | Dashboard — loads summary metrics |
| Medium | Analytics — loads charts and top earners |
| Medium | Logout — clears session and redirects to login |

---

## What Not to Test

* Prisma internals.
* Material UI component rendering.
* Third-party library behaviour.
* Implementation details that do not affect observable behaviour.
* Scenarios already covered by unit tests (do not duplicate coverage in E2E).

---

## End-to-End Test Setup

* Tool: Playwright.
* Test database: separate SQLite file (`test.db`) seeded before each E2E run.
* Seed: 1 HR user, a small representative set of employees (sufficient to test filtering and pagination).
* Tests run against a locally started application (`next dev` + API server).
* E2E tests are kept in `e2e/` at the project root, separate from unit tests.

File naming: `e2e/<feature>.spec.ts`

Example:

```
e2e/
├── auth.spec.ts
├── employees.spec.ts
├── employee-details.spec.ts
├── dashboard.spec.ts
└── analytics.spec.ts
```

---

## Test Runners

* Unit tests: Jest or Vitest (to be confirmed during implementation).
* E2E tests: Playwright.
* Both run in CI on every commit.
* Unit tests run first; E2E tests run after a successful unit test pass.
