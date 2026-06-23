# UI Pages

## Navigation

The application uses a persistent sidebar for navigation.

| Item | Route | Visible When |
|---|---|---|
| Dashboard | `/dashboard` | Authenticated |
| Employees | `/employees` | Authenticated |
| Analytics | `/analytics` | Authenticated |
| Logout | — | Authenticated |

Unauthenticated users are redirected to `/login`.

---

## Layout

### DashboardLayout (Template)

Wraps all authenticated pages.

Contains:

* `AppBar` — top navigation bar with application title.
* `NavigationSidebar` — left sidebar with nav links and logout.
* Main content area.

---

## Pages

### Login Page — `/login`

**Purpose:** Authenticate the HR user.

**Components:**

* Email input (`TextField`)
* Password input (`TextField`, type=password)
* Login button (`Button`)
* Error message on failed login

**Behaviour:**

* On success: redirect to `/dashboard`.
* On failure: display "Invalid email or password".
* Form validates required fields before submission.

---

### Dashboard Page — `/dashboard`

**Purpose:** Provide a high-level overview of the organisation.

**Components:**

* Four `SummaryCard` organisms:
  * Employee Count
  * Total Payroll
  * Average Salary
  * Countries Represented

**Loading state:** Skeleton cards while data loads.

**Error state:** Error message if the API fails.

---

### Employees Page — `/employees`

**Purpose:** Browse, search, filter the employee list, and import employee data via CSV.

**Components:**

* `SearchBar` molecule — name search input.
* `CountryFilter` molecule — country dropdown.
* `DepartmentFilter` molecule — department dropdown.
* `EmployeeTable` organism — paginated employee table (Material UI `DataGrid`).
* `CsvImportButton` molecule — triggers file picker and uploads CSV.

**Table columns:** Name, Department, Country, Currency, Base Salary, Bonus, Last Updated.

**Interactions:**

* Clicking a row navigates to `/employees/:id`.
* Search and filters update the table instantly.
* Pagination controls at the bottom of the table.
* Clicking "Import CSV" opens a file picker filtered to `.csv` files.
* On successful import: success snackbar shown and table refreshes.
* On failed import: error dialog lists validation errors with row numbers.

**Loading state:** Skeleton rows while data loads.

**Empty state:** "No employees found" when filters return no results.

---

### Employee Details Page — `/employees/:id`

**Purpose:** View and update an individual employee's salary.

**Components:**

* Employee details card showing all fields.
* "Edit Salary" button — opens `SalaryUpdateModal`.
* `SalaryUpdateModal` organism — modal with salary form.

**Read-only fields displayed:** Name, Email, Department, Country, Currency.

**Editable via modal:** Base Salary, Bonus.

**Modal behaviour:**

* Pre-filled with current values.
* Validates on submit.
* On success: closes modal and refreshes employee data.
* On error: displays validation or server error.

**Loading state:** Skeleton while employee data loads.

**Not found state:** "Employee not found" with a back link.

---

### Analytics Page — `/analytics`

**Purpose:** Help HR understand compensation distribution.

**Components:**

* Payroll by Country chart (bar chart).
* Payroll by Department chart (bar chart).
* Average Salary by Country chart (bar chart).
* `TopEarnersTable` organism — table of top 10 earners.

**Loading state:** Skeleton charts while data loads.

**Error state:** Error message per chart section if data fails.

---

## Atomic Design Reference

| Level | Components |
|---|---|
| Atoms | Button, TextField, Typography, Skeleton |
| Molecules | SearchBar, CountryFilter, DepartmentFilter, CsvImportButton |
| Organisms | EmployeeTable, SalaryUpdateModal, SummaryCard, TopEarnersTable |
| Templates | DashboardLayout |
| Pages | LoginPage, DashboardPage, EmployeesPage, EmployeeDetailsPage, AnalyticsPage |

---

## Material UI Components Used

| Use Case | Component |
|---|---|
| Employee table | `DataGrid` |
| Salary update form | `Dialog` + `TextField` |
| Navigation | `Drawer` + `List` |
| Summary metrics | `Card` |
| Top bar | `AppBar` |
| Search / filter inputs | `TextField`, `Select` |
| Pagination | Built into `DataGrid` |
