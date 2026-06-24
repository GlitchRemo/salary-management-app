import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/server/modules/analytics/analytics.service", () => ({
  getSummaryStatsForCountry: vi.fn().mockResolvedValue({
    employeeCount: 10,
    totalPayroll: 1000000,
    averageSalary: 90000,
    currency: "USD",
  }),
  getSalaryDistributionByDepartment: vi.fn().mockResolvedValue([
    { department: "Engineering", belowAveragePercent: 60, atOrAboveAveragePercent: 40 },
  ]),
  getAverageSalaryByDepartmentForCountry: vi.fn().mockResolvedValue([
    { department: "Engineering", averageSalary: 110000 },
  ]),
  getBudgetAllocationByDepartment: vi.fn().mockResolvedValue([]),
  getSalaryRangeByDepartment: vi.fn().mockResolvedValue([]),
  getTopEarnersByCountry: vi.fn().mockResolvedValue([]),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@/components/organisms/PayrollBarChart", () => ({
  PayrollBarChart: ({ title }: { title: string }) => <div>{title}</div>,
}));

vi.mock("@/components/organisms/BudgetAllocationChart", () => ({
  BudgetAllocationChart: () => <div>Budget Allocation by Department</div>,
}));

vi.mock("@/components/organisms/SalaryRangeChart", () => ({
  SalaryRangeChart: () => <div>Salary Range by Department</div>,
}));

vi.mock("@/components/organisms/TopEarnersTable", () => ({
  TopEarnersTable: () => <div>Top Earners</div>,
}));

import DashboardPage from "@/app/(protected)/dashboard/page";

function makeSearchParams(params: { country?: string } = {}): Promise<{ country?: string }> {
  return Promise.resolve(params);
}

describe("DashboardPage", () => {
  it("renders the page heading with the selected country", async () => {
    render(await DashboardPage({ searchParams: makeSearchParams({ country: "US" }) }));
    expect(screen.getByRole("heading", { name: /dashboard.*united states/i })).toBeInTheDocument();
  });

  it("defaults to US when no country param is provided", async () => {
    render(await DashboardPage({ searchParams: makeSearchParams() }));
    expect(screen.getByRole("heading", { name: /dashboard.*united states/i })).toBeInTheDocument();
  });

  it("renders the four summary cards", async () => {
    render(await DashboardPage({ searchParams: makeSearchParams() }));
    expect(screen.getByText("Employee Count")).toBeInTheDocument();
    expect(screen.getAllByText(/Total Payroll/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Average Salary/).length).toBeGreaterThan(0);
    expect(screen.getByText("Currency")).toBeInTheDocument();
  });

  it("renders summary card values from the service", async () => {
    render(await DashboardPage({ searchParams: makeSearchParams() }));
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("USD")).toBeInTheDocument();
  });

  it("renders the salary distribution and average salary charts", async () => {
    render(await DashboardPage({ searchParams: makeSearchParams() }));
    expect(screen.getByText("Employees Below Average Salary by Department")).toBeInTheDocument();
    expect(screen.getAllByText(/Average Salary/).length).toBeGreaterThan(0);
  });

  it("renders the top earners section", async () => {
    render(await DashboardPage({ searchParams: makeSearchParams() }));
    expect(screen.getAllByText(/top earners/i).length).toBeGreaterThan(0);
  });
});
