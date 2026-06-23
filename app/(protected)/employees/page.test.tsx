import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { EmployeeListItem } from "@/server/modules/employee/employee.types";

vi.mock("@/server/modules/employee/employee.service", () => ({
  listEmployees: vi.fn(),
}));

import { listEmployees } from "@/server/modules/employee/employee.service";
import EmployeesPage from "@/app/(protected)/employees/page";

function buildEmployee(overrides: Partial<EmployeeListItem> = {}): EmployeeListItem {
  return {
    id: "emp_1",
    name: "Jane Smith",
    email: "jane.smith@acme.com",
    department: "Engineering",
    country: "US",
    currency: "USD",
    baseSalary: 80000,
    bonus: 5000,
    totalCompensation: 85000,
    ...overrides,
  };
}

describe("EmployeesPage", () => {
  it("renders the page heading", async () => {
    vi.mocked(listEmployees).mockResolvedValue([]);
    render(await EmployeesPage());
    expect(screen.getByRole("heading", { name: /employees/i })).toBeInTheDocument();
  });

  it("renders a row for each employee", async () => {
    vi.mocked(listEmployees).mockResolvedValue([
      buildEmployee({ id: "emp_1", name: "Jane Smith" }),
      buildEmployee({ id: "emp_2", name: "John Doe", email: "john.doe@acme.com" }),
    ]);
    render(await EmployeesPage());
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("renders column headers", async () => {
    vi.mocked(listEmployees).mockResolvedValue([]);
    render(await EmployeesPage());
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Department")).toBeInTheDocument();
    expect(screen.getByText("Base Salary")).toBeInTheDocument();
    expect(screen.getByText("Total")).toBeInTheDocument();
  });

  it("renders the empty state when there are no employees", async () => {
    vi.mocked(listEmployees).mockResolvedValue([]);
    render(await EmployeesPage());
    expect(screen.getByText(/no employees found/i)).toBeInTheDocument();
  });

  it("renders total compensation for each employee", async () => {
    vi.mocked(listEmployees).mockResolvedValue([
      buildEmployee({ currency: "USD", baseSalary: 80000, bonus: 5000, totalCompensation: 85000 }),
    ]);
    render(await EmployeesPage());
    expect(screen.getByText("USD 85,000")).toBeInTheDocument();
  });
});
