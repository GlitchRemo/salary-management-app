import { describe, it, expect, vi, beforeEach } from "vitest";
import { Country, Department, Currency } from "@/app/generated/prisma/enums";

vi.mock("@/server/db/client", () => ({
  prisma: {
    employee: {
      count: vi.fn(),
      aggregate: vi.fn(),
      groupBy: vi.fn(),
      findMany: vi.fn(),
      findFirst: vi.fn(),
    },
  },
}));

import { prisma } from "@/server/db/client";
import {
  getSummaryStats,
  getPayrollByCountry,
  getPayrollByDepartment,
  getAverageSalaryByCountry,
  getDepartmentPayrollForCountry,
  getSalaryRangeByDepartmentForCountry,
  getAllEmployeesForTopEarners,
  getSummaryStatsForCountry,
  getAverageSalaryByDepartmentForCountry,
  getAllEmployeesForTopEarnersInCountry,
} from "./analytics.repository";

const mockCount = vi.mocked(prisma.employee.count);
const mockAggregate = vi.mocked(prisma.employee.aggregate);
const mockGroupBy = vi.mocked(prisma.employee.groupBy);
const mockFindMany = vi.mocked(prisma.employee.findMany);
const mockFindFirst = vi.mocked(prisma.employee.findFirst);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getSummaryStats", () => {
  it("returns correct summary stats", async () => {
    mockCount.mockResolvedValue(10);
    mockAggregate
      .mockResolvedValueOnce({ _sum: { baseSalary: 800000, bonus: 80000 } } as never)
      .mockResolvedValueOnce({ _avg: { baseSalary: 80000 } } as never);
    mockGroupBy.mockResolvedValue([{ country: Country.US }, { country: Country.DE }] as never);

    const result = await getSummaryStats();

    expect(result).toEqual({
      employeeCount: 10,
      totalPayroll: 880000,
      averageSalary: 80000,
      countriesRepresented: 2,
    });
  });

  it("handles null aggregates gracefully", async () => {
    mockCount.mockResolvedValue(0);
    mockAggregate
      .mockResolvedValueOnce({ _sum: { baseSalary: null, bonus: null } } as never)
      .mockResolvedValueOnce({ _avg: { baseSalary: null } } as never);
    mockGroupBy.mockResolvedValue([] as never);

    const result = await getSummaryStats();

    expect(result).toEqual({ employeeCount: 0, totalPayroll: 0, averageSalary: 0, countriesRepresented: 0 });
  });
});

describe("getPayrollByCountry", () => {
  it("returns totalPayroll as sum of baseSalary and bonus per country", async () => {
    mockGroupBy.mockResolvedValue([
      { country: Country.US, _sum: { baseSalary: 200000, bonus: 20000 } },
      { country: Country.DE, _sum: { baseSalary: 100000, bonus: 10000 } },
    ] as never);

    const result = await getPayrollByCountry();

    expect(result).toEqual([
      { country: Country.US, totalPayroll: 220000 },
      { country: Country.DE, totalPayroll: 110000 },
    ]);
  });
});

describe("getPayrollByDepartment", () => {
  it("returns totalPayroll per department", async () => {
    mockGroupBy.mockResolvedValue([
      { department: Department.Engineering, _sum: { baseSalary: 300000, bonus: 30000 } },
    ] as never);

    const result = await getPayrollByDepartment();

    expect(result).toEqual([{ department: Department.Engineering, totalPayroll: 330000 }]);
  });
});

describe("getAverageSalaryByCountry", () => {
  it("returns averageSalary per country", async () => {
    mockGroupBy.mockResolvedValue([
      { country: Country.US, _avg: { baseSalary: 110000 } },
    ] as never);

    const result = await getAverageSalaryByCountry();

    expect(result).toEqual([{ country: Country.US, averageSalary: 110000 }]);
  });
});

