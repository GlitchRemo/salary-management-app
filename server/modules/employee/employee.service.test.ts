import { describe, it, expect, vi, beforeEach } from "vitest";
import { buildEmployeeRow } from "@/test/fixtures";

// --- mock the repository before importing the service ---
vi.mock("./employee.repository", () => ({
  findAllEmployees: vi.fn(),
}));

import { findAllEmployees } from "./employee.repository";
import { listEmployees } from "./employee.service";

// ---------------------------------------------------------------------------

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
