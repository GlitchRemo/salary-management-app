import { describe, it, expect, vi, beforeEach } from "vitest";
import { buildEmployee, buildSalaryAudit } from "@/test/fixtures";

vi.mock("@/server/db/client", () => ({
  prisma: {
    employee: {
      update: vi.fn(),
    },
    salaryAudit: {
      create: vi.fn(),
    },
  },
}));

import { prisma } from "@/server/db/client";
import { updateEmployeeSalary, createSalaryAudit } from "./salary.repository";
import type { SalaryAuditInput } from "./salary.types";


const mockUpdate = vi.mocked(prisma.employee.update);
const mockCreate = vi.mocked(prisma.salaryAudit.create);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("updateEmployeeSalary", () => {
  it("updates baseSalary and bonus for the given employee", async () => {
    const updated = buildEmployee({ baseSalary: 90000, bonus: 6000 });
    mockUpdate.mockResolvedValue(updated);

    const result = await updateEmployeeSalary("emp_1", { baseSalary: 90000, bonus: 6000 });

    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: "emp_1" },
      data: { baseSalary: 90000, bonus: 6000 },
    });
    expect(result).toEqual(updated);
  });

  it("returns the updated employee", async () => {
    const updated = buildEmployee({ baseSalary: 95000, bonus: 0 });
    mockUpdate.mockResolvedValue(updated);

    const result = await updateEmployeeSalary("emp_1", { baseSalary: 95000, bonus: 0 });

    expect(result.baseSalary).toBe(95000);
    expect(result.bonus).toBe(0);
  });
});

describe("createSalaryAudit", () => {
  it("persists a salary audit record with all fields", async () => {
    const input: SalaryAuditInput = {
      employeeId: "emp_1",
      changedById: "hr_1",
      previousBaseSalary: 80000,
      newBaseSalary: 90000,
      previousBonus: 5000,
      newBonus: 6000,
    };
    const audit = buildSalaryAudit();
    mockCreate.mockResolvedValue(audit);

    const result = await createSalaryAudit(input);

    expect(mockCreate).toHaveBeenCalledWith({ data: input });
    expect(result).toEqual(audit);
  });
});
