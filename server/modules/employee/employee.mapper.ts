import type { Employee } from "@/app/generated/prisma/client";
import type { EmployeeDto } from "./employee.types";

export function toEmployeeDto(employee: Employee): EmployeeDto {
  return {
    id: employee.id,
    name: employee.name,
    email: employee.email,
    department: employee.department,
    country: employee.country,
    currency: employee.currency,
    baseSalary: employee.baseSalary,
    bonus: employee.bonus,
    createdAt: employee.createdAt.toISOString(),
    updatedAt: employee.updatedAt.toISOString(),
  };
}
