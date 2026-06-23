import { findAllEmployees, findEmployeeById } from "./employee.repository";
import { toEmployeeDto } from "./employee.mapper";
import type { EmployeeListItem, EmployeeDto } from "./employee.types";

export type { EmployeeListItem, EmployeeDto } from "./employee.types";

export async function listEmployees(): Promise<EmployeeListItem[]> {
  const employees = await findAllEmployees();
  return employees.map((e) => ({
    ...e,
    totalCompensation: e.baseSalary + e.bonus,
  }));
}

export async function getEmployee(id: string): Promise<EmployeeDto | null> {
  const employee = await findEmployeeById(id);
  if (!employee) return null;
  return toEmployeeDto(employee);
}
