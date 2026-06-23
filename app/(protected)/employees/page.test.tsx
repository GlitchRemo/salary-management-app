import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { buildEmployeeListItem } from "@/test/fixtures";
import type { PaginatedEmployees, EmployeeListItem } from "@/server/modules/employee/employee.types";

vi.mock("@/server/modules/employee/employee.service", () => ({
  listEmployees: vi.fn(),
  importEmployees: vi.fn(),
}));

vi.mock("@/server/modules/hr-user/hr-user.repository", () => ({
  findFirstHrUserId: vi.fn().mockResolvedValue("hr_test"),
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

vi.mock("@/components/molecules/PaginationControls", () => ({
  PaginationControls: () => null,
}));

import { listEmployees } from "@/server/modules/employee/employee.service";
import EmployeesPage from "@/app/(protected)/employees/page";

type SearchParams = { search?: string; country?: string; department?: string; page?: string };

function makeSearchParams(params: SearchParams = {}): Promise<SearchParams> {
  return Promise.resolve(params);
}

function makePaginated(employees: EmployeeListItem[] = []): PaginatedEmployees {
  return { employees, total: employees.length, page: 1, totalPages: 1 };
}

describe("EmployeesPage", () => {
  it("renders the page heading", async () => {
    vi.mocked(listEmployees).mockResolvedValue(makePaginated([]));
    render(await EmployeesPage({ searchParams: makeSearchParams() }));
    expect(screen.getByRole("heading", { name: /employees/i })).toBeInTheDocument();
  });

  it("renders a row for each employee", async () => {
    vi.mocked(listEmployees).mockResolvedValue(
      makePaginated([
        buildEmployeeListItem({ id: "emp_1", name: "Jane Smith" }),
        buildEmployeeListItem({ id: "emp_2", name: "John Doe", email: "john.doe@acme.com" }),
      ]),
    );
    render(await EmployeesPage({ searchParams: makeSearchParams() }));
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("renders column headers", async () => {
    vi.mocked(listEmployees).mockResolvedValue(makePaginated([]));
    render(await EmployeesPage({ searchParams: makeSearchParams() }));
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Department")).toBeInTheDocument();
    expect(screen.getByText("Base Salary")).toBeInTheDocument();
    expect(screen.getByText("Total")).toBeInTheDocument();
  });

  it("renders the empty state when there are no employees", async () => {
    vi.mocked(listEmployees).mockResolvedValue(makePaginated([]));
    render(await EmployeesPage({ searchParams: makeSearchParams() }));
    expect(screen.getByText(/no employees found/i)).toBeInTheDocument();
  });

  it("renders total compensation for each employee", async () => {
    vi.mocked(listEmployees).mockResolvedValue(
      makePaginated([
        buildEmployeeListItem({ currency: "USD", baseSalary: 80000, bonus: 5000, totalCompensation: 85000 }),
      ]),
    );
    render(await EmployeesPage({ searchParams: makeSearchParams() }));
    expect(screen.getByText("USD 85,000")).toBeInTheDocument();
  });

  it("renders a navigation arrow link for each employee row", async () => {
    vi.mocked(listEmployees).mockResolvedValue(
      makePaginated([
        buildEmployeeListItem({ id: "emp_1", name: "Jane Smith" }),
        buildEmployeeListItem({ id: "emp_2", name: "John Doe" }),
      ]),
    );
    render(await EmployeesPage({ searchParams: makeSearchParams() }));
    expect(screen.getByRole("link", { name: /view details for jane smith/i })).toHaveAttribute("href", "/employees/emp_1");
    expect(screen.getByRole("link", { name: /view details for john doe/i })).toHaveAttribute("href", "/employees/emp_2");
  });

  it("passes the search param and page 1 to listEmployees", async () => {
    vi.mocked(listEmployees).mockResolvedValue(makePaginated([]));
    await EmployeesPage({ searchParams: makeSearchParams({ search: "Alice" }) });
    expect(listEmployees).toHaveBeenCalledWith({ search: "Alice" }, 1);
  });

  it("passes the country param to listEmployees", async () => {
    vi.mocked(listEmployees).mockResolvedValue(makePaginated([]));
    await EmployeesPage({ searchParams: makeSearchParams({ country: "DE" }) });
    expect(listEmployees).toHaveBeenCalledWith({ country: "DE" }, 1);
  });

  it("passes the department param to listEmployees", async () => {
    vi.mocked(listEmployees).mockResolvedValue(makePaginated([]));
    await EmployeesPage({ searchParams: makeSearchParams({ department: "Engineering" }) });
    expect(listEmployees).toHaveBeenCalledWith({ department: "Engineering" }, 1);
  });

  it("passes the page param to listEmployees", async () => {
    vi.mocked(listEmployees).mockResolvedValue(makePaginated([]));
    await EmployeesPage({ searchParams: makeSearchParams({ page: "3" }) });
    expect(listEmployees).toHaveBeenCalledWith({}, 3);
  });

  it("ignores invalid country values", async () => {
    vi.mocked(listEmployees).mockResolvedValue(makePaginated([]));
    await EmployeesPage({ searchParams: makeSearchParams({ country: "INVALID" }) });
    expect(listEmployees).toHaveBeenCalledWith({}, 1);
  });

  it("calls listEmployees with empty filters when no params are present", async () => {
    vi.mocked(listEmployees).mockResolvedValue(makePaginated([]));
    await EmployeesPage({ searchParams: makeSearchParams() });
    expect(listEmployees).toHaveBeenCalledWith({}, 1);
  });
});
