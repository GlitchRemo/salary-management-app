import { prisma } from "@/server/db/client";
import type { Employee } from "@/app/generated/prisma/client";
import type { EmployeeRow } from "./employee.types";

export type { EmployeeRow } from "./employee.types";

export async function findAllEmployees(): Promise<EmployeeRow[]> {
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
    orderBy: { name: "asc" },
  });
}

export async function findEmployeeById(id: string): Promise<Employee | null> {
  return prisma.employee.findUnique({ where: { id } });
}
