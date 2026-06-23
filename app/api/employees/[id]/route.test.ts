import { describe, it, expect, vi, beforeEach } from "vitest";
import { buildEmployee } from "@/test/fixtures";

vi.mock("@/server/modules/employee/employee.repository", () => ({
  findEmployeeById: vi.fn(),
}));

import { findEmployeeById } from "@/server/modules/employee/employee.repository";
import { GET } from "@/app/api/employees/[id]/route";
import { buildGetRequest } from "@/test/request-builders";

function buildContext(id: string): { params: Promise<{ id: string }> } {
  return { params: Promise.resolve({ id }) };
}

describe("GET /api/employees/:id", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns 200 with the employee on success", async () => {
    const employee = buildEmployee({ id: "emp_1", name: "Alice Smith" });
    vi.mocked(findEmployeeById).mockResolvedValue(employee);

    const response = await GET(buildGetRequest("http://localhost/api/employees/emp_1"), buildContext("emp_1"));

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.id).toBe("emp_1");
    expect(body.name).toBe("Alice Smith");
  });

  it("calls findEmployeeById with the correct id", async () => {
    vi.mocked(findEmployeeById).mockResolvedValue(buildEmployee());

    await GET(buildGetRequest("http://localhost/api/employees/emp_42"), buildContext("emp_42"));

    expect(vi.mocked(findEmployeeById)).toHaveBeenCalledWith("emp_42");
  });

  it("returns 404 when employee is not found", async () => {
    vi.mocked(findEmployeeById).mockResolvedValue(null);

    const response = await GET(buildGetRequest("http://localhost/api/employees/emp_999"), buildContext("emp_999"));

    expect(response.status).toBe(404);
    const body = await response.json();
    expect(body.error.code).toBe("NOT_FOUND");
  });

  it("maps all employee fields in the response", async () => {
    const employee = buildEmployee({
      id: "emp_1",
      email: "alice@acme.com",
      department: "Engineering",
      country: "US",
      currency: "USD",
      baseSalary: 80000,
      bonus: 5000,
    });
    vi.mocked(findEmployeeById).mockResolvedValue(employee);

    const response = await GET(buildGetRequest("http://localhost/api/employees/emp_1"), buildContext("emp_1"));

    const body = await response.json();
    expect(body.email).toBe("alice@acme.com");
    expect(body.department).toBe("Engineering");
    expect(body.country).toBe("US");
    expect(body.currency).toBe("USD");
    expect(body.baseSalary).toBe(80000);
    expect(body.bonus).toBe(5000);
    expect(body.createdAt).toBeDefined();
    expect(body.updatedAt).toBeDefined();
  });
});
