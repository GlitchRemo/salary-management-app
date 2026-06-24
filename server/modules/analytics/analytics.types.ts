import type { Country } from "@/app/generated/prisma/enums";

export type SummaryStats = {
  employeeCount: number;
  totalPayroll: number;
  averageSalary: number;
  countriesRepresented: number;
};

export type PayrollByCountry = {
  country: string;
  totalPayroll: number;
};

export type PayrollByDepartment = {
  department: string;
  totalPayroll: number;
};

export type AverageSalaryByCountry = {
  country: string;
  averageSalary: number;
};

export type DepartmentPayroll = {
  department: string;
  totalPayroll: number;
};

export type BudgetAllocationByDepartment = {
  department: string;
  totalPayroll: number;
  percentage: number;
};

export type SalaryRangeByDepartment = {
  department: string;
  currency: string;
  min: number;
  average: number;
  max: number;
};

export type TopEarner = {
  name: string;
  department: string;
  country: string;
  currency: string;
  baseSalary: number;
  bonus: number;
  totalCompensation: number;
};

export type TopEarnersByCurrency = Record<string, TopEarner[]>;

export type EmployeeForTopEarners = {
  name: string;
  department: string;
  country: string;
  currency: string;
  baseSalary: number;
  bonus: number;
};

export { Country };
