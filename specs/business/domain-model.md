# Domain Model

## Entities

### HRUser

Represents an authorised HR manager who can access the application.

| Field | Type | Notes |
|---|---|---|
| id | string | Unique identifier |
| email | string | Login credential |
| passwordHash | string | Hashed password, never exposed |
| createdAt | datetime | Record creation timestamp |

---

### Employee

Represents an employee whose salary data is managed by HR.

| Field | Type | Notes |
|---|---|---|
| id | string | Unique identifier |
| name | string | Full name |
| email | string | Unique employee email |
| department | string | Department name |
| country | string | Country of employment |
| currency | string | Derived from country, read-only |
| baseSalary | number | Current base salary |
| bonus | number | Current bonus amount |
| updatedAt | datetime | Set automatically on every write (salary update or CSV import) |
| createdAt | datetime | Record creation timestamp |

---

### SalaryAudit

Captures a record of every salary change.

| Field | Type | Notes |
|---|---|---|
| id | string | Unique identifier |
| employeeId | string | Reference to Employee |
| changedById | string | Reference to HRUser who made the change |
| previousBaseSalary | number | Value before the change |
| newBaseSalary | number | Value after the change |
| previousBonus | number | Value before the change |
| newBonus | number | Value after the change |
| createdAt | datetime | Timestamp of the change |

---

## Relationships

```
HRUser ──< SalaryAudit >── Employee
```

* One HRUser can create many SalaryAudit records.
* One Employee can have many SalaryAudit records.
* Each SalaryAudit belongs to exactly one Employee and one HRUser.

---

## Business Invariants

| Rule | Description |
|---|---|
| Currency is derived from country | Currency cannot be edited independently |
| Country is read-only after creation | Country transfers are out of scope |
| Every salary update creates a SalaryAudit | Audit records are never skipped |
| baseSalary must be greater than zero | Enforced at service layer |
| bonus must be zero or greater | Enforced at service layer |
| Only HR users can access the system | Protected routes enforced via session |
| Password hashes are never exposed | Never included in API responses |
