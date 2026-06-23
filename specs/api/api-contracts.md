# Data Contracts

> **Note (2026-06-23):** This project has no REST API or Server Actions.
> Pages and components call service and repository functions directly.
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


**Request**

```json
{
  "email": "hr@acme.com",
  "password": "secret"
}
```

**Response 200**

```json
{
  "token": "session-token"
}
```

**Errors:** 400, 401

---

### POST /api/auth/logout

**Request:** No body. Requires valid session token in header.

**Response 200**

```json
{
  "message": "Logged out successfully"
}
```

**Errors:** 401

---

## Employees

### GET /api/employees

Returns a paginated list of employees.

**Query Parameters**

| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| page | number | No | 1 | Page number |
| pageSize | number | No | 25 | Results per page |
| search | string | No | — | Partial name match (case-insensitive) |
| country | string | No | — | Filter by country |
| department | string | No | — | Filter by department |

**Response 200**

```json
{
  "data": [
    {
      "id": "emp_123",
      "name": "Jane Smith",
      "email": "jane.smith@acme.com",
      "department": "Engineering",
      "country": "United Kingdom",
      "currency": "GBP",
      "baseSalary": 75000,
      "bonus": 5000,
      "updatedAt": "2026-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 25,
    "total": 10000,
    "totalPages": 400
  }
}
```

**Errors:** 401

---

### GET /api/employees/:id

Returns full details of a single employee.

**Response 200**

```json
{
  "id": "emp_123",
  "name": "Jane Smith",
  "email": "jane.smith@acme.com",
  "department": "Engineering",
  "country": "United Kingdom",
  "currency": "GBP",
  "baseSalary": 75000,
  "bonus": 5000,
  "updatedAt": "2026-01-15T10:30:00Z",
  "createdAt": "2024-03-01T09:00:00Z"
}
```

**Errors:** 401, 404

---

### PATCH /api/employees/:id/salary

Updates an employee's salary fields.

**Request**

```json
{
  "baseSalary": 80000,
  "bonus": 6000
}
```

**Response 200**

```json
{
  "id": "emp_123",
  "name": "Jane Smith",
  "email": "jane.smith@acme.com",
  "department": "Engineering",
  "country": "United Kingdom",
  "currency": "GBP",
  "baseSalary": 80000,
  "bonus": 6000,
  "updatedAt": "2026-06-23T14:00:00Z",
  "createdAt": "2024-03-01T09:00:00Z"
}
```

**Errors:** 400, 401, 404

---

### POST /api/employees/import

Upserts employee records from the uploaded CSV file. New employees are inserted; existing employees matched by `employeeId` are updated. Employees not present in the CSV are left untouched.

**Request**

Content-Type: `multipart/form-data`

| Field | Type | Description |
|---|---|---|
| file | File | CSV file conforming to the import schema |

**CSV column contract:** `employeeId`, `firstName`, `lastName`, `email`, `department`, `country`, `currency`, `baseSalary`, `bonus`

All columns are required. No extra columns permitted. No partial imports.

**Response 200**

```json
{
  "created": 350,
  "updated": 9650
}
```

**Response 400 — validation failure (no data written)**

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "CSV validation failed",
    "details": [
      { "row": 3, "field": "baseSalary", "message": "Must be greater than 0" },
      { "row": 7, "field": "email", "message": "Duplicate email within file" }
    ]
  }
}
```

**Errors:** 400, 401

---

## Dashboard

### GET /api/dashboard

Returns organisation-wide summary metrics.

**Response 200**

```json
{
  "employeeCount": 10000,
  "totalPayroll": 850000000,
  "averageSalary": 72000,
  "countriesRepresented": 15
}
```

**Errors:** 401

---

## Analytics

### GET /api/analytics/payroll-by-country

**Response 200**

```json
{
  "data": [
    { "country": "United Kingdom", "totalPayroll": 120000000 },
    { "country": "United States", "totalPayroll": 340000000 }
  ]
}
```

**Errors:** 401

---

### GET /api/analytics/payroll-by-department

**Response 200**

```json
{
  "data": [
    { "department": "Engineering", "totalPayroll": 250000000 },
    { "department": "Sales", "totalPayroll": 180000000 }
  ]
}
```

**Errors:** 401

---

### GET /api/analytics/average-salary-by-country

**Response 200**

```json
{
  "data": [
    { "country": "United Kingdom", "averageSalary": 68000 },
    { "country": "United States", "averageSalary": 92000 }
  ]
}
```

**Errors:** 401

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
