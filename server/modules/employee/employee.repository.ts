import { prisma } from "@/server/db/client";
import type { Employee } from "@/app/generated/prisma/client";
import type { EmployeeFilters, EmployeeRow } from "./employee.types";
import type { CsvRow } from "@/server/modules/csv/csv-parser.types";

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

export async function upsertManyEmployees(rows: CsvRow[]): Promise<number> {
  await prisma.$transaction(
    rows.map((row) =>
      prisma.employee.upsert({
        where: { id: row.employeeId },
        update: {
          name: `${row.firstName} ${row.lastName}`,
          email: row.email,
          department: row.department,
          country: row.country,
          currency: row.currency,
          baseSalary: row.baseSalary,
          bonus: row.bonus,
        },
        create: {
          id: row.employeeId,
          name: `${row.firstName} ${row.lastName}`,
          email: row.email,
          department: row.department,
          country: row.country,
          currency: row.currency,
          baseSalary: row.baseSalary,
          bonus: row.bonus,
        },
      })
    )
  );
  return rows.length;
}
