import { z } from "zod";
import { updateSalary } from "@/server/modules/salary/salary.service";
import { findFirstHrUserId } from "@/server/modules/hr-user/hr-user.repository";
import { toEmployeeDto } from "@/server/modules/employee/employee.mapper";
import { NotFoundError, ValidationError } from "@/server/errors";

const salaryUpdateSchema = z.object({
  baseSalary: z.number().positive({ message: "Base salary must be greater than 0" }),
  bonus: z.number().min(0, { message: "Bonus must be zero or greater" }),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await params;

  const body = await request.json();
  const result = salaryUpdateSchema.safeParse(body);

  if (!result.success) {
    const details = result.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    return Response.json(
      { error: { code: "VALIDATION_ERROR", message: "Validation failed", details } },
      { status: 400 },
    );
  }

  const changedById = await findFirstHrUserId();
  if (!changedById) {
    return Response.json(
      { error: { code: "INTERNAL_ERROR", message: "No HR user found" } },
      { status: 500 },
    );
  }

  try {
    const updated = await updateSalary({
      employeeId: id,
      baseSalary: result.data.baseSalary,
      bonus: result.data.bonus,
      changedById,
    });
    return Response.json(toEmployeeDto(updated));
  } catch (error) {
    if (error instanceof NotFoundError) {
      return Response.json(
        { error: { code: error.code, message: error.message } },
        { status: 404 },
      );
    }
    if (error instanceof ValidationError) {
      return Response.json(
        { error: { code: error.code, message: error.message } },
        { status: 400 },
      );
    }
    throw error;
  }
}
