import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { BudgetAllocationByDepartment, SalaryRangeByDepartment, SalaryDistributionByDepartment } from "@/server/modules/analytics/analytics.types";

vi.mock("@mui/x-charts/BarChart", () => ({
  BarChart: () => <div data-testid="bar-chart" />,
}));

vi.mock("@mui/x-charts/PieChart", () => ({
  PieChart: () => <div data-testid="pie-chart" />,
}));

import { PayrollBarChart, BudgetAllocationChart, SalaryRangeChart, SalaryDistributionChart } from "./DashboardCharts";

// --- PayrollBarChart ---
describe("PayrollBarChart", () => {
  it("renders the title", () => {
    render(<PayrollBarChart title="Payroll by Department" data={[{ label: "Eng", value: 300000 }]} seriesLabel="Total" />);
    expect(screen.getByText("Payroll by Department")).toBeInTheDocument();
  });

  it("renders the chart", () => {
    render(<PayrollBarChart title="Payroll" data={[{ label: "Eng", value: 300000 }]} seriesLabel="Total" />);
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
  });
});

// --- BudgetAllocationChart ---
const budgetData: BudgetAllocationByDepartment[] = [
  { department: "Engineering", totalPayroll: 300000, percentage: 60 },
];

describe("BudgetAllocationChart", () => {
  it("renders the title", () => {
    render(<BudgetAllocationChart data={budgetData} />);
    expect(screen.getByText("Budget Allocation by Department")).toBeInTheDocument();
  });

  it("renders the pie chart when data is present", () => {
    render(<BudgetAllocationChart data={budgetData} />);
    expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
  });

  it("shows a message when data is empty", () => {
    render(<BudgetAllocationChart data={[]} />);
    expect(screen.getByText(/no data for selected country/i)).toBeInTheDocument();
  });
});

// --- SalaryRangeChart ---
const salaryData: SalaryRangeByDepartment[] = [
  { department: "Engineering", currency: "USD", min: 80000, average: 110000, max: 140000 },
];

describe("SalaryRangeChart", () => {
  it("renders the title", () => {
    render(<SalaryRangeChart data={salaryData} />);
    expect(screen.getByText("Salary Range by Department")).toBeInTheDocument();
  });

  it("renders the bar chart when data is present", () => {
    render(<SalaryRangeChart data={salaryData} />);
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
  });

  it("shows a message when data is empty", () => {
    render(<SalaryRangeChart data={[]} />);
    expect(screen.getByText(/no data for selected country/i)).toBeInTheDocument();
  });
});

// --- SalaryDistributionChart ---
const distributionData: SalaryDistributionByDepartment[] = [
  { department: "Engineering", belowAveragePercent: 60, atOrAboveAveragePercent: 40 },
];

describe("SalaryDistributionChart", () => {
  it("renders the title", () => {
    render(<SalaryDistributionChart data={distributionData} />);
    expect(screen.getByText("Employees Below Average Salary by Department")).toBeInTheDocument();
  });

  it("renders the bar chart when data is present", () => {
    render(<SalaryDistributionChart data={distributionData} />);
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
  });

  it("shows a message when data is empty", () => {
    render(<SalaryDistributionChart data={[]} />);
    expect(screen.getByText(/no data for selected country/i)).toBeInTheDocument();
  });
});
