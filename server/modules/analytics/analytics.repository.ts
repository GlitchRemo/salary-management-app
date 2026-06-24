import { prisma } from "@/server/db/client";
import type { Country } from "@/app/generated/prisma/enums";
import type {
  SummaryStats,
  PayrollByCountry,
  PayrollByDepartment,
  AverageSalaryByCountry,
  DepartmentPayroll,
  CountrySummaryStats,
  AverageSalaryByDepartment,
  SalaryRangeByDepartment,
  EmployeeForTopEarners,
} from "./analytics.types";

export type {
  SummaryStats,
  PayrollByCountry,
  PayrollByDepartment,
  AverageSalaryByCountry,
  DepartmentPayroll,
  CountrySummaryStats,
  AverageSalaryByDepartment,
  SalaryRangeByDepartment,
  EmployeeForTopEarners,
} from "./analytics.types";

export async function getSummaryStats(): Promise<SummaryStats> {
  const [employeeCount, payrollAgg, salaryAgg, countryGroups] = await Promise.all([
    prisma.employee.count(),
    prisma.employee.aggregate({ _sum: { baseSalary: true, bonus: true } }),
    prisma.employee.aggregate({ _avg: { baseSalary: true } }),
    prisma.employee.groupBy({ by: ["country"] }),
  ]);

  return {
    employeeCount,
    totalPayroll: (payrollAgg._sum.baseSalary ?? 0) + (payrollAgg._sum.bonus ?? 0),
    averageSalary: salaryAgg._avg.baseSalary ?? 0,
    countriesRepresented: countryGroups.length,
  };
}

export async function getPayrollByCountry(): Promise<PayrollByCountry[]> {
  const rows = await prisma.employee.groupBy({
    by: ["country"],
    _sum: { baseSalary: true, bonus: true },
    orderBy: { country: "asc" },
  });

  return rows.map((r) => ({
    country: r.country,
    totalPayroll: (r._sum.baseSalary ?? 0) + (r._sum.bonus ?? 0),
  }));
}

export async function getPayrollByDepartment(): Promise<PayrollByDepartment[]> {
  const rows = await prisma.employee.groupBy({
    by: ["department"],
    _sum: { baseSalary: true, bonus: true },
    orderBy: { department: "asc" },
  });

  return rows.map((r) => ({
    department: r.department,
    totalPayroll: (r._sum.baseSalary ?? 0) + (r._sum.bonus ?? 0),
  }));
}

export async function getAverageSalaryByCountry(): Promise<AverageSalaryByCountry[]> {
  const rows = await prisma.employee.groupBy({
    by: ["country"],
    _avg: { baseSalary: true },
    orderBy: { country: "asc" },
  });

  return rows.map((r) => ({
    country: r.country,
    averageSalary: r._avg.baseSalary ?? 0,
  }));
}

export async function getDepartmentPayrollForCountry(country: Country): Promise<DepartmentPayroll[]> {
  const rows = await prisma.employee.groupBy({
    by: ["department"],
    where: { country },
    _sum: { baseSalary: true, bonus: true },
    orderBy: { department: "asc" },
  });

  return rows.map((r) => ({
    department: r.department,
    totalPayroll: (r._sum.baseSalary ?? 0) + (r._sum.bonus ?? 0),
  }));
}

export async function getSalaryRangeByDepartmentForCountry(
  country: Country,
): Promise<SalaryRangeByDepartment[]> {
  const rows = await prisma.employee.groupBy({
    by: ["department", "currency"],
    where: { country },
    _min: { baseSalary: true },
    _avg: { baseSalary: true },
    _max: { baseSalary: true },
    orderBy: { department: "asc" },
  });

  return rows.map((r) => ({
    department: r.department,
    currency: r.currency,
    min: r._min.baseSalary ?? 0,
    average: r._avg.baseSalary ?? 0,
    max: r._max.baseSalary ?? 0,
  }));
}

export async function getAllEmployeesForTopEarners(): Promise<EmployeeForTopEarners[]> {
  return prisma.employee.findMany({
    select: {
      name: true,
      department: true,
      country: true,
      currency: true,
      baseSalary: true,
      bonus: true,
    },
  });
}

export async function getSummaryStatsForCountry(country: Country): Promise<CountrySummaryStats> {
  const [employeeCount, agg, currencyResult] = await Promise.all([
    prisma.employee.count({ where: { country } }),
    prisma.employee.aggregate({
      where: { country },
      _sum: { baseSalary: true, bonus: true },
      _avg: { baseSalary: true },
    }),
    prisma.employee.findFirst({ where: { country }, select: { currency: true } }),
  ]);

  return {
    employeeCount,
    totalPayroll: (agg._sum.baseSalary ?? 0) + (agg._sum.bonus ?? 0),
    averageSalary: agg._avg.baseSalary ?? 0,
    currency: currencyResult?.currency ?? "",
  };
}

export async function getAverageSalaryByDepartmentForCountry(
  country: Country,
): Promise<AverageSalaryByDepartment[]> {
  const rows = await prisma.employee.groupBy({
    by: ["department"],
    where: { country },
    _avg: { baseSalary: true },
    orderBy: { department: "asc" },
  });

  return rows.map((r) => ({
    department: r.department,
    averageSalary: r._avg.baseSalary ?? 0,
  }));
}

export async function getAllEmployeesForTopEarnersInCountry(
  country: Country,
): Promise<EmployeeForTopEarners[]> {
  return prisma.employee.findMany({
    where: { country },
    select: {
      name: true,
      department: true,
      country: true,
      currency: true,
      baseSalary: true,
      bonus: true,
    },
  });
}
