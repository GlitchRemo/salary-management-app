import { describe, it, expect, vi, beforeEach } from "vitest";
import { Country, Department, Currency } from "@/app/generated/prisma/enums";

vi.mock("./analytics.repository", () => ({
  getSummaryStats: vi.fn(),
  getPayrollByCountry: vi.fn(),
  getPayrollByDepartment: vi.fn(),
  getAverageSalaryByCountry: vi.fn(),
  getDepartmentPayrollForCountry: vi.fn(),
  getSalaryRangeByDepartmentForCountry: vi.fn(),
  getAllEmployeesForTopEarners: vi.fn(),
}));

import {
  getDepartmentPayrollForCountry,
  getAllEmployeesForTopEarners,
} from "./analytics.repository";
import { getBudgetAllocationByDepartment, getTopEarnersByCurrency } from "./analytics.service";

const mockGetDepartmentPayroll = vi.mocked(getDepartmentPayrollForCountry);
const mockGetAllEmployees = vi.mocked(getAllEmployeesForTopEarners);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getBudgetAllocationByDepartment", () => {
  it("computes percentage for each department", async () => {
    mockGetDepartmentPayroll.mockResolvedValue([
      { department: Department.Engineering, totalPayroll: 300000 },
      { department: Department.Finance, totalPayroll: 100000 },
      { department: Department.Design, totalPayroll: 100000 },
    ]);

    const result = await getBudgetAllocationByDepartment(Country.US);

    expect(result).toEqual([
      { department: Department.Engineering, totalPayroll: 300000, percentage: 60 },
      { department: Department.Finance, totalPayroll: 100000, percentage: 20 },
      { department: Department.Design, totalPayroll: 100000, percentage: 20 },
    ]);
  });

  it("returns 0% for all departments when total payroll is zero", async () => {
    mockGetDepartmentPayroll.mockResolvedValue([
      { department: Department.Engineering, totalPayroll: 0 },
    ]);

    const result = await getBudgetAllocationByDepartment(Country.US);

    expect(result[0].percentage).toBe(0);
  });

  it("passes the selected country to the repository", async () => {
    mockGetDepartmentPayroll.mockResolvedValue([]);

    await getBudgetAllocationByDepartment(Country.DE);

    expect(mockGetDepartmentPayroll).toHaveBeenCalledWith(Country.DE);
  });
});

describe("getTopEarnersByCurrency", () => {
  it("groups employees by currency", async () => {
    mockGetAllEmployees.mockResolvedValue([
      { name: "Alice", department: Department.Engineering, country: Country.US, currency: Currency.USD, baseSalary: 120000, bonus: 15000 },
      { name: "Clara", department: Department.Engineering, country: Country.DE, currency: Currency.EUR, baseSalary: 95000, bonus: 8000 },
    ]);

    const result = await getTopEarnersByCurrency();

    expect(Object.keys(result)).toContain(Currency.USD);
    expect(Object.keys(result)).toContain(Currency.EUR);
    expect(result[Currency.USD]).toHaveLength(1);
    expect(result[Currency.EUR]).toHaveLength(1);
  });

  it("adds totalCompensation to each earner", async () => {
    mockGetAllEmployees.mockResolvedValue([
      { name: "Alice", department: Department.Engineering, country: Country.US, currency: Currency.USD, baseSalary: 120000, bonus: 15000 },
    ]);

    const result = await getTopEarnersByCurrency();

    expect(result[Currency.USD][0].totalCompensation).toBe(135000);
  });

  it("sorts each group by totalCompensation descending", async () => {
    mockGetAllEmployees.mockResolvedValue([
      { name: "Bob", department: Department.Product, country: Country.US, currency: Currency.USD, baseSalary: 100000, bonus: 5000 },
      { name: "Alice", department: Department.Engineering, country: Country.US, currency: Currency.USD, baseSalary: 120000, bonus: 15000 },
    ]);

    const result = await getTopEarnersByCurrency();

    expect(result[Currency.USD][0].name).toBe("Alice");
    expect(result[Currency.USD][1].name).toBe("Bob");
  });

  it("limits each currency group to 10 earners", async () => {
    const employees = Array.from({ length: 15 }, (_, i) => ({
      name: `Employee ${i}`,
      department: Department.Engineering,
      country: Country.US,
      currency: Currency.USD,
      baseSalary: 100000 - i * 1000,
      bonus: 0,
    }));
    mockGetAllEmployees.mockResolvedValue(employees);

    const result = await getTopEarnersByCurrency();

    expect(result[Currency.USD]).toHaveLength(10);
    expect(result[Currency.USD][0].name).toBe("Employee 0");
  });
});
