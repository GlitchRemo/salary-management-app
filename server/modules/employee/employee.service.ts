import Fuse from "fuse.js";
import { findAllEmployees, findEmployeeById, upsertManyEmployees } from "./employee.repository";
import { toEmployeeDto } from "./employee.mapper";
import { parseCSV } from "@/server/modules/csv/csv-parser.service";
import { DEFAULT_PAGE_SIZE } from "@/server/constants";
import { logger } from "@/server/logger";
import type { EmployeeDto, EmployeeFilters, ImportResult, PaginatedEmployees } from "./employee.types";

const FUSE_OPTIONS = {
  keys: ["name"],
  threshold: 0.4,
};

export async function listEmployees(
  filters: EmployeeFilters = {},
  page = 1,
): Promise<PaginatedEmployees> {
  const rows = await findAllEmployees(filters);
  const withCompensation = rows.map((e) => ({
    ...e,
    totalCompensation: e.baseSalary + e.bonus,
  }));

  const filtered = filters.search
    ? new Fuse(withCompensation, FUSE_OPTIONS)
        .search(filters.search)
        .map((r) => r.item)
    : withCompensation;

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / DEFAULT_PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * DEFAULT_PAGE_SIZE;
  const employees = filtered.slice(start, start + DEFAULT_PAGE_SIZE);

  return { employees, total, page: safePage, totalPages };
}

export async function getEmployee(id: string): Promise<EmployeeDto | null> {
  const employee = await findEmployeeById(id);
  if (!employee) return null;
  return toEmployeeDto(employee);
}

export async function importEmployees(csvContent: string, changedById: string): Promise<ImportResult> {
  const parseResult = parseCSV(csvContent);
  if (!parseResult.success) {
    logger.warn("importEmployees", "CSV parse failed", { errors: parseResult.errors });
    return { success: false, errors: parseResult.errors };
  }
  logger.info("importEmployees", "Starting bulk upsert", { rowCount: parseResult.rows.length });
  const imported = await upsertManyEmployees(parseResult.rows, changedById);
  logger.info("importEmployees", "Bulk upsert complete", { imported, total: parseResult.rows.length });
  return { success: true, imported };
}
