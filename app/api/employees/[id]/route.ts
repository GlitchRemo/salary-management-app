import { findEmployeeById } from "@/server/modules/employee/employee.repository";
import { toEmployeeDto } from "@/server/modules/employee/employee.mapper";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await params;

  const employee = await findEmployeeById(id);

  if (!employee) {
    return Response.json(
      { error: { code: "NOT_FOUND", message: "Employee not found" } },
      { status: 404 },
    );
  }

  return Response.json(toEmployeeDto(employee));
}
