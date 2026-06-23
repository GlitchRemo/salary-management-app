import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Employee } from "@/app/generated/prisma/client";

vi.mock("@/server/modules/salary/salary.service", () => ({
  updateSalary: vi.fn(),
}));

vi.mock("@/server/modules/hr-user/hr-user.repository", () => ({
  findFirstHrUserId: vi.fn(),
}));

import { updateSalary } from "@/server/modules/salary/salary.service";
import { findFirstHrUserId } from "@/server/modules/hr-user/hr-user.repository";
import { PATCH } from "@/app/api/employees/[id]/salary/route";
import { NotFoundError } from "@/server/errors";
import { buildPatchRequest } from "@/test/request-builders";

function buildEmployee(overrides: Partial<Employee> = {}): Employee {
  return {
    id: "emp_1",
    name: "Jane Smith",
    email: "jane@acme.com",
    department: "Engineering",
    country: "US",
    currency: "USD",
    baseSalary: 80000,
    bonus: 5000,
    createdAt: new Date("2024-01-01T00:00:00Z"),
    updatedAt: new Date("2026-06-23T00:00:00Z"),
    ...overrides,
  };
}

function buildContext(id: string): { params: Promise<{ id: string }> } {
  return { params: Promise.resolve({ id }) };
}

describe("PATCH /api/employees/:id/salary", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(findFirstHrUserId).mockResolvedValue("hr_1");
  });

  it("returns 200 with the updated employee on success", async () => {
    const updated = buildEmployee({ baseSalary: 90000, bonus: 6000 });
    vi.mocked(updateSalary).mockResolvedValue(updated);

    const response = await PATCH(buildPatchRequest("http://localhost/api/employees/emp_1", { baseSalary: 90000, bonus: 6000 }), buildContext("emp_1"));

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.id).toBe("emp_1");
    expect(body.baseSalary).toBe(90000);
    expect(body.bonus).toBe(6000);
  });

  it("calls updateSalary with the correct params", async () => {
    vi.mocked(updateSalary).mockResolvedValue(buildEmployee());

    await PATCH(buildPatchRequest("http://localhost/api/employees/emp_1", { baseSalary: 90000, bonus: 6000 }), buildContext("emp_1"));

    expect(vi.mocked(updateSalary)).toHaveBeenCalledWith({
      employeeId: "emp_1",
      baseSalary: 90000,
      bonus: 6000,
      changedById: "hr_1",
    });
  });

  it("returns 400 when baseSalary is missing", async () => {
    const response = await PATCH(buildPatchRequest("http://localhost/api/employees/emp_1", { bonus: 6000 }), buildContext("emp_1"));
    expect(response.status).toBe(400);
  });

  it("returns 400 when baseSalary is zero", async () => {
    const response = await PATCH(buildPatchRequest("http://localhost/api/employees/emp_1", { baseSalary: 0, bonus: 0 }), buildContext("emp_1"));
    expect(response.status).toBe(400);
  });

  it("returns 400 when bonus is negative", async () => {
    const response = await PATCH(buildPatchRequest("http://localhost/api/employees/emp_1", { baseSalary: 80000, bonus: -1 }), buildContext("emp_1"));
    expect(response.status).toBe(400);
  });

  it("returns 404 when employee is not found", async () => {
    vi.mocked(updateSalary).mockRejectedValue(new NotFoundError("Employee not found"));

    const response = await PATCH(buildPatchRequest("http://localhost/api/employees/emp_1", { baseSalary: 80000, bonus: 0 }), buildContext("emp_999"));

    expect(response.status).toBe(404);
    const body = await response.json();
    expect(body.error.code).toBe("NOT_FOUND");
  });
});
