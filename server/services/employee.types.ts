import type { EmployeeRow } from "@/server/repositories/employee.types";

export type EmployeeListItem = EmployeeRow & {
  totalCompensation: number;
};
