import type { Employee } from "@/app/generated/prisma/client";
import type { Country, Department } from "@/app/generated/prisma/enums";

export type EmployeeRow = Pick<
  Employee,
  "id" | "name" | "email" | "department" | "country" | "currency" | "baseSalary" | "bonus"
>;

export type EmployeeListItem = EmployeeRow & {
  totalCompensation: number;
};

export type EmployeeDto = {
  id: string;
  name: string;
  email: string;
  department: string;
  country: string;
  currency: string;
  baseSalary: number;
  bonus: number;
  createdAt: string;
  updatedAt: string;
};

export type EmployeeFilters = {
  search?: string;
  country?: Country;
  department?: Department;
};

export type ImportResult =
  | { success: true; imported: number }
  | { success: false; errors: string[] };

export type PaginatedEmployees = {
  employees: EmployeeListItem[];
  total: number;
  page: number;
  totalPages: number;
};
