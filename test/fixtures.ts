import type { Employee, SalaryAudit, HRUser } from "@/app/generated/prisma/client";
import { Country, Department, Currency } from "@/app/generated/prisma/enums";
import type { EmployeeDto, EmployeeRow, EmployeeListItem } from "@/server/modules/employee/employee.types";
import type { CsvRow } from "@/server/modules/csv/csv-parser.types";

export function buildEmployee(overrides: Partial<Employee> = {}): Employee {
  return {
    id: "emp_1",
    name: "Jane Smith",
    email: "jane.smith@acme.com",
    department: Department.Engineering,
    country: Country.US,
    currency: Currency.USD,
    baseSalary: 80000,
    bonus: 5000,
    createdAt: new Date("2024-01-01T00:00:00Z"),
    updatedAt: new Date("2026-06-23T00:00:00Z"),
    ...overrides,
  };
}

export function buildEmployeeRow(overrides: Partial<EmployeeRow> = {}): EmployeeRow {
  return {
    id: "emp_1",
    name: "Jane Smith",
    email: "jane.smith@acme.com",
    department: Department.Engineering,
    country: Country.US,
    currency: Currency.USD,
    baseSalary: 80000,
    bonus: 5000,
    ...overrides,
  };
}

export function buildEmployeeListItem(
  overrides: Partial<EmployeeListItem> = {},
): EmployeeListItem {
  return {
    id: "emp_1",
    name: "Jane Smith",
    email: "jane.smith@acme.com",
    department: Department.Engineering,
    country: Country.US,
    currency: Currency.USD,
    baseSalary: 80000,
    bonus: 5000,
    totalCompensation: 85000,
    ...overrides,
  };
}

export function buildEmployeeDto(overrides: Partial<EmployeeDto> = {}): EmployeeDto {
  return {
    id: "emp_1",
    name: "Jane Smith",
    email: "jane.smith@acme.com",
    department: Department.Engineering,
    country: Country.US,
    currency: Currency.USD,
    baseSalary: 80000,
    bonus: 5000,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2026-06-23T00:00:00.000Z",
    ...overrides,
  };
}

export function buildSalaryAudit(overrides: Partial<SalaryAudit> = {}): SalaryAudit {
  return {
    id: "audit_1",
    employeeId: "emp_1",
    changedById: "hr_1",
    previousBaseSalary: 80000,
    newBaseSalary: 90000,
    previousBonus: 5000,
    newBonus: 6000,
    createdAt: new Date("2026-06-23T00:00:00Z"),
    ...overrides,
  };
}

export function buildHrUser(overrides: Partial<HRUser> = {}): HRUser {
  return {
    id: "hr_1",
    email: "hr@acme.com",
    passwordHash: "hashed",
    createdAt: new Date("2024-01-01T00:00:00Z"),
    ...overrides,
  };
}

export function buildCsvRow(overrides: Partial<CsvRow> = {}): CsvRow {
  return {
    employeeId: "emp_1",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@acme.com",
    department: Department.Engineering,
    country: Country.US,
    currency: Currency.USD,
    baseSalary: 80000,
    bonus: 5000,
    ...overrides,
  };
}
