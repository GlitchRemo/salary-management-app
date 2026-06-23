import { describe, it, expect, vi, beforeEach } from "vitest";
import type { EmployeeRow } from "@/server/repositories/employee.types";

// --- mock the repository before importing the service ---
vi.mock("@/server/repositories/employee.repository", () => ({
  findAllEmployees: vi.fn(),
}));

import { findAllEmployees } from "@/server/repositories/employee.repository";
import { listEmployees } from "@/server/services/employee.service";

// ---------------------------------------------------------------------------
// Test factory
// ---------------------------------------------------------------------------

function buildEmployeeRow(overrides: Partial<EmployeeRow> = {}): EmployeeRow {
  return {
    id: "emp_test_1",
    name: "Jane Smith",
    email: "jane.smith@acme.com",
    department: "Engineering",
    country: "US",
    currency: "USD",
    baseSalary: 75000,
    bonus: 5000,
    ...overrides,
  };
}

const mockFindAllEmployees = vi.mocked(findAllEmployees);

beforeEach(() => {
  vi.clearAllMocks();
});

// ---------------------------------------------------------------------------
// listEmployees
// ---------------------------------------------------------------------------

describe("listEmployees", () => {
  it("returns employees with totalCompensation added", async () => {
    const row = buildEmployeeRow({ baseSalary: 100000, bonus: 10000 });
    mockFindAllEmployees.mockResolvedValue([row]);

    const result = await listEmployees();

    expect(result).toHaveLength(1);
    expect(result[0].totalCompensation).toBe(110000);
  });

  it("calculates totalCompensation as baseSalary + bonus", async () => {
    const rows = [
      buildEmployeeRow({ id: "1", email: "a@acme.com", baseSalary: 50000, bonus: 0 }),
      buildEmployeeRow({ id: "2", email: "b@acme.com", baseSalary: 80000, bonus: 20000 }),
    ];
    mockFindAllEmployees.mockResolvedValue(rows);

    const result = await listEmployees();

    expect(result[0].totalCompensation).toBe(50000);
    expect(result[1].totalCompensation).toBe(100000);
  });

  it("preserves all original employee fields", async () => {
    const row = buildEmployeeRow();
    mockFindAllEmployees.mockResolvedValue([row]);

    const result = await listEmployees();

    expect(result[0]).toMatchObject(row);
  });

  it("returns an empty array when there are no employees", async () => {
    mockFindAllEmployees.mockResolvedValue([]);

    const result = await listEmployees();

    expect(result).toEqual([]);
  });

  it("delegates to findAllEmployees", async () => {
    mockFindAllEmployees.mockResolvedValue([]);

    await listEmployees();

    expect(mockFindAllEmployees).toHaveBeenCalledOnce();
  });
});
