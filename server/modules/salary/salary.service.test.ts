import { describe, it, expect, vi, beforeEach } from "vitest";
import { buildEmployee, buildSalaryAudit } from "@/test/fixtures";

vi.mock("../employee/employee.repository", () => ({
  findEmployeeById: vi.fn(),
}));

vi.mock("./salary.repository", () => ({
  updateEmployeeSalary: vi.fn(),
  createSalaryAudit: vi.fn(),
}));

import { findEmployeeById } from "../employee/employee.repository";
import { updateEmployeeSalary, createSalaryAudit } from "./salary.repository";
import { updateSalary } from "./salary.service";
import { ValidationError, NotFoundError } from "@/server/errors";


describe("updateSalary", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns the updated employee", async () => {
    const updated = buildEmployee({ baseSalary: 90000, bonus: 6000 });
    vi.mocked(findEmployeeById).mockResolvedValue(buildEmployee());
    vi.mocked(updateEmployeeSalary).mockResolvedValue(updated);
    vi.mocked(createSalaryAudit).mockResolvedValue(buildSalaryAudit());

    const result = await updateSalary({
      employeeId: "emp_1",
      baseSalary: 90000,
      bonus: 6000,
      changedById: "hr_1",
    });

    expect(result).toEqual(updated);
  });

  it("creates a salary audit with previous and new values", async () => {
    vi.mocked(findEmployeeById).mockResolvedValue(buildEmployee({ baseSalary: 80000, bonus: 5000 }));
    vi.mocked(updateEmployeeSalary).mockResolvedValue(buildEmployee({ baseSalary: 90000, bonus: 6000 }));
    vi.mocked(createSalaryAudit).mockResolvedValue(buildSalaryAudit());

    await updateSalary({ employeeId: "emp_1", baseSalary: 90000, bonus: 6000, changedById: "hr_1" });

    expect(vi.mocked(createSalaryAudit)).toHaveBeenCalledWith({
      employeeId: "emp_1",
      changedById: "hr_1",
      previousBaseSalary: 80000,
      newBaseSalary: 90000,
      previousBonus: 5000,
      newBonus: 6000,
    });
  });

  it("throws ValidationError when baseSalary is zero", async () => {
    await expect(
      updateSalary({ employeeId: "emp_1", baseSalary: 0, bonus: 0, changedById: "hr_1" })
    ).rejects.toThrow(ValidationError);
  });

  it("throws ValidationError when baseSalary is negative", async () => {
    await expect(
      updateSalary({ employeeId: "emp_1", baseSalary: -100, bonus: 0, changedById: "hr_1" })
    ).rejects.toThrow(ValidationError);
  });

  it("throws ValidationError when bonus is negative", async () => {
    await expect(
      updateSalary({ employeeId: "emp_1", baseSalary: 80000, bonus: -1, changedById: "hr_1" })
    ).rejects.toThrow(ValidationError);
  });

  it("returns the existing employee without updating or auditing when salary is unchanged", async () => {
    const employee = buildEmployee({ baseSalary: 80000, bonus: 5000 });
    vi.mocked(findEmployeeById).mockResolvedValue(employee);

    const result = await updateSalary({
      employeeId: employee.id,
      baseSalary: 80000,
      bonus: 5000,
      changedById: "hr_1",
    });

    expect(result).toEqual(employee);
    expect(vi.mocked(updateEmployeeSalary)).not.toHaveBeenCalled();
    expect(vi.mocked(createSalaryAudit)).not.toHaveBeenCalled();
  });

  it("throws NotFoundError when employee does not exist", async () => {
    vi.mocked(findEmployeeById).mockResolvedValue(null);

    await expect(
      updateSalary({ employeeId: "emp_999", baseSalary: 80000, bonus: 0, changedById: "hr_1" })
    ).rejects.toThrow(NotFoundError);
  });
});
