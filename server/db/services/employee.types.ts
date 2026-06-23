import type { EmployeeRow } from "@/server/db/repositories/employee.types";

export type EmployeeListItem = EmployeeRow & {
  totalCompensation: number;
};
