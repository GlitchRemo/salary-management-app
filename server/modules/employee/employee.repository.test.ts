import { describe, it, expect, vi, beforeEach } from "vitest";
import { buildEmployee, buildCsvRow } from "@/test/fixtures";
import { Country, Department } from "@/app/generated/prisma/enums";

// --- mock the prisma singleton before importing the module under test ---
vi.mock("@/server/db/client", () => ({
  prisma: {
    employee: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      upsert: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

import { prisma } from "@/server/db/client";
import {
  findAllEmployees,
  findEmployeeById,
  upsertManyEmployees,
} from "./employee.repository";

// ---------------------------------------------------------------------------

const mockFindMany = vi.mocked(prisma.employee.findMany);
const mockFindUnique = vi.mocked(prisma.employee.findUnique);
const mockUpsert = vi.mocked(prisma.employee.upsert);
const mockTransaction = vi.mocked(prisma.$transaction);

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

// ---------------------------------------------------------------------------
// upsertManyEmployees
// ---------------------------------------------------------------------------

describe("upsertManyEmployees", () => {
  beforeEach(() => {
    mockUpsert.mockResolvedValue(buildEmployee());
    mockTransaction.mockResolvedValue([]);
  });

  it("returns the number of rows upserted", async () => {
    const rows = [
      buildCsvRow(),
      buildCsvRow({ employeeId: "emp_2", email: "bob@acme.com" }),
    ];
    const result = await upsertManyEmployees(rows);
    expect(result).toBe(2);
  });

  it("returns 0 for an empty array without calling upsert", async () => {
    const result = await upsertManyEmployees([]);
    expect(result).toBe(0);
    expect(mockUpsert).not.toHaveBeenCalled();
  });

  it("wraps all upserts in a single transaction", async () => {
    await upsertManyEmployees([buildCsvRow(), buildCsvRow({ employeeId: "emp_2", email: "b@acme.com" })]);
    expect(mockTransaction).toHaveBeenCalledOnce();
  });

  it("upserts by employeeId and combines firstName + lastName into name", async () => {
    const row = buildCsvRow({ employeeId: "emp_42", firstName: "Alice", lastName: "Wonder" });
    await upsertManyEmployees([row]);

    expect(mockUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "emp_42" },
        create: expect.objectContaining({ id: "emp_42", name: "Alice Wonder" }),
        update: expect.objectContaining({ name: "Alice Wonder" }),
      })
    );
  });
});
