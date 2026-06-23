export type SalaryUpdateInput = {
  baseSalary: number;
  bonus: number;
};

export type SalaryAuditInput = {
  employeeId: string;
  changedById: string;
  previousBaseSalary: number;
  newBaseSalary: number;
  previousBonus: number;
  newBonus: number;
};
