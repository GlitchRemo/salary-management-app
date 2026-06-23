# Analytics

## Dashboard Metrics

Displayed as summary cards on the Dashboard page.

| Metric | Description |
|---|---|
| Employee Count | Total number of employees |
| Total Payroll | Sum of all base salaries + bonuses |
| Average Salary | Mean base salary across all employees |
| Countries Represented | Count of distinct countries |

---

## Analytics Metrics

Displayed on the Analytics page.

### Payroll by Country

| Field | Description |
|---|---|
| country | Country name |
| totalPayroll | Sum of (baseSalary + bonus) for all employees in that country |

Presented as a chart.

---

### Payroll by Department

| Field | Description |
|---|---|
| department | Department name |
| totalPayroll | Sum of (baseSalary + bonus) for all employees in that department |

Presented as a chart.

---

### Average Salary by Country

| Field | Description |
|---|---|
| country | Country name |
| averageSalary | Mean baseSalary for employees in that country |

Presented as a chart.

---

### Top Earners

The highest-paid employees by total compensation (baseSalary + bonus).

| Field | Description |
|---|---|
| name | Employee full name |
| department | Department |
| country | Country |
| baseSalary | Base salary |
| bonus | Bonus |
| totalCompensation | baseSalary + bonus |

Limit: top 10 employees.

Presented as a table.

---

## Rules

* Analytics logic belongs in `AnalyticsService`.
* Aggregate queries belong in `AnalyticsRepository`.
* `EmployeeService` must not contain analytics queries.
* All metrics are computed at query time. No caching.
