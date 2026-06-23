import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { buildEmployeeListItem } from "@/test/fixtures";

vi.mock("@/server/modules/employee/employee.service", () => ({
  listEmployees: vi.fn(),
}));

vi.mock("@/components/molecules/SearchBar", () => ({
  SearchBar: () => null,
}));

vi.mock("@/components/atoms/EnumFilterSelect", () => ({
  EnumFilterSelect: () => null,
}));

vi.mock("@/components/organisms/CsvUpload", () => ({
  CsvUpload: () => null,
}));

import { listEmployees } from "@/server/modules/employee/employee.service";
import EmployeesPage from "@/app/(protected)/employees/page";

function makeSearchParams(
  params: { search?: string; country?: string; department?: string } = {},
): Promise<{ search?: string; country?: string; department?: string }> {
  return Promise.resolve(params);
}

describe("EmployeesPage", () => {
  it("renders the page heading", async () => {
    vi.mocked(listEmployees).mockResolvedValue([]);
    render(await EmployeesPage({ searchParams: makeSearchParams() }));
    expect(screen.getByRole("heading", { name: /employees/i })).toBeInTheDocument();
  });

  it("renders a row for each employee", async () => {
    vi.mocked(listEmployees).mockResolvedValue([
      buildEmployeeListItem({ id: "emp_1", name: "Jane Smith" }),
      buildEmployeeListItem({ id: "emp_2", name: "John Doe", email: "john.doe@acme.com" }),
    ]);
    render(await EmployeesPage({ searchParams: makeSearchParams() }));
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("renders column headers", async () => {
    vi.mocked(listEmployees).mockResolvedValue([]);
    render(await EmployeesPage({ searchParams: makeSearchParams() }));
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Department")).toBeInTheDocument();
    expect(screen.getByText("Base Salary")).toBeInTheDocument();
    expect(screen.getByText("Total")).toBeInTheDocument();
  });

  it("renders the empty state when there are no employees", async () => {
    vi.mocked(listEmployees).mockResolvedValue([]);
    render(await EmployeesPage({ searchParams: makeSearchParams() }));
    expect(screen.getByText(/no employees found/i)).toBeInTheDocument();
  });

  it("renders total compensation for each employee", async () => {
    vi.mocked(listEmployees).mockResolvedValue([
      buildEmployeeListItem({ currency: "USD", baseSalary: 80000, bonus: 5000, totalCompensation: 85000 }),
    ]);
    render(await EmployeesPage({ searchParams: makeSearchParams() }));
    expect(screen.getByText("USD 85,000")).toBeInTheDocument();
  });

  it("renders a navigation arrow link for each employee row", async () => {
    vi.mocked(listEmployees).mockResolvedValue([
      buildEmployeeListItem({ id: "emp_1", name: "Jane Smith" }),
      buildEmployeeListItem({ id: "emp_2", name: "John Doe" }),
    ]);
    render(await EmployeesPage({ searchParams: makeSearchParams() }));
    expect(screen.getByRole("link", { name: /view details for jane smith/i })).toHaveAttribute(
      "href",
      "/employees/emp_1",
    );
    expect(screen.getByRole("link", { name: /view details for john doe/i })).toHaveAttribute(
      "href",
      "/employees/emp_2",
    );
  });

  it("passes the search param to listEmployees", async () => {
    vi.mocked(listEmployees).mockResolvedValue([]);
    await EmployeesPage({ searchParams: makeSearchParams({ search: "Alice" }) });
    expect(listEmployees).toHaveBeenCalledWith({ search: "Alice" });
  });

  it("passes the country param to listEmployees", async () => {
    vi.mocked(listEmployees).mockResolvedValue([]);
    await EmployeesPage({ searchParams: makeSearchParams({ country: "DE" }) });
    expect(listEmployees).toHaveBeenCalledWith({ country: "DE" });
  });

  it("passes the department param to listEmployees", async () => {
    vi.mocked(listEmployees).mockResolvedValue([]);
    await EmployeesPage({ searchParams: makeSearchParams({ department: "Engineering" }) });
    expect(listEmployees).toHaveBeenCalledWith({ department: "Engineering" });
  });

  it("ignores invalid country values", async () => {
    vi.mocked(listEmployees).mockResolvedValue([]);
    await EmployeesPage({ searchParams: makeSearchParams({ country: "INVALID" }) });
    expect(listEmployees).toHaveBeenCalledWith({});
  });

  it("calls listEmployees with empty filters when no search param is present", async () => {
    vi.mocked(listEmployees).mockResolvedValue([]);
    await EmployeesPage({ searchParams: makeSearchParams() });
    expect(listEmployees).toHaveBeenCalledWith({});
  });
});
