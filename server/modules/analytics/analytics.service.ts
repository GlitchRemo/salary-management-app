import { TOP_EARNERS_LIMIT } from "@/server/constants";
import {
  getSummaryStats as repoGetSummaryStats,
  getPayrollByCountry as repoGetPayrollByCountry,
  getPayrollByDepartment as repoGetPayrollByDepartment,
  getAverageSalaryByCountry as repoGetAverageSalaryByCountry,
  getDepartmentPayrollForCountry,
  getSalaryRangeByDepartmentForCountry,
  getAllEmployeesForTopEarners,
} from "./analytics.repository";
import type {
  SummaryStats,
  PayrollByCountry,
  PayrollByDepartment,
  AverageSalaryByCountry,
  BudgetAllocationByDepartment,
  SalaryRangeByDepartment,
  TopEarner,
  TopEarnersByCurrency,
} from "./analytics.types";
import type { Country } from "@/app/generated/prisma/enums";

export type {
  SummaryStats,
  PayrollByCountry,
  PayrollByDepartment,
  AverageSalaryByCountry,
  BudgetAllocationByDepartment,
  SalaryRangeByDepartment,
  TopEarner,
  TopEarnersByCurrency,
} from "./analytics.types";

export function getSummaryStats(): Promise<SummaryStats> {
  return repoGetSummaryStats();
}

export function getPayrollByCountry(): Promise<PayrollByCountry[]> {
  return repoGetPayrollByCountry();
}

export function getPayrollByDepartment(): Promise<PayrollByDepartment[]> {
  return repoGetPayrollByDepartment();
}

export function getAverageSalaryByCountry(): Promise<AverageSalaryByCountry[]> {
  return repoGetAverageSalaryByCountry();
}

export async function getBudgetAllocationByDepartment(
  country: Country,
): Promise<BudgetAllocationByDepartment[]> {
  const rows = await getDepartmentPayrollForCountry(country);
  const countryTotal = rows.reduce((sum, r) => sum + r.totalPayroll, 0);

  return rows.map((r) => ({
    department: r.department,
    totalPayroll: r.totalPayroll,
    percentage: countryTotal > 0 ? (r.totalPayroll / countryTotal) * 100 : 0,
  }));
}

export async function getSalaryRangeByDepartment(
  country: Country,
): Promise<SalaryRangeByDepartment[]> {
  return getSalaryRangeByDepartmentForCountry(country);
}

export async function getTopEarnersByCurrency(): Promise<TopEarnersByCurrency> {
  const employees = await getAllEmployeesForTopEarners();

  const withCompensation: TopEarner[] = employees.map((e) => ({
    ...e,
    totalCompensation: e.baseSalary + e.bonus,
  }));

  const grouped: TopEarnersByCurrency = {};
  for (const employee of withCompensation) {
    if (!grouped[employee.currency]) {
      grouped[employee.currency] = [];
    }
    grouped[employee.currency].push(employee);
  }

  for (const currency of Object.keys(grouped)) {
    grouped[currency] = grouped[currency]
      .sort((a, b) => b.totalCompensation - a.totalCompensation)
      .slice(0, TOP_EARNERS_LIMIT);
  }

  return grouped;
}