describe("getDepartmentPayrollForCountry", () => {
  it("returns department payroll filtered by country", async () => {
    mockGroupBy.mockResolvedValue([
      { department: Department.Engineering, _sum: { baseSalary: 120000, bonus: 15000 } },
    ] as never);

    const result = await getDepartmentPayrollForCountry(Country.US);

    expect(result).toEqual([{ department: Department.Engineering, totalPayroll: 135000 }]);
    expect(mockGroupBy).toHaveBeenCalledWith(expect.objectContaining({ where: { country: Country.US } }));
  });
});

describe("getSalaryRangeByDepartmentForCountry", () => {
  it("returns salary range per department for the given country", async () => {
    mockGroupBy.mockResolvedValue([
      {
        department: Department.Engineering,
        currency: Currency.USD,
        _min: { baseSalary: 80000 },
        _avg: { baseSalary: 110000 },
        _max: { baseSalary: 140000 },
      },
    ] as never);

    const result = await getSalaryRangeByDepartmentForCountry(Country.US);

    expect(result).toEqual([
      { department: Department.Engineering, currency: Currency.USD, min: 80000, average: 110000, max: 140000 },
    ]);
  });
});

describe("getAllEmployeesForTopEarners", () => {
  it("returns employees with compensation fields only", async () => {
    const employees = [
      { name: "Alice", department: Department.Engineering, country: Country.US, currency: Currency.USD, baseSalary: 120000, bonus: 15000 },
    ];
    mockFindMany.mockResolvedValue(employees as never);

    const result = await getAllEmployeesForTopEarners();

    expect(result).toEqual(employees);
    expect(mockFindMany).toHaveBeenCalledWith({
      select: { name: true, department: true, country: true, currency: true, baseSalary: true, bonus: true },
    });
  });
});

describe("getSummaryStatsForCountry", () => {
  it("returns summary stats scoped to a country", async () => {
    mockCount.mockResolvedValue(4);
    mockAggregate.mockResolvedValue({
      _sum: { baseSalary: 400000, bonus: 40000 },
      _avg: { baseSalary: 100000 },
    } as never);
    mockFindFirst.mockResolvedValue({ currency: Currency.USD } as never);

    const result = await getSummaryStatsForCountry(Country.US);

    expect(result).toEqual({
      employeeCount: 4,
      totalPayroll: 440000,
      averageSalary: 100000,
      currency: Currency.USD,
    });
    expect(mockCount).toHaveBeenCalledWith({ where: { country: Country.US } });
  });

  it("falls back to empty string currency when no employees exist", async () => {
    mockCount.mockResolvedValue(0);
    mockAggregate.mockResolvedValue({
      _sum: { baseSalary: null, bonus: null },
      _avg: { baseSalary: null },
    } as never);
    mockFindFirst.mockResolvedValue(null as never);

    const result = await getSummaryStatsForCountry(Country.US);

    expect(result.currency).toBe("");
  });
});

describe("getAverageSalaryByDepartmentForCountry", () => {
  it("returns average salary per department for the given country", async () => {
    mockGroupBy.mockResolvedValue([
      { department: Department.Engineering, _avg: { baseSalary: 115000 } },
    ] as never);

    const result = await getAverageSalaryByDepartmentForCountry(Country.US);

    expect(result).toEqual([{ department: Department.Engineering, averageSalary: 115000 }]);
    expect(mockGroupBy).toHaveBeenCalledWith(expect.objectContaining({ where: { country: Country.US } }));
  });
});

describe("getAllEmployeesForTopEarnersInCountry", () => {
  it("returns employees filtered by country", async () => {
    const employees = [
      { name: "Alice", department: Department.Engineering, country: Country.US, currency: Currency.USD, baseSalary: 120000, bonus: 15000 },
    ];
    mockFindMany.mockResolvedValue(employees as never);

    const result = await getAllEmployeesForTopEarnersInCountry(Country.US);

    expect(result).toEqual(employees);
    expect(mockFindMany).toHaveBeenCalledWith(expect.objectContaining({ where: { country: Country.US } }));
  });
});
