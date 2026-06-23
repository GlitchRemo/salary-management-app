import { findAllEmployees } from "./employee.repository";
import type { EmployeeListItem } from "./employee.types";

export type { EmployeeListItem } from "./employee.types";

export async function listEmployees(): Promise<EmployeeListItem[]> {
  const employees = await findAllEmployees();
  return employees.map((e) => ({
    ...e,
    totalCompensation: e.baseSalary + e.bonus,
  }));
}
