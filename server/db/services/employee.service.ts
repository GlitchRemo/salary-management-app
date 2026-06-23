import { findAllEmployees } from "@/server/db/repositories/employee.repository";
import type { EmployeeListItem } from "@/server/db/services/employee.types";

export type { EmployeeListItem } from "@/server/db/services/employee.types";

export async function listEmployees(): Promise<EmployeeListItem[]> {
  const employees = await findAllEmployees();
  return employees.map((e) => ({
    ...e,
    totalCompensation: e.baseSalary + e.bonus,
  }));
}
