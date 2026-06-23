import { describe, it, expect, vi, beforeEach } from "vitest";
import { buildEmployee, buildEmployeeRow, buildCsvRow } from "@/test/fixtures";
import { Country, Department } from "@/app/generated/prisma/enums";

// --- mock the repository before importing the service ---
vi.mock("./employee.repository", () => ({
  findAllEmployees: vi.fn(),
  findEmployeeById: vi.fn(),
  upsertManyEmployees: vi.fn(),
}));

vi.mock("@/server/modules/csv/csv-parser.service", () => ({
  parseCSV: vi.fn(),
}));

import { findAllEmployees, findEmployeeById, upsertManyEmployees } from "./employee.repository";
import { parseCSV } from "@/server/modules/csv/csv-parser.service";
import { listEmployees, getEmployee, importEmployees } from "./employee.service";

// ---------------------------------------------------------------------------

const mockFindAllEmployees = vi.mocked(findAllEmployees);
const mockFindEmployeeById = vi.mocked(findEmployeeById);
const mockUpsertManyEmployees = vi.mocked(upsertManyEmployees);
const mockParseCSV = vi.mocked(parseCSV);

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

  it("passes filters through to findAllEmployees", async () => {
    const filters = { search: "alice", country: Country.US, department: Department.Engineering };
    mockFindAllEmployees.mockResolvedValue([]);

    await listEmployees(filters);

    expect(mockFindAllEmployees).toHaveBeenCalledWith(filters);
  });

  it("returns all results when no search term is given", async () => {
    const rows = [
      buildEmployeeRow({ id: "1", email: "a@acme.com", name: "Alice Smith" }),
      buildEmployeeRow({ id: "2", email: "b@acme.com", name: "Bob Jones" }),
    ];
    mockFindAllEmployees.mockResolvedValue(rows);

    const result = await listEmployees({ country: Country.US });

    expect(result).toHaveLength(2);
  });

  it("returns fuzzy-matched results when a search term is given", async () => {
    const rows = [
      buildEmployeeRow({ id: "1", email: "a@acme.com", name: "Alice Smith" }),
      buildEmployeeRow({ id: "2", email: "b@acme.com", name: "Bob Jones" }),
    ];
    mockFindAllEmployees.mockResolvedValue(rows);

    const result = await listEmployees({ search: "Alice" });

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Alice Smith");
  });

  it("returns an empty array when no employees match the search term", async () => {
    const rows = [
      buildEmployeeRow({ id: "1", email: "a@acme.com", name: "Alice Smith" }),
    ];
    mockFindAllEmployees.mockResolvedValue(rows);

    const result = await listEmployees({ search: "Zebediah" });

    expect(result).toHaveLength(0);
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

// ---------------------------------------------------------------------------
// importEmployees
// ---------------------------------------------------------------------------

describe("importEmployees", () => {
  it("returns failure when the CSV is invalid", async () => {
    mockParseCSV.mockReturnValue({ success: false, errors: ["Row 2: email must be a valid email address"] });

    const result = await importEmployees("bad csv");

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.errors).toEqual(["Row 2: email must be a valid email address"]);
    expect(mockUpsertManyEmployees).not.toHaveBeenCalled();
  });

  it("returns success with imported count when the CSV is valid", async () => {
    const rows = [buildCsvRow(), buildCsvRow({ employeeId: "emp_2", email: "b@acme.com" })];
    mockParseCSV.mockReturnValue({ success: true, rows });
    mockUpsertManyEmployees.mockResolvedValue(2);

    const result = await importEmployees("valid csv");

    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.imported).toBe(2);
  });

  it("passes the parsed rows to upsertManyEmployees", async () => {
    const rows = [buildCsvRow()];
    mockParseCSV.mockReturnValue({ success: true, rows });
    mockUpsertManyEmployees.mockResolvedValue(1);

    await importEmployees("valid csv");

    expect(mockUpsertManyEmployees).toHaveBeenCalledWith(rows);
  });

  it("returns success with 0 imported for an empty CSV", async () => {
    mockParseCSV.mockReturnValue({ success: true, rows: [] });
    mockUpsertManyEmployees.mockResolvedValue(0);

    const result = await importEmployees("header only");

    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.imported).toBe(0);
  });
});
