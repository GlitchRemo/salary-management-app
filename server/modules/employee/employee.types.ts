import type { Employee } from "@/app/generated/prisma/client";

export type EmployeeRow = Pick<
  Employee,
  "id" | "name" | "email" | "department" | "country" | "currency" | "baseSalary" | "bonus"
>;

export type EmployeeListItem = EmployeeRow & {
  totalCompensation: number;
};

export type EmployeeDto = {
  id: string;
  name: string;
  email: string;
  department: string;
  country: string;
  currency: string;
  baseSalary: number;
  bonus: number;
  createdAt: string;
  updatedAt: string;
};
