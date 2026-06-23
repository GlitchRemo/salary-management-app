import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Employee } from "@/app/generated/prisma/client";

// --- mock the prisma singleton before importing the module under test ---
vi.mock("@/server/db/client", () => ({
  prisma: {
    employee: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

import { prisma } from "@/server/db/client";
import {
  findAllEmployees,
  findEmployeeById,
} from "@/server/repositories/employee.repository";

// ---------------------------------------------------------------------------
// Test factory
// ---------------------------------------------------------------------------

function buildEmployee(overrides: Partial<Employee> = {}): Employee {
  return {
    id: "emp_test_1",
    name: "Jane Smith",
    email: "jane.smith@acme.com",
    department: "Engineering",
    country: "US",
    currency: "USD",
    baseSalary: 75000,
    bonus: 5000,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    ...overrides,
  };
}

const mockFindMany = vi.mocked(prisma.employee.findMany);
const mockFindUnique = vi.mocked(prisma.employee.findUnique);

beforeEach(() => {
  vi.clearAllMocks();
});

// ---------------------------------------------------------------------------
// findAllEmployees
// ---------------------------------------------------------------------------

describe("findAllEmployees", () => {
  it("returns employees ordered by name", async () => {
    const alice = buildEmployee({ id: "1", name: "Alice", email: "alice@acme.com" });
    const bob = buildEmployee({ id: "2", name: "Bob", email: "bob@acme.com" });
    mockFindMany.mockResolvedValue([alice, bob]);

    const result = await findAllEmployees();

    expect(mockFindMany).toHaveBeenCalledOnce();
    expect(mockFindMany).toHaveBeenCalledWith({
      select: expect.objectContaining({ name: true, email: true, baseSalary: true, bonus: true }),
      orderBy: { name: "asc" },
    });
    expect(result).toEqual([alice, bob]);
  });

  it("returns an empty array when there are no employees", async () => {
    mockFindMany.mockResolvedValue([]);

    const result = await findAllEmployees();

    expect(result).toEqual([]);
  });

  it("selects only the required fields", async () => {
    mockFindMany.mockResolvedValue([]);

    await findAllEmployees();

    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        select: {
          id: true,
          name: true,
          email: true,
          department: true,
          country: true,
          currency: true,
          baseSalary: true,
          bonus: true,
        },
      })
    );
  });
});

// ---------------------------------------------------------------------------
// findEmployeeById
// ---------------------------------------------------------------------------

describe("findEmployeeById", () => {
  it("returns the matching employee", async () => {
    const employee = buildEmployee({ id: "emp_abc" });
    mockFindUnique.mockResolvedValue(employee);

    const result = await findEmployeeById("emp_abc");

    expect(mockFindUnique).toHaveBeenCalledWith({ where: { id: "emp_abc" } });
    expect(result).toEqual(employee);
  });

  it("returns null when the employee does not exist", async () => {
    mockFindUnique.mockResolvedValue(null);

    const result = await findEmployeeById("unknown_id");

    expect(result).toBeNull();
  });
});
