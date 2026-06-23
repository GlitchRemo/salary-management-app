import { describe, it, expect, vi, beforeEach } from "vitest";
import { buildEmployee, buildEmployeeRow } from "@/test/fixtures";

// --- mock the repository before importing the service ---
vi.mock("./employee.repository", () => ({
  findAllEmployees: vi.fn(),
  findEmployeeById: vi.fn(),
}));

import { findAllEmployees, findEmployeeById } from "./employee.repository";
import { listEmployees, getEmployee } from "./employee.service";

// ---------------------------------------------------------------------------

const mockFindAllEmployees = vi.mocked(findAllEmployees);
const mockFindEmployeeById = vi.mocked(findEmployeeById);

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

// ---------------------------------------------------------------------------
// getEmployee
// ---------------------------------------------------------------------------

describe("getEmployee", () => {
  it("returns an EmployeeDto when the employee exists", async () => {
    mockFindEmployeeById.mockResolvedValue(buildEmployee({ id: "emp_1", name: "Alice Smith" }));

    const result = await getEmployee("emp_1");

    expect(result).not.toBeNull();
    expect(result?.id).toBe("emp_1");
    expect(result?.name).toBe("Alice Smith");
  });

  it("returns null when the employee does not exist", async () => {
    mockFindEmployeeById.mockResolvedValue(null);

    const result = await getEmployee("emp_999");

    expect(result).toBeNull();
  });

  it("delegates to findEmployeeById with the correct id", async () => {
    mockFindEmployeeById.mockResolvedValue(buildEmployee());

    await getEmployee("emp_42");

    expect(mockFindEmployeeById).toHaveBeenCalledWith("emp_42");
  });

  it("maps the employee to a DTO with ISO date strings", async () => {
    const date = new Date("2026-06-23T00:00:00Z");
    mockFindEmployeeById.mockResolvedValue(buildEmployee({ updatedAt: date }));

    const result = await getEmployee("emp_1");

    expect(result?.updatedAt).toBe(date.toISOString());
  });
});
