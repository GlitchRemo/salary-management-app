import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { buildEmployeeDto } from "@/test/fixtures";

vi.mock("@/server/modules/employee/employee.service", () => ({
  getEmployee: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("EMP_NOT_FOUND");
  }),
}));

import { getEmployee } from "@/server/modules/employee/employee.service";
import { notFound } from "next/navigation";
import EmployeeDetailsPage from "./page";

function buildParams(id: string): { params: Promise<{ id: string }> } {
  return { params: Promise.resolve({ id }) };
}

describe("EmployeeDetailsPage", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(notFound).mockImplementation(() => {
      throw new Error("EMP_NOT_FOUND");
    });
  });

  it("renders the employee name as heading", async () => {
    vi.mocked(getEmployee).mockResolvedValue(buildEmployeeDto({ name: "Alice Smith" }));
    render(await EmployeeDetailsPage(buildParams("emp_1")));
    expect(screen.getByRole("heading", { name: /alice smith/i })).toBeInTheDocument();
  });

  it("renders the employee email", async () => {
    vi.mocked(getEmployee).mockResolvedValue(buildEmployeeDto({ email: "alice@acme.com" }));
    render(await EmployeeDetailsPage(buildParams("emp_1")));
    expect(screen.getByText("alice@acme.com")).toBeInTheDocument();
  });

  it("renders the employee department and country", async () => {
    vi.mocked(getEmployee).mockResolvedValue(
      buildEmployeeDto({ department: "Engineering", country: "US" }),
    );
    render(await EmployeeDetailsPage(buildParams("emp_1")));
    expect(screen.getByText("Engineering")).toBeInTheDocument();
    expect(screen.getByText("US")).toBeInTheDocument();
  });

  it("renders base salary and bonus with currency", async () => {
    vi.mocked(getEmployee).mockResolvedValue(
      buildEmployeeDto({ currency: "USD", baseSalary: 80000, bonus: 5000 }),
    );
    render(await EmployeeDetailsPage(buildParams("emp_1")));
    expect(screen.getByText("USD 80,000")).toBeInTheDocument();
    expect(screen.getByText("USD 5,000")).toBeInTheDocument();
  });

  it("calls notFound when the employee does not exist", async () => {
    vi.mocked(getEmployee).mockResolvedValue(null);
    await expect(EmployeeDetailsPage(buildParams("emp_999"))).rejects.toThrow("EMP_NOT_FOUND");
    expect(notFound).toHaveBeenCalled();
  });

  it("calls getEmployee with the correct id", async () => {
    vi.mocked(getEmployee).mockResolvedValue(buildEmployeeDto());
    render(await EmployeeDetailsPage(buildParams("emp_42")));
    expect(vi.mocked(getEmployee)).toHaveBeenCalledWith("emp_42");
  });

  it("renders a back link to the employees page", async () => {
    vi.mocked(getEmployee).mockResolvedValue(buildEmployeeDto());
    render(await EmployeeDetailsPage(buildParams("emp_1")));
    expect(screen.getByRole("link", { name: /back to employees/i })).toHaveAttribute(
      "href",
      "/employees",
    );
  });
});
