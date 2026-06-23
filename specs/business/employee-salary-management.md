# Employee Salary Management

## User Stories

| Story | Description |
|---|---|
| View employees | As an HR manager, I can view a paginated list of all employees |
| Search employees | As an HR manager, I can search employees by name |
| Filter by country | As an HR manager, I can filter employees by country |
| Filter by department | As an HR manager, I can filter employees by department |
| View employee details | As an HR manager, I can view the full details of an individual employee |
| Update salary | As an HR manager, I can update an employee's base salary |
| Update bonus | As an HR manager, I can update an employee's bonus |
| Import employees via CSV | As an HR manager, I can upload a CSV file to replace all employee data |

---

## Employee List

### Displayed Columns

| Column | Notes |
|---|---|
| Name | Full name |
| Department | Department name |
| Country | Country of employment |
| Currency | Derived from country |
| Base Salary | Current base salary |
| Bonus | Current bonus |
| Last Updated | updatedAt timestamp |

### Search

* Search by employee name (case-insensitive, partial match).

### Filters

* Filter by country (single select).
* Filter by department (single select).
* Filters and search can be combined.

### Pagination

* Default page size: 25 rows.
* HR manager can navigate between pages.

---

## Employee Details

### Read-Only Fields

| Field | Reason |
|---|---|
| Name | Not editable via this application |
| Email | Identity field |
| Country | Country transfers out of scope |
| Currency | Derived from country |

### Editable Fields

| Field | Validation |
|---|---|
| Base Salary | Required. Must be greater than zero |
| Bonus | Required. Must be zero or greater |

---

## Salary Update

**Trigger:** HR manager submits the salary update modal.

**Flow:**

1. HR manager opens an employee's details page.
2. HR manager clicks "Edit Salary".
3. A modal appears with editable salary fields pre-filled.
4. HR manager updates the values and submits.
5. Client sends `PATCH /employees/:id` with updated values.
6. Server validates the input.
7. Server updates the Employee record.
8. Server creates a SalaryAudit record capturing previous and new values.
9. Server returns the updated employee.
10. Client refreshes the employee data.

---

## Validation Rules

| Field | Rule |
|---|---|
| baseSalary | Required. Number. Greater than 0 |
| bonus | Required. Number. Greater than or equal to 0 |

---

## Edge Cases

| Case | Behaviour |
|---|---|
| Submitting unchanged values | Update still persists; audit record is still created |
| Submitting with invalid salary | 400 returned; no changes persisted |
| Employee not found | 404 returned |
| Concurrent updates | Last write wins; no optimistic locking in current scope |

---

## CSV Import

**Trigger:** HR manager uploads a CSV file on the Employees page.

**Flow:**

1. HR manager clicks "Import CSV" on the Employees page.
2. A file picker opens; HR manager selects a `.csv` file.
3. Client sends `POST /api/employees/import` with the file as `multipart/form-data`.
4. Server validates the CSV structure before any data is written.
5. If validation fails: server returns 400 with a list of errors; no data is changed.
6. If validation passes: server upserts each row — new employees are inserted; existing employees matched by `employeeId` are updated.
7. Client displays a success message and refreshes the employee table.

**Required CSV Columns (exact, in any order):**

| Column | Type | Rules |
|---|---|---|
| employeeId | string | Required. Unique |
| firstName | string | Required |
| lastName | string | Required |
| email | string | Required. Unique |
| department | string | Required |
| country | string | Required |
| currency | string | Required |
| baseSalary | number | Required. Greater than 0 |
| bonus | number | Required. Zero or greater |

**Rules:**

* The CSV must contain exactly the columns listed above. No extra columns. No missing columns.
* No column mapping is supported — column names must match exactly.
* The entire file is validated before any data is written.
* Import upserts records — new employees are inserted; existing employees matched by `employeeId` are updated.
* Employees not present in the CSV are left untouched.
* `createdAt` and `updatedAt` are not CSV columns — they are set automatically by the server to the import timestamp.
* No SalaryAudit records are created for imported rows (bulk import, not individual updates).

**CSV Import Edge Cases:**

| Case | Behaviour |
|---|---|
| Missing required column | 400 with column name in error detail |
| Extra unrecognised column | 400 — strict schema required |
| Invalid baseSalary (e.g. negative) | 400 with row number and field in error detail |
| Duplicate email within the file | 400 with row numbers |
| Empty file | 400 — file must contain at least one data row |
| Non-CSV file uploaded | 400 — only `.csv` files accepted |
