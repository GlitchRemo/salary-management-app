# Data Contracts

> **Note (2026-06-23):** This project has no REST API.
> Pages and Server Actions call service functions directly.
> This document defines the shared data shapes (DTOs) and the input/output
> contracts for each service operation that crosses a layer boundary.

---

## Conventions

* All DTOs are plain TypeScript objects — no class instances.
* Dates are ISO 8601 strings in DTOs (converted from `Date` objects by mappers).
* Service inputs are validated with Zod at the call site.
* Services return DTOs — never raw Prisma entities.
* Errors follow the structure in `error-contracts.md`.

---

## DTOs

### EmployeeDto

Returned by mappers and Server Actions involving employees.

```ts
type EmployeeDto = {
  id: string;
  name: string;
  email: string;
  department: string;
  country: string;
  currency: string;
  baseSalary: number;
  bonus: number;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
};
```

---

## Service Operations

### updateSalary

**File:** `server/modules/salary/salary.service.ts`

**Purpose:** Update an employee's base salary and bonus. Creates a `SalaryAudit` record.

**Input**

```ts
{
  employeeId: string;
  baseSalary: number; // must be > 0
  bonus: number;      // must be >= 0
  changedById: string;
}
```

**Output:** `Employee` (Prisma entity) — mapped to `EmployeeDto` by the caller.

**Errors:** `NotFoundError` if employee does not exist.

---

### importEmployees

**File:** `server/modules/employee/employee.service.ts`

**Purpose:** Upsert employee records from parsed CSV rows. New employees are inserted; existing employees matched by `employeeId` are updated.

**Input:** Array of validated employee row objects conforming to the CSV column contract.

**CSV column contract:** `employeeId`, `firstName`, `lastName`, `email`, `department`, `country`, `currency`, `baseSalary`, `bonus`

All columns required. No extra columns permitted. No partial imports.

**Output**

```ts
{
  created: number;
  updated: number;
}
```

**Errors:** `ValidationError` for malformed rows.

---

### login

**File:** `server/modules/auth/auth.service.ts`

**Purpose:** Verify HR user credentials and return a signed session token. Called from the login Server Action, which writes the token as an `HttpOnly` session cookie.

**Input**

```ts
{
  email: string;
  password: string;
}
```

Validated with Zod before calling the service.

**Output:** `string` — signed session token.

**Errors:** `UnauthorizedError` if credentials are invalid (email not found or password mismatch). Error message is always "Invalid credentials" to avoid user enumeration.

---

### GET /api/analytics/top-earners

Returns the top 10 employees by total compensation.

**Response 200**

```json
{
  "data": [
    {
      "id": "emp_456",
      "name": "John Doe",
      "department": "Executive",
      "country": "United States",
      "baseSalary": 250000,
      "bonus": 100000,
      "totalCompensation": 350000
    }
  ]
}
```

**Errors:** 401
