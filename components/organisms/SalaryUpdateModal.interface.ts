import type { SalaryEmployee } from "./SalaryUpdateModal.types";

export interface SalaryUpdateModalProps {
  employee: SalaryEmployee;
  onUpdate: (baseSalary: number, bonus: number) => Promise<void>;
}
