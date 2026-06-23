import { describe, it, expect, vi, beforeEach } from "vitest";
import { buildEmployee } from "@/test/fixtures";
import { Country, Department } from "@/app/generated/prisma/enums";

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
} from "./employee.repository";

// ---------------------------------------------------------------------------

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
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        select: expect.objectContaining({ name: true, email: true, baseSalary: true, bonus: true }),
        orderBy: { name: "asc" },
      })
    );
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

  it("passes empty where when no filters are provided", async () => {
    mockFindMany.mockResolvedValue([]);

    await findAllEmployees();

    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: {} })
    );
  });

  it("ignores search — fuzzy matching is handled by the service layer", async () => {
    mockFindMany.mockResolvedValue([]);

    await findAllEmployees({ search: "alice" });

    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: {} })
    );
  });

  it("filters by country", async () => {
    mockFindMany.mockResolvedValue([]);

    await findAllEmployees({ country: Country.US });

    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { country: Country.US } })
    );
  });

  it("filters by department", async () => {
    mockFindMany.mockResolvedValue([]);

    await findAllEmployees({ department: Department.Engineering });

    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { department: Department.Engineering } })
    );
  });

  it("combines country and department filters", async () => {
    mockFindMany.mockResolvedValue([]);

    await findAllEmployees({ country: Country.US, department: Department.Engineering });

    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { country: Country.US, department: Department.Engineering },
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
