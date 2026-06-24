# Analytics

All metrics are displayed on the Dashboard page (`/dashboard`).

All metrics are scoped to a single selected country. A country selector at the top of the page drives all sections. Comparing metrics across countries is intentionally not supported because employees in different countries use different currencies — cross-currency comparisons are meaningless.

The selected country is stored in the URL as a query parameter (`?country=US`). Defaults to `US`.

---

## Summary Cards

All values are for the selected country only.

| Metric | Description |
|---|---|
| Employee Count | Number of employees in the selected country |
| Total Payroll | Sum of (baseSalary + bonus) for all employees in the country, in the country's currency |
| Average Salary | Mean baseSalary for employees in the country, in the country's currency |
| Currency | The currency used in the selected country |

---

## Payroll by Department

For the selected country, shows total payroll broken down by department.

| Field | Description |
|---|---|
| department | Department name |
| totalPayroll | Sum of (baseSalary + bonus) for employees in that department within the selected country |

Presented as a bar chart.

---

## Average Salary by Department

For the selected country, shows the mean base salary per department.

| Field | Description |
|---|---|
| department | Department name |
| averageSalary | Mean baseSalary for employees in that department within the selected country |

Presented as a bar chart.

---

## Budget Allocation by Department

For the selected country, shows what percentage of the country's total payroll is spent on each department.

| Field | Description |
|---|---|
| department | Department name |
| totalPayroll | Sum of (baseSalary + bonus) for that department within the selected country |
| percentage | totalPayroll ÷ country total payroll × 100 |

Presented as a pie chart.

---

## Salary Range by Department

For the selected country, shows the salary spread (minimum, average, maximum base salary) broken down by department.

| Field | Description |
|---|---|
| department | Department name |
| currency | Currency for that country |
| min | Lowest base salary in that department within the selected country |
| average | Mean base salary in that department within the selected country |
| max | Highest base salary in that department within the selected country |

Presented as a grouped bar chart (one group per department, three bars: min / average / max).

---

## Top Earners

The highest-paid employees in the selected country by total compensation (baseSalary + bonus).

All employees are in the same currency, so direct comparison is valid.

| Field | Description |
|---|---|
| name | Employee full name |
| department | Department |
| baseSalary | Base salary |
| bonus | Bonus |
| totalCompensation | baseSalary + bonus |

Limit: top 10 employees in the selected country.

Presented as a single table.

---

## Rules

* All analytics logic belongs in `AnalyticsService`.
* All aggregate queries belong in `AnalyticsRepository`.
* `EmployeeService` must not contain analytics queries.
* All metrics are computed at query time. No caching.
* All metrics are scoped to the country selected via the URL search param.
