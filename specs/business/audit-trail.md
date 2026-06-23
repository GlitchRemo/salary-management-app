# Audit Trail

## Purpose

Every salary change must be recorded to provide a reliable change history, replacing the untracked Excel edits.

---

## Current Scope

Persistence only.

* SalaryAudit records are created automatically on every salary update.
* No API endpoints expose audit records.
* No UI displays audit history.

---

## Captured Information

Every SalaryAudit record captures:

| Field | Description |
|---|---|
| employeeId | The employee whose salary was changed |
| changedById | The HR user who made the change |
| previousBaseSalary | Base salary before the update |
| newBaseSalary | Base salary after the update |
| previousBonus | Bonus before the update |
| newBonus | Bonus after the update |
| createdAt | Timestamp of the change |

---

## Rules

* A SalaryAudit record is created for every salary update without exception.
* Audit records are immutable — they are never updated or deleted.
* The service layer is responsible for creating audit records as part of the salary update transaction.

---

## Future Scope

* `GET /employees/:id/salary-history` endpoint.
* Salary history page in the UI showing a timeline of changes.
* Audit record filtering by date range.
