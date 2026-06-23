import type { Employee } from "@/app/generated/prisma/client";

export type EmployeeRow = Pick<
  Employee,
  "id" | "name" | "email" | "department" | "country" | "currency" | "baseSalary" | "bonus"
>;
