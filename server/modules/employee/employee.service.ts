import Fuse from "fuse.js";
import { findAllEmployees, findEmployeeById, upsertManyEmployees } from "./employee.repository";
import { toEmployeeDto } from "./employee.mapper";
import { parseCSV } from "@/server/modules/csv/csv-parser.service";
import type { EmployeeListItem, EmployeeDto, EmployeeFilters, ImportResult } from "./employee.types";

const FUSE_OPTIONS = {
  keys: ["name"],
  threshold: 0.4,
};

export async function listEmployees(filters: EmployeeFilters = {}): Promise<EmployeeListItem[]> {
  const employees = await findAllEmployees(filters);
  const withCompensation = employees.map((e) => ({
    ...e,
    totalCompensation: e.baseSalary + e.bonus,
  }));
  if (!filters.search) {
    return withCompensation;
  }
  return new Fuse(withCompensation, FUSE_OPTIONS)
    .search(filters.search)
    .map((r) => r.item);
}

export async function getEmployee(id: string): Promise<EmployeeDto | null> {
  const employee = await findEmployeeById(id);
  if (!employee) return null;
  return toEmployeeDto(employee);
}

export async function importEmployees(csvContent: string): Promise<ImportResult> {
  const parseResult = parseCSV(csvContent);
  if (!parseResult.success) {
    return { success: false, errors: parseResult.errors };
  }
  const imported = await upsertManyEmployees(parseResult.rows);
  return { success: true, imported };
}
