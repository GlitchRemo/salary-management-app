import type { Country, Department, Currency } from "@/app/generated/prisma/enums";

export type CsvRow = {
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  department: Department;
  country: Country;
  currency: Currency;
  baseSalary: number;
  bonus: number;
};

export type CsvParseSuccess = {
  success: true;
  rows: CsvRow[];
};

export type CsvParseFailure = {
  success: false;
  errors: string[];
};

export type CsvParseResult = CsvParseSuccess | CsvParseFailure;
