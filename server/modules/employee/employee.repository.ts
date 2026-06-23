import { prisma } from "@/server/db/client";
import type { Employee } from "@/app/generated/prisma/client";
import type { EmployeeFilters, EmployeeRow } from "./employee.types";

export type { EmployeeRow } from "./employee.types";

export async function findAllEmployees(filters: EmployeeFilters = {}): Promise<EmployeeRow[]> {
  const { country, department } = filters;
  return prisma.employee.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      department: true,
      country: true,
      currency: true,
      baseSalary: true,
      bonus: true,
    },
    where: {
      ...(country && { country }),
      ...(department && { department }),
    },
    orderBy: { name: "asc" },
  });
}

export async function findEmployeeById(id: string): Promise<Employee | null> {
  return prisma.employee.findUnique({ where: { id } });
}
