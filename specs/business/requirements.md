# Requirements

## Problem Statement

ACME's HR team manages salary data for 10,000 employees across multiple countries. This is currently done entirely through Excel spreadsheets, which is:

* Error-prone — manual edits introduce mistakes.
* Hard to audit — no reliable change history.
* Difficult to analyse — aggregations require manual effort.
* Not scalable — managing 10,000 rows in Excel is tedious.

---

## User Persona

**HR Manager**

* Needs to view, search, and filter employee records.
* Needs to update employee salaries and bonuses.
* Needs a high-level view of organisation-wide payroll metrics.
* Needs to understand compensation distribution across countries and departments.

---

## Goals

1. Replace the Excel-based workflow with a purpose-built web application.
2. Enable reliable salary updates with automatic audit history.
3. Provide searchable, filterable employee records.
4. Surface organisation-wide analytics without manual calculations.
5. Restrict access to authorised HR users.
6. Simplify onboarding of employee salary data via CSV import.

---

## Current Scope

| Capability | Included |
|---|---|
| View all employees | Yes |
| Search employees by name | Yes |
| Filter by country | Yes |
| Filter by department | Yes |
| Pagination | Yes |
| View employee details | Yes |
| Update base salary | Yes |
| Update bonus | Yes |
| Salary audit trail | Yes (persistence only, no UI) |
| Dashboard metrics | Yes |
| Analytics (payroll by country, department, top earners) | Yes |
| Authentication (login / logout) | Yes |
| Import employees via CSV | Yes |

---

## Out of Scope

| Capability | Reason |
|---|---|
| Password reset | Future scope |
| OAuth / SSO | Future scope |
| Role-based access control | Future scope |
| Salary history UI | Future scope |
| Excel import / export | Future scope |
| Currency conversion | Future scope |
| Country transfers | Future scope |
| Employee self-service portal | Future scope |
| Salary bands / median / trends | Future scope |

---

## Future Scope

* Password reset, OAuth, SSO.
* Role-based access control.
* Audit API and salary history UI.
* Advanced analytics: salary bands, median salary, compensation trends.
* Country transfers with currency conversion.
* Excel import and export.
* Employee self-service portal.
