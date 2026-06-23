import type { Employee } from "@/app/generated/prisma/client";
import { findEmployeeById } from "@/server/repositories/employee.repository";
import {
  updateEmployeeSalary,
  createSalaryAudit,
} from "@/server/repositories/salary.repository";
import { ValidationError, NotFoundError } from "@/server/errors";
import { ERROR_MESSAGES } from "@/server/constants";
import type { SalaryUpdateParams } from "@/server/services/salary.types";

export type { SalaryUpdateParams } from "@/server/services/salary.types";

export async function updateSalary(params: SalaryUpdateParams): Promise<Employee> {
  const { employeeId, baseSalary, bonus, changedById } = params;

  if (baseSalary <= 0) {
    throw new ValidationError(ERROR_MESSAGES.BASE_SALARY_INVALID);
  }
  if (bonus < 0) {
    throw new ValidationError(ERROR_MESSAGES.BONUS_INVALID);
  }

  const employee = await findEmployeeById(employeeId);
  if (!employee) {
    throw new NotFoundError(ERROR_MESSAGES.EMPLOYEE_NOT_FOUND);
  }

  const updated = await updateEmployeeSalary(employeeId, { baseSalary, bonus });

  await createSalaryAudit({
    employeeId,
    changedById,
    previousBaseSalary: employee.baseSalary,
    newBaseSalary: baseSalary,
    previousBonus: employee.bonus,
    newBonus: bonus,
  });

  return updated;
}
