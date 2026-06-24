import { TOP_EARNERS_LIMIT } from "@/server/constants";
import {
  getSummaryStats as repoGetSummaryStats,
  getPayrollByCountry as repoGetPayrollByCountry,
  getPayrollByDepartment as repoGetPayrollByDepartment,
  getAverageSalaryByCountry as repoGetAverageSalaryByCountry,
  getDepartmentPayrollForCountry,
  getSalaryRangeByDepartmentForCountry,
  getAllEmployeesForTopEarners,
  getSummaryStatsForCountry as repoGetSummaryStatsForCountry,
  getAverageSalaryByDepartmentForCountry as repoGetAverageSalaryByDepartmentForCountry,
  getAllEmployeesForTopEarnersInCountry,
  getEmployeeSalariesByDepartmentForCountry,
} from "./analytics.repository";
import type {
  SummaryStats,
  PayrollByCountry,
  PayrollByDepartment,
  AverageSalaryByCountry,
  DepartmentPayroll,
  CountrySummaryStats,
  AverageSalaryByDepartment,
  BudgetAllocationByDepartment,
  SalaryRangeByDepartment,
  SalaryDistributionByDepartment,
  TopEarner,
  TopEarnersByCurrency,
} from "./analytics.types";
import type { Country } from "@/app/generated/prisma/enums";

export type {
  SummaryStats,
  PayrollByCountry,
  PayrollByDepartment,
  AverageSalaryByCountry,
  DepartmentPayroll,
  CountrySummaryStats,
  AverageSalaryByDepartment,
  BudgetAllocationByDepartment,
  SalaryRangeByDepartment,
  SalaryDistributionByDepartment,
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

export function getSummaryStatsForCountry(country: Country): Promise<CountrySummaryStats> {
  return repoGetSummaryStatsForCountry(country);
}

export function getPayrollByDepartmentForCountry(country: Country): Promise<DepartmentPayroll[]> {
  return getDepartmentPayrollForCountry(country);
}

export function getAverageSalaryByDepartmentForCountry(
  country: Country,
): Promise<AverageSalaryByDepartment[]> {
  return repoGetAverageSalaryByDepartmentForCountry(country);
}

export async function getTopEarnersByCountry(country: Country): Promise<TopEarner[]> {
  const employees = await getAllEmployeesForTopEarnersInCountry(country);

  return employees
    .map((e) => ({ ...e, totalCompensation: e.baseSalary + e.bonus }))
    .sort((a, b) => b.totalCompensation - a.totalCompensation)
    .slice(0, TOP_EARNERS_LIMIT);
}

export async function getSalaryDistributionByDepartment(
  country: Country,
): Promise<SalaryDistributionByDepartment[]> {
  const employees = await getEmployeeSalariesByDepartmentForCountry(country);

  const byDept = new Map<string, number[]>();
  for (const emp of employees) {
    const salaries = byDept.get(emp.department) ?? [];
    salaries.push(emp.baseSalary);
    byDept.set(emp.department, salaries);
  }

  return Array.from(byDept.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([department, salaries]) => {
      const avg = salaries.reduce((s, v) => s + v, 0) / salaries.length;
      const belowAverage = salaries.filter((s) => s < avg).length;
      const total = salaries.length;
      const belowAveragePercent = total > 0 ? (belowAverage / total) * 100 : 0;
      return {
        department,
        belowAveragePercent,
        atOrAboveAveragePercent: 100 - belowAveragePercent,
      };
    });
}
