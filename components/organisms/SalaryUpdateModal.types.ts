import type { EmployeeDto } from "@/server/modules/employee/employee.types";

export type SalaryEmployee = Pick<EmployeeDto, "id" | "currency" | "baseSalary" | "bonus" | "name">;

export type EditField = "baseSalary" | "bonus";
