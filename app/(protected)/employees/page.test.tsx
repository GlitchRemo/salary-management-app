import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { buildEmployeeListItem } from "@/test/fixtures";

vi.mock("@/server/modules/employee/employee.service", () => ({
  listEmployees: vi.fn(),
}));

import { listEmployees } from "@/server/modules/employee/employee.service";
import EmployeesPage from "@/app/(protected)/employees/page";

describe("EmployeesPage", () => {
  it("renders the page heading", async () => {
    vi.mocked(listEmployees).mockResolvedValue([]);
    render(await EmployeesPage());
    expect(screen.getByRole("heading", { name: /employees/i })).toBeInTheDocument();
  });

  it("renders a row for each employee", async () => {
    vi.mocked(listEmployees).mockResolvedValue([
      buildEmployeeListItem({ id: "emp_1", name: "Jane Smith" }),
      buildEmployeeListItem({ id: "emp_2", name: "John Doe", email: "john.doe@acme.com" }),
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
      buildEmployeeListItem({ currency: "USD", baseSalary: 80000, bonus: 5000, totalCompensation: 85000 }),
    ]);
    render(await EmployeesPage());
    expect(screen.getByText("USD 85,000")).toBeInTheDocument();
  });
});
