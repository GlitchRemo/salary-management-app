import { prisma } from "@/server/db/client";
import type { Employee, SalaryAudit } from "@/app/generated/prisma/client";
import type { SalaryUpdateInput, SalaryAuditInput } from "@/server/repositories/salary.types";

export type { SalaryUpdateInput, SalaryAuditInput } from "@/server/repositories/salary.types";

export async function updateEmployeeSalary(
  id: string,
  input: SalaryUpdateInput,
): Promise<Employee> {
  return prisma.employee.update({
    where: { id },
    data: {
      baseSalary: input.baseSalary,
      bonus: input.bonus,
    },
  });
}

export async function createSalaryAudit(input: SalaryAuditInput): Promise<SalaryAudit> {
  return prisma.salaryAudit.create({ data: input });
}
