# Analytics

All metrics are displayed on the Dashboard page (`/dashboard`).

---

## Summary Cards

| Metric | Description |
|---|---|
| Employee Count | Total number of employees |
| Total Payroll | Sum of all base salaries + bonuses |
| Average Salary | Mean base salary across all employees |
| Countries Represented | Count of distinct countries |

---

## Payroll by Country

| Field | Description |
|---|---|
| country | Country name |
| totalPayroll | Sum of (baseSalary + bonus) for all employees in that country |

Presented as a bar chart.

---

## Payroll by Department

| Field | Description |
|---|---|
| department | Department name |
| totalPayroll | Sum of (baseSalary + bonus) for all employees in that department |

Presented as a bar chart.

---

## Average Salary by Country

| Field | Description |
|---|---|
| country | Country name |
| averageSalary | Mean baseSalary for employees in that country |

Presented as a bar chart.

---

## Budget Allocation by Department (per Country)

For a selected country, shows what percentage of that country's total payroll is spent on each department.

| Field | Description |
|---|---|
| department | Department name |
| totalPayroll | Sum of (baseSalary + bonus) for that department within the selected country |
| percentage | totalPayroll ÷ country total payroll × 100 |

Presented as a pie chart. A country selector controls which country is displayed. Defaults to the first country alphabetically.

---

## Salary Range by Department per Country

For each country, shows the salary spread (minimum, average, maximum base salary) broken down by department. Only departments that have at least one employee in that country are shown.

| Field | Description |
|---|---|
| country | Country name |
| department | Department name |
| currency | Currency for that country |
| min | Lowest base salary in that department and country |
| average | Mean base salary in that department and country |
| max | Highest base salary in that department and country |

Presented as a grouped bar chart per country (one group per department, three bars: low / mid / high). A country selector controls which country is displayed.

---

## Top Earners

The highest-paid employees by total compensation (baseSalary + bonus), grouped by currency.

A separate top-10 list is shown for each currency (USD, EUR, GBP, BRL, INR). Employees in different currencies are not compared against each other.

| Field | Description |
|---|---|
| name | Employee full name |
| department | Department |
| country | Country |
| currency | Currency |
| baseSalary | Base salary |
| bonus | Bonus |
| totalCompensation | baseSalary + bonus |

Limit: top 10 employees per currency group.

Presented as a table per currency.

---

## Rules

* All analytics logic belongs in `AnalyticsService`.
* All aggregate queries belong in `AnalyticsRepository`.
* `EmployeeService` must not contain analytics queries.
* All metrics are computed at query time. No caching.
